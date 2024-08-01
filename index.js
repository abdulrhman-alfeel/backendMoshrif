const { express, app, http, server, io } = require("./importMIn");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const { writeFile } = require("fs");
const session = require("express-session");

const errorHandler = require("./middleware/errorHandler");
const limiter = require("./middleware/loginLimiter");
const CreateTable = require("./sql/createteble");
const {
  ChatOpration,
  ChatOprationView,
  ChatOprationStage,
  ChatOprationViewStage,
} = require("./function/chate/ChatJobs");
const uploads = require("./middleware/uploads");
const { uploaddata, bucket } = require("./bucketClooud");
const path = require("path");
const {
  ClassChackTableChat,
  Oprationditals,
} = require("./function/chate/ChatJobsClass");
app.use(cookieparser());
app.use(cors());
// app.use(async()=>{cors()});
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/upload", express.static("upload"));

app.use(
  session({
    secret:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzYWN0aW9uIjoi2LPZhNin2K0g2K7ZgdmK2YEiLCJwcmljZSI6Ijc1MDAiLCJkZXNjcmlwdGlvbiI6ImFzZGZhc2Rmc2RmIGRmIHMgc2Rmc2RmIGRnZGcgc2RkZmFzZGRmc2QgZWYgZ3NhZ2FzZGZzZGZkcyBkc3NkIGRzZmYgZHMgc2ZkIiwiaWF0IjoxNjc3ODUyNTAzLCJleHAiOjE2Nzc5Mzg5MDN9.QeCWuUg1CEW0W-4nTCQ1AYVf8vBlC50jUnI_n6u3vD5h8rIZ7gJ9Uz7db8VL1ODG0M7_RIYi40HYpWQBmalzOqlKQAyqetphOHs2qhSRghu_LzOIkxeEjLh-QXmGVrqz4ybyqN",
    cookie: { httpOnly: true },
    resave: false,
    saveUninitialized: false,
  })
);

PORT = process.env.PORT || 8080;

app.use("/", require("./routes/root"));
app.use("/api/company", require("./routes/company"));
app.use("/api/auth", require("./routes/usersCompany"));
app.use("/api/brinshCompany", require("./routes/companySub"));
app.use("/api/posts", require("./routes/postpublic"));
app.use("/api/Chate", require("./routes/chatroute"));
app.use("/api//videos", require("./routes/vedio"));
app.use("/api/Files", require("./routes/Files"));

module.exports = io;

const bucketName = "YOUR_BUCKET_NAME";
const gcsDir = "uploads/"; // directory in GCS bucket
// const localDir = './upload'; // directory containing old files and images
// const expirationTime = 3600; // 1 hour

// bucket.file("rn_image_picker_lib_temp_d9e7fda9-f1be-4d09-8123-207276072d0e.mp4").getSignedUrl({
// version: 'v4',
// expires: Date.now() + expirationTime * 1000,
// action: 'read',
// }, (err, url) => {
// if (err) {
// console.error(err);
// } else {
// console.log(url); // signed URL
// }
// });
// fs.readdir(localDir, (err, files) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   files.forEach(async(file) => {
//     const filePath = path.join(localDir, file);
//     const fileBuffer = fs.readFileSync(filePath);
//     // await uploaddata(filePath)
//     console.log(filePath)
//     await bucket.upload(filePath)

//   });
// });

// لاستقبال الملفات والصور
app.post("/api/file", uploads.single("file"), async (req, res) => {
  const range = req.range(10000); // specify the maximum size of the resource
  if (range) {
    // handle the range request
    res.set("Content-Type", "multipart/byteranges; boundary=3d6b6a416f9b5");
    res.set("Content-Length", 282);
    res.status(206);
    res.write("--3d6b6a416f9b5\n");
    res.write("Content-Type: text/html\n");
    res.write("Content-Range: bytes 0-50/1270\n\n");
    res.write(
      '<!DOCTYPE html>\n<html lang="en-US">\n<head>\n    <title>Example Do'
    );
    res.write("--3d6b6a416f9b5\n");
    res.write("Content-Type: text/html\n");
    res.write("Content-Range: bytes 100-150/1270\n\n");
    res.write('eta http-equiv="Content-type" content="text/html; c');
    res.write("--3d6b6a416f9b5--\n");
    res.end();
  } else {
    // handle the full request
    await uploaddata(req.file);
    res.send({ success: true, message: "Full request" }).status(200);
  }
});

app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404);

    // console.log(req)
    // res.sendFile(path.json(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

CreateTable();

app.use(limiter);

app.use(errorHandler);

// close the database connection

io.on("connection", (Socket) => {
  // const generateID =  Math.random().toString(36).substring(2, 10);
  Socket.on("newRome", (nameroom) => {
    Socket.join(nameroom);
  });

  ChatOpration(Socket, io);
  ChatOprationView(Socket, io);
  //  io.emit("received_message", "data");
  Socket.on("disconnect", (data) => {
    // Socket.disconnect()

    console.log("user disconnected", data.id);
  });
});

server.listen(PORT, () => {
  console.log(PORT, "SERVER ALREADY");
});
