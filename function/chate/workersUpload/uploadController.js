
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const {createHash} = require('crypto')
const config = require("../../../config");
const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

// Helper for creating file paths
const getChunkPath = (fileId, chunkIndex) => 
  path.join(TEMP_UPLOAD_DIR, `${fileId}_${chunkIndex}`);

const getManifestPath = (fileId) => 
  path.join(TEMP_UPLOAD_DIR, `${fileId}_manifest.json`);

const uploadController = {
  // Initialize a new upload and create manifest
  initializeUpload: () => async (req, res) => {
    try {
      const { fileName, fileSize, contentType, chunks = 1 ,data} = req.body;
      
      if (!fileName || !fileSize || !contentType) {
        return res.status(400).json({ 
          error: 'Missing required fields (fileName, fileSize, contentType)' 
        });
      }
      
      // Generate a unique file ID
      const fileId = req.headers['file-id'] || uuidv4.v4();
      let massges = {
      ...data,
      idSendr:fileId,
    };
      // Create upload manifest
      const manifest = {
        data:massges,
        fileId,
        fileName,
        fileSize: parseInt(fileSize, 10),
        contentType,
        totalChunks: parseInt(chunks, 10),
        receivedChunks: [],
        uploadStarted: Date.now(),
        status: 'initialized',
        //userId: req.user.id
      };
      
      // Save manifest to disk
      fs.writeFileSync(
        getManifestPath(fileId), 
        JSON.stringify(manifest, null, 2)
      );
      
      // Return upload details to client
      res.status(201).json({
        fileId,
        uploadUrl: `${config.apiBaseUrl}/api/uploads/chunk`,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      });
    } catch (error) {
      console.error('Error initializing upload:', error);
      res.status(500).json({ error: 'Failed to initialize upload' });
    }
  },
  
  // Handle an incoming chunk
  handleChunk: (uploadQueue) => async (req, res) => {
    const fileId = req.headers['file-id'];
    const chunkIndex = parseInt(req.headers['chunk-index'] || '0', 10);
    const totalChunks = parseInt(req.headers['total-chunks'] || '1', 10);
    
    if (!fileId) {
      return res.status(400).json({ error: 'Missing File-ID header' });
    }
    
    const manifestPath = getManifestPath(fileId);
    
    // Check if manifest exists
    if (!fs.existsSync(manifestPath)) {
      return res.status(404).json({ error: 'Upload not found or expired' });
    }
    
    try {
      // Read the manifest
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Update manifest with total chunks if provided
      if (totalChunks > manifest.totalChunks) {
        manifest.totalChunks = totalChunks;
      }
      
      // Stream chunk to disk
      const chunkPath = getChunkPath(fileId, chunkIndex);
      const chunkStream = fs.createWriteStream(chunkPath);
      
      // Calculate SHA-256 hash of chunk for integrity verification
      const hash = createHash('sha256');
      
      req.on('data', (chunk) => {
        chunkStream.write(chunk);
        hash.update(chunk);
      });
      
      req.on('end', async () => {
        chunkStream.end();
        const chunkHash = hash.digest('hex');
        
        // Add chunk to manifest
        if (!manifest.receivedChunks.includes(chunkIndex)) {
          manifest.receivedChunks.push(chunkIndex);
          manifest.lastUpdated = Date.now();
        }
        
        // Save updated manifest
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        
        // Check if all chunks received
        if (manifest.receivedChunks.length === manifest.totalChunks) {
          manifest.status = 'processing';
          fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
          
          // Add processing job to queue
          await uploadQueue.add('processUpload', {
            fileId,
            manifest
          }, {
            priority: 2,
            jobId: `process_${fileId}`
          });
        }
        console.log(`Chunk ${chunkIndex} for file ${fileId} received successfully.`);
        // Return response to client
        res.status(200).json({
          fileId,
          chunkIndex,
          receivedChunks: manifest.receivedChunks.length,
          totalChunks: manifest.totalChunks,
          progress: (manifest.receivedChunks.length / manifest.totalChunks) * 100,
          status: manifest.status,
          chunkHash
        });
      });
      
      req.on('error', (error) => {
        console.error(`Error processing chunk ${chunkIndex} for file ${fileId}:`, error);
        res.status(500).json({ error: 'Failed to process chunk' });
      });
      
    } catch (error) {
      console.error('Error handling chunk:', error);
      res.status(500).json({ error: 'Failed to process chunk' });
    }
  },
  
  // Get information needed to resume an upload
  getResumeInfo: async (req, res) => {
    const { fileId } = req.params;
    const manifestPath = getManifestPath(fileId);
    
    if (!fs.existsSync(manifestPath)) {
      return res.status(404).json({ error: 'Upload not found or expired' });
    }
    
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Calculate bytes received by reading actual chunk sizes
      let bytesReceived = 0;
      
      for (const chunkIndex of manifest.receivedChunks) {
        const chunkPath = getChunkPath(fileId, chunkIndex);
        if (fs.existsSync(chunkPath)) {
          const stats = fs.statSync(chunkPath);
          bytesReceived += stats.size;
        }
      }
      
      res.status(200).json({
        fileId,
        uploadUrl: `${config.apiBaseUrl}/api/uploads/chunk`,
        fileName: manifest.fileName,
        fileSize: manifest.fileSize,
        contentType: manifest.contentType,
        receivedChunks: manifest.receivedChunks,
        totalChunks: manifest.totalChunks,
        bytesReceived,
        progress: (manifest.receivedChunks.length / manifest.totalChunks) * 100,
        status: manifest.status
      });
    } catch (error) {
      console.error('Error getting resume info:', error);
      res.status(500).json({ error: 'Failed to get resume information' });
    }
  },
  
  // Cancel an upload
  cancelUpload: (uploadQueue) => async (req, res) => {
    const { fileId } = req.params;
    const manifestPath = getManifestPath(fileId);
    
    if (!fs.existsSync(manifestPath)) {
      return res.status(404).json({ error: 'Upload not found or expired' });
    }
    
    try {
      // Remove any pending jobs
      const processJob = await uploadQueue.getJob(`process_${fileId}`);
      
      if (processJob) {
        await processJob.remove();
      }
      
      // Delete all file chunks
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      for (let i = 0; i < manifest.totalChunks; i++) {
        const chunkPath = getChunkPath(fileId, i);
        if (fs.existsSync(chunkPath)) {
          fs.unlinkSync(chunkPath);
        }
      }
      
      // Delete manifest
      fs.unlinkSync(manifestPath);
      
      res.status(200).json({ message: 'Upload cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling upload:', error);
      res.status(500).json({ error: 'Failed to cancel upload' });
    }
  }
};

module.exports=  uploadController;