// writHtml.js
// bringProject.js
// default-security-backend-service-ssl-tutorial-backend-service

const { express, app,  server, io } = require("./importMIn");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const session = require("express-session");

const errorHandler = require("./middleware/errorHandler");
const limiter = require("./middleware/loginLimiter");
const { CreateTable } = require("./sql/createteble");
const { ChatOpration, ChatOprationView } = require("./function/chate/ChatJobs");
const uploads = require("./middleware/uploads");
const { uploaddata, bucket } = require("./bucketClooud");
const path = require("path");
app.use(cookieparser());
app.use(cors());
const fs = require("fs").promises;
// app.use(async()=>{cors()});
app.use(express.json());
const { fFmpegFunction } = require("./middleware/ffmpeg");

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
app.use("/api/auth", require("./routes/login"));
app.use("/api/company", require("./routes/company"));
app.use("/api/user", require("./routes/usersCompany"));
app.use("/api/brinshCompany", require("./routes/companySub"));
app.use("/api/posts", require("./routes/postpublic"));
app.use("/api/Chate", require("./routes/chatroute"));
app.use("/api//videos", require("./routes/vedio"));
app.use("/api/Files", require("./routes/Files"));

// لاستقبال الملفات والصور
app.get("/UploadDatabase", async (req, res) => {
  try {
    await bucket.upload("./mydatabase.db");
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(200);
  }
});
// لحذف الملفات
app.get("/deleteFileUpload", async (req, res) => {
  try {
    deleteFilesInFolder('./upload');
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(200);
  }
});

async function deleteFilesInFolder(folderPath) {

    // Get a list of files in the folder
    try {
      // Get a list of files and directories in the folder
      const files = await fs.readdir(folderPath);
  
      // Loop through each file or directory
      for (let file of files) {
        const filePath = path.join(folderPath, file);
        const stat = await fs.stat(filePath);
  
        // If it's a directory, call this function recursively to delete its contents
        if (stat.isDirectory()) {
          await deleteFilesInFolder(filePath);  // Recurse into subdirectory
        } else if (stat.isFile()) {
          await fs.unlink(filePath);  // Delete file
          console.log(`Deleted file: ${filePath}`);
        }
      }
    } catch (err) {
      console.error('Error deleting files:', err);
    }
}



// Sample HTML content

// Consume messages from the queue
app.post("/api/file", uploads.single("filechate"), async (req, res) => {
  try {
    await uploaddata(req.file);
    // console.log(req.file);

    res
      .send({ success: "Full request", nameFile: req.file.filename })
      .status(200);
    const timePosition = "00:00:00.100";
    const filename = req.file.filename.match(/\.([^.]+)$/)[1] === 'MOV'? String(req.file.filename).replace("MOV", "png") : String(req.file.filename).replace("mp4", "png");
    const tempFilePathtimp = `upload/${filename}`;
    // console.log(filename, req.file);
    // إنشاء وظيفة لمنع هذه الوظيفة للصور والملفات غير الفديو
    if (req.file.mimetype === "video/mp4" || req.file.mimetype === "video/quicktime") {
      await fFmpegFunction(tempFilePathtimp, req.file.path, timePosition);
      setTimeout(async () => {
        await bucket.upload(tempFilePathtimp);
      }, 1000);

      // clearTimeout(timeout);
      // setTimeout(() => fs.unlink(tempFilePathtimp, () => {}), 1500);
    }

    // setTimeout(async () => {
    //   await fs.unlink(req.file.path, () => {});
    // }, 500);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشلة عملية رفع الملف" }).status(500);
  }
});

CreateTable();

app.use(limiter);

app.use(errorHandler);

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
    // console.log("user disconnected", data.id);
  });
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

server.listen(PORT, () => {
  console.log(PORT, "SERVER ALREADY");
});
