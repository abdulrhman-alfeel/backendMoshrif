const { express, app, http, server, io } = require("./importMIn");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const { writeFile } = require("fs");
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
const fs = require("fs");
// app.use(async()=>{cors()});
app.use(express.json());
const { fFmpegFunction } = require("./middleware/ffmpeg");
const { massges } = require("./middleware/sendNotification");

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

// Sample HTML content

app.post("/api/file", uploads.single("filechate"), async (req, res) => {
  try {
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
      try {
        await uploaddata(req.file);
      } catch (error) {
        console.log(error);
      }
      const timePosition = "00:00:00.100";
      const filename = String(req.file.filename).replace("mp4", "png");
      const tempFilePathtimp = `upload/${filename}`;

      res
        .send({ success: "Full request", nameFile: req.file.filename })
        .status(200);
      try {
        // console.log(filename, req.file);
        // إنشاء وظيفة لمنع هذه الوظيفة للصور والملفات غير الفديو
        if (req.file.mimetype === "video/mp4") {
          await fFmpegFunction(tempFilePathtimp, req.file.path, timePosition);
          setTimeout(async () => {
            await bucket.upload(tempFilePathtimp);
          }, 1000);
          setTimeout(() => fs.unlink(tempFilePathtimp, () => {}), 1500);
        }
      } catch (error) {
        console.log(error);
      }
      setTimeout(async () => {
        await fs.unlink(req.file.path, () => {});
      }, 500);
    }
  } catch (error) {
    console.log(error);
    res.send({ success: "فشلة عملية رفع الملف" }).status(404);
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
