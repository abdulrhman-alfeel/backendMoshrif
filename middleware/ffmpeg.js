const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);


const fFmpegFunction = (filename, tempFilePath, timePosition) => {
  return new Promise((resolve,reject)=>{
    try {
      ffmpeg(tempFilePath)
        .screenshots({
          timestamps: [timePosition],
          filename: filename,
          size: "150x100",
        })
        .on("end", async () => {
          resolve()
          // Clean up temporary files
        })
        .on("error", (error) => {
          console.log(error);
          reject()

        });
    } catch (error) {
      console.log(error);
    }
  })
  };



// console.log(ffmpegInstaller.path, ffmpegInstaller.version);

module.exports = {fFmpegFunction};
