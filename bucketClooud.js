const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const storage = new Storage({
  keyFilename: "backendMoshrif.json",
});
// const bucketName = "demo_backendmoshrif-1";
const bucketName = "demo_backendmoshrif_bucket-1";

const bucket = storage.bucket(bucketName);
async function uploaddata(file) {
  // const blob = bucket.file(file.filename);
  try {
    await bucket.upload(file.path);
  } catch (error) {
    console.log(error);
  }

}

   const uploadFile = async (filePath, destination) => {

        return new Promise((resolve, reject) => {
        
        const fileStream = fs.createReadStream(filePath);
        
        const file = bucket.file(destination);
        
        fileStream.pipe(file.createWriteStream())
        
        .on('finish', () => {
        
        console.log(`Upload complete: ${destination}`);
        
        fs.unlinkSync(filePath, (err) => {
        
        if (err) console.error('File deletion error:', err);
        
        });
        
        resolve();
        
        })
        
        .on('error', (err) => {
        
        console.error('Upload error:', err);
        
        reject(err);
        
        });
        
        });
        
        };
async function DeleteBucket (nameOld){
  try {
    const file = bucket.file(nameOld);
    await file
    .delete()
    .then(() => {
      // console.log(`File ${nameOld} deleted from bucket`);
    })
    .catch((err) => {
      console.log(`Error deleting file: ${err}`);
    });  } catch (error) {
    console.log(error);
  }
}
async function RenameBucket (nameOld,name){
  try {
    const file = bucket.file(nameOld);
    await file
    .rename(name)
    .then(() => {
      // console.log(`File renamed to ${name}`);
    })
    .catch((err) => {
      console.error(`Error renaming file: ${err}`);
    });  } catch (error) {
    console.log(error);
  }
}

async function checkIfFileExists(fileName) {
  return new Promise(async (resolve, reject) => {
    const file = bucket.file(fileName);

    try {
      // Check if the file exists
      const [exists] = await file.exists();
      if (exists) {
        resolve(exists);
        // console.log(`The file ${exists} exists in the bucket ${fileName}.`);
      } else {
        resolve(exists);
        // console.log(`The file ${fileName} does not exist in the bucket ${bucketName}.`);
      }
    } catch (error) {
      console.log("Error checking file existence:", error);
    }
  });
}

module.exports = { uploaddata, bucket,uploadFile, checkIfFileExists,DeleteBucket,RenameBucket };
