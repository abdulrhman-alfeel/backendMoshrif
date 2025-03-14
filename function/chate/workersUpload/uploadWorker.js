
const {Worker} = require('bullmq');
const fs = require('fs');
const path = require('path');
const {Emitter} = require("@socket.io/redis-emitter");
const {Redis} = require('ioredis');
const { bucket } = require('../../../bucketClooud');
const { OpreactionSend_message } = require('../ChatJobsClass');
const { io } = require('../../../importMIn');
const { fFmpegFunction } = require('../../../middleware/ffmpeg');
const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads');

// Ensure temp directories exist
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

const initializeWorker = (config) => {

  // Initialize Redis client for Socket.IO emitter
  const redisClient = new Redis(config.redis);
  
  // Create Socket.IO Redis emitter
  const socketEmitter = new Emitter(redisClient);

  // Helper functions
  const getChunkPath = (fileId, chunkIndex) => 
    path.join(TEMP_UPLOAD_DIR, `${fileId}_${chunkIndex}`);
  
  const getManifestPath = (fileId) => 
    path.join(TEMP_UPLOAD_DIR, `${fileId}_manifest.json`);
  
  const updateProgress = (fileId, progress, status, message = null) => {
    // Emit progress update via Socket.io
    socketEmitter.to(`file:${fileId}`).emit('uploadProgress', {
      fileId,
      progress,
      status,
      message,
      timestamp: Date.now()
    });
    
    // Update manifest if it exists
    const manifestPath = getManifestPath(fileId);
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        manifest.status = status;
        manifest.lastUpdated = Date.now();
        
        if (status === 'completed') {
          manifest.uploadCompleted = Date.now();
        }
        
        if (message) {
          manifest.statusMessage = message;
        }
        
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      } catch (error) {
        console.error(`Error updating manifest for ${fileId}:`, error);
      }
    }
  };
  
  // Create the BullMQ worker
  const uploadWorker = new Worker('fileUploads', async (job) => {
    const { name, data } = job;
    const { fileId } = data;
    
    try {
      // Different job types
      switch (name) {
        case 'processUpload':
          await processUpload(data);
          break;
        default:
          throw new Error(`Unknown job type: ${name}`);
      }
      
      return { success: true, fileId };
    } catch (error) {
      console.error(`Worker error processing ${name} for ${fileId}:`, error);
      updateProgress(fileId, 0, 'failed', error.message);
      throw error; // Re-throw to let BullMQ handle retries
    }
  }, {
    connection: config.redis,
    concurrency: config.worker.concurrency || 2,
    limiter: {
      max: 5, // Max jobs processed per duration
      duration: 1000 // 1 second
    }
  });
  
  // Handle worker events
  uploadWorker.on('completed', (job) => {
    const { fileId } = job.data;
    // console.log(`Job ${job.id} for file ${fileId} completed successfully`);
  });
  
  uploadWorker.on('failed', (job, error) => {
    const { fileId } = job.data;
    console.error(`Job ${job.id} for file ${fileId} failed:`, error);
    updateProgress(fileId, 0, 'failed', error.message);
  });
  
  // Combined process function: assembles chunks and saves to final location in one step
  async function processUpload({ fileId, manifest }) {
    updateProgress(fileId, 0, 'processing', 'Starting to process uploaded chunks');
    
    // تحديد اسم الملف والامتداد بناءً على contentType
    const fileName = manifest.fileName;
    const contentType = manifest.contentType;
    // const dateFolder = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // // تحديد الامتداد بناءً على contentType
    // let fileExtension = '';
    // if (contentType === 'video/mp4') {
    //     fileExtension = '.mp4';
    // } else if (contentType === 'image/jpeg') {
    //     fileExtension = '.jpg';
    // } else if (contentType === 'image/png') {
    //     fileExtension = '.png';
    // } else if (contentType === 'application/pdf') {
    //     fileExtension = '.pdf';
    // } else {
    //     fileExtension = '';  // يمكن إضافة أنواع أخرى حسب الحاجة
    // }

    // // التأكد من أن اسم الملف يتضمن الامتداد
    // const finalFileName = `${fileId}_${fileName}${fileExtension}`;
    const finalFileName = `${fileId}_${fileName}`;
    
    // إنشاء هيكل المجلد المناسب
    const storagePath = `/${finalFileName}`;
    const finalFilePath = path.join(config.storage.path, storagePath);
    const finalFileDir = path.dirname(finalFilePath);
    
    // إنشاء المجلد إذا لم يكن موجودًا
    if (!fs.existsSync(finalFileDir)) {
        fs.mkdirSync(finalFileDir, { recursive: true });
    }
    
    // فتح مجرى الكتابة للملف النهائي
    const writeStream = fs.createWriteStream(finalFilePath);
    
    // ترتيب الأجزاء حسب الفهرس لضمان الترتيب الصحيح
    const sortedChunks = [...manifest.receivedChunks].sort((a, b) => a - b);
    
    // تتبع التقدم
    let chunksProcessed = 0;
    const totalChunks = sortedChunks.length;
    
    for (const chunkIndex of sortedChunks) {
        const chunkPath = getChunkPath(fileId, chunkIndex);
        
        if (!fs.existsSync(chunkPath)) {
            throw new Error(`Missing chunk ${chunkIndex} for file ${fileId}`);
        }
        
        await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(chunkPath);
            
            readStream.on('end', () => {
                chunksProcessed++;
                const progress = Math.round((chunksProcessed / totalChunks) * 100);
                updateProgress(fileId, progress, 'processing', 
                    `Processed ${chunksProcessed} of ${totalChunks} chunks`);
                resolve();
            });
            
            readStream.on('error', (error) => {
                reject(new Error(`Error reading chunk ${chunkIndex}: ${error.message}`));
            });
            
            readStream.pipe(writeStream, { end: false });
        });
        
        // حذف الجزء بعد معالجته إذا تم تمكين التنظيف
        if (config.cleanupTempFiles) {
            fs.unlinkSync(chunkPath);
        }
    }

    
    // await readJsonFile(manifestfile);
    // إغلاق ملف الكتابة
    await new Promise((resolve, reject) => {
        writeStream.end(() => resolve());
        writeStream.on('error', reject);
    });



    

    // الرابط النهائي للوصول إلى الملف
    const finalUrl = `${config.apiBaseUrl}/upload/${storagePath}`
    
    // تحديث الـ manifest مع الرابط النهائي
    const manifestPath = getManifestPath(fileId);
    if (fs.existsSync(manifestPath)) {
        const updatedManifest = { ...manifest };
        updatedManifest.status = 'completed';
        updatedManifest.uploadCompleted = Date.now();
        updatedManifest.storagePath = storagePath;
        updatedManifest.url = finalUrl;
        fs.writeFileSync(manifestPath, JSON.stringify(updatedManifest, null, 2));
    }
    const TEMP_UPLOAD_DIR = path.join( 'tmp', 'uploads');
    const manifestfile = path.join(TEMP_UPLOAD_DIR, `${fileId}_manifest.json`);
    // console.log('readfile',manifestfile);
    await readJsonFile(manifestfile);
    // تحديث التقدم النهائي
    updateProgress(fileId, 100, 'completed', 'Upload completed successfully');

    await bucket.upload(finalFilePath);

    if (contentType === "video/mp4" || contentType === "video/quicktime") {
      const timePosition = "00:00:00.100";
      let matchvideo = finalFileName.match(/\.([^.]+)$/)[1];
      let filename = String(finalFileName).replace(matchvideo, "png");

      const pathdir = path.dirname(finalFilePath);
      const tempFilePathtimp = `${pathdir}/${filename}`;

      await fFmpegFunction(tempFilePathtimp, finalFilePath, timePosition);
      await bucket.upload(tempFilePathtimp);
      fs.unlinkSync(finalFilePath);
      fs.unlinkSync(tempFilePathtimp);

    }
    return {
        success: true,
        url: finalUrl,
        storagePath,
        fileId
    };
}

  
const readJsonFile = async (filePath) => {
  await fs.readFile(filePath, 'utf8', async(err, data) => {
      // console.log(data);
      if (err) {
          return console.error('Error reading file:', err);
      }
      try {
          // Parse the JSON data
          const jsonData = JSON.parse(data);
          const result = await OpreactionSend_message(jsonData.data);
          fs.unlinkSync(filePath);
          // console.log('JSON Data:', jsonData.data);
          io.to(`${jsonData.data.ProjectID}:${jsonData.data?.StageID}`)
            .timeout(50)
            .emit("received_message", result);
      } catch (parseErr) {
          console.error('Error parsing JSON:', parseErr);
      }
  });
};
  // console.log(`Upload worker initialized with concurrency ${config.worker.concurrency}`);
  return uploadWorker;
};






module.exports = {initializeWorker}