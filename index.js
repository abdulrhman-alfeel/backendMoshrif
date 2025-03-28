// ChatJobsClass.js
// index.js 
// uploads.js
// chatroute.js
// companySub.js
// Fsfile.js
const { express, app,  server,io} = require("./importMIn");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const helmet = require('helmet');
const errorHandler = require("./middleware/errorHandler");
const { deleteFilesInFolder } = require("./middleware/Fsfile");
const limiter = require("./middleware/loginLimiter");
const { CreateTable } = require("./sql/createteble");
const { ChatOpration, ChatOprationView } = require("./function/chate/ChatJobs");
const {uploads,handleUploadErrors} = require("./middleware/uploads");
const { uploaddata, bucket } = require("./bucketClooud");
const { fFmpegFunction } = require("./middleware/ffmpeg");
const { verifyJWT } = require("./middleware/jwt");
const { Queue } = require("bullmq");
const { ExpressAdapter } = require("@bull-board/express");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter.js");
const { createBullBoard } = require("@bull-board/api");
const  config  = require("./config.js");
const {uploadRoutes} = require('./routes/upload.js')



// Set up middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Initialize upload queue
const uploadQueue = new Queue('fileUploads', {
  connection: config.redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: false,
    removeOnFail: false
  }
});

// Set up Bull Board for queue monitoring
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(uploadQueue)],
  serverAdapter
});
serverAdapter.setBasePath('/admin/queues');



app.use(cookieparser());
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
// الربط المالي
app.use("/apis/company", require("./routes/apiMoshrif"));
// **********
app.use("/api/auth", require("./routes/login"));
app.use("/api/company", require("./routes/company"));
app.use("/api/user", require("./routes/usersCompany"));
app.use("/api/brinshCompany", require("./routes/companySub"));
app.use("/api/posts", require("./routes/postpublic"));
app.use("/api/Chate", require("./routes/chatroute"));
app.use("/api//videos", require("./routes/vedio"));
app.use("/api/Files", require("./routes/Files"));

app.use('/admin/queues', serverAdapter.getRouter());

// Initialize route handlers
app.use('/api', uploadRoutes({ uploadQueue }));


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
    deleteFilesInFolder("./upload");
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(200);
  }
});

app.post(
  "/api/file",
  verifyJWT,
  uploads.single("filechate"),
  async (req, res) => {
    try {
      await uploaddata(req.file);
      // console.log(req.file);

      const timePosition = "00:00:00.100";
      let filename = 
        req.file.filename.match(/\.([^.]+)$/)[1] === "MOV" ||
        req.file.filename.match(/\.([^.]+)$/)[1] === "mov"
          ? String(req.file.filename).replace("MOV", "png")
          : String(req.file.filename).replace("mp4", "png");

      const tempFilePathtimp = `upload/${filename}`;
      // إنشاء وظيفة لمنع هذه الوظيفة للصور والملفات غير الفديو
      if (
        req.file.mimetype === "video/mp4" ||
        req.file.mimetype === "video/quicktime"
      ) {
        await fFmpegFunction(tempFilePathtimp, req.file.path, timePosition);
        const times = setTimeout(async () => {
          await bucket.upload(tempFilePathtimp);
        }, 1000);
        res
        .send({ success: "Full request", nameFile: req.file.filename })
        .status(200);
        return () => clearTimeout(times)
      }else{
        res
          .send({ success: "Full request", nameFile: req.file.filename })
          .status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "فشلة عملية رفع الملف" }).status(500);
    }
  }
);





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

io.on("connection", (socket) => {
      // Handle client joining a file room for updates
      socket.on('trackUpload', async (fileId) => {
        // Join the room for this file
        socket.join(`file:${fileId}`);
        // console.log(`Socket ${socket.id} tracking upload ${fileId}`);
        
        try {
          // Get current job status if available
          const processJob = await uploadQueue.getJob(`process_${fileId}`);
                  
          if (processJob) {
            const jobState = await processJob.getState();
            // Send current status to newly connected client
            socket.emit('uploadProgress', {
              fileId,
              status: jobState,
              timestamp: Date.now(),
              
            });
          }
        } catch (error) {
          console.error(`Error getting job status for ${fileId}:`, error);
        }
      });
      
      // Handle client untracking an upload
      socket.on('untrackUpload', (fileId) => {
        socket.leave(`file:${fileId}`);
        // console.log(`Socket ${socket.id} stopped tracking upload ${fileId}`);
      });
      
  // const generateID =  Math.random().toString(36).substring(2, 10);
  socket.on("newRome", (nameroom) => {
    socket.join(nameroom);
  });
  ChatOpration(socket, io);
  ChatOprationView(socket, io);
  //  io.emit("received_message", "data");
  socket.on("disconnect", (data) => {
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




// const { GoogleAuth } = require('google-auth-library');
// async function getAccessToken() {
//   // قراءة بيانات الاعتماد من ملف JSON
//   const auth = new GoogleAuth({
//     keyFile: "backendMoshrif.json", // استبدل هذا بمسار ملف JSON الخاص بحساب الخدمة
//     scopes: ['https://www.googleapis.com/auth/cloud-platform'], // نطاقات الوصول المطلوبة
//   });

//   const client = await auth.getClient();
//   const accessToken = await client.getAccessToken();

//   console.log('Access Token:', accessToken);
//   return accessToken;
// }

// getAccessToken().catch(console.error);



// Error handling middleware
app.use(handleUploadErrors);


server.listen(PORT, () => {
  console.log(PORT, "SERVER ALREADY");
});
