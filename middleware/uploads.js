const fs = require("fs");
const multer = require("multer");

const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "upload/";

    fs.access(dir, function (error) {
      if (error) {
        console.log("Directory does not exist ,");
        return fs.mkdir(dir, (error) => cb(error, dir));
      } else {
        console.log("Directory exists.");
        return cb(null, dir);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storages });
module.exports = uploads;
