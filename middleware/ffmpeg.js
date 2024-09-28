const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);


const fFmpegFunction = (filename, tempFilePath, timePosition) => {
    try {
      ffmpeg(tempFilePath)
        .screenshots({
          timestamps: [timePosition],
          filename: filename,
          size: "220x140",
        })
        .on("end", async () => {
          // Clean up temporary files
        })
        .on("error", (error) => {
          console.log(error);

        });
    } catch (error) {
      console.log(error);
    }
  };



// console.log(ffmpegInstaller.path, ffmpegInstaller.version);

module.exports = {ffmpeg,fFmpegFunction};
