const { Storage } = require("@google-cloud/storage");

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
  // const blobStream = blob.createWriteStream({
  //   metadata:{
  //     contentType:file.mimetype,
  //   }
  // });

  // blobStream.on("error",(err)=>{
  //   console.log(err)
  // })

  // blobStream.on("finish",()=>{
  //   console.log('finsh upload filed');
  // });
  // blobStream.end(file.path)
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

module.exports = { uploaddata, bucket, checkIfFileExists };
