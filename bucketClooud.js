const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  keyFilename: "backendMoshrif.json",
});
// const bucketName = "demo_backendmoshrif-1";
const bucketName = "demo_backendmoshrif_bucket-2";

const bucket = storage.bucket(bucketName);
async function uploaddata(file) {
  const blob = bucket.file(file.originalname);

  await bucket.upload(file.path);
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

module.exports = { uploaddata, bucket };
