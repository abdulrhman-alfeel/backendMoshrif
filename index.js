// selectuser.js
// HR.js
// bringHR.js
// opreationPreparation.js
// systemUpdet.js
// companySub.js


// INsertteble.js
// createteble.js
// selected.js
// update.js
// Aid.js
// jwt.js
// writHtml.js
// insertProject.js
// UpdateProject.js
// opreationSubscripation.js

// redis-server.exe
// PS D:\ppp\aldy\Purebred_horses\38\backend> Set-ExecutionPolicy -ExecutionPolicy
//  Bypass -Scope Process
// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypas

// {"uri":"file:///data/user/0/com.musharaf/cache/639fdb6a-cb9d-4b3f-8fc2-588e8dbb6fd2.mp4","uriImage":"","name":"5024645301744614590110-mrousavy894299404789797299.mov","type":"video/quicktime","size":"142.91 MB","location":{"latitude":24.8704664,"longitude":46.6504611}}

// https://www.youtube.com/watch?v=sTDVsMUegL8
// https://www.youtube.com/watch?v=XbFQj7NYjZQ

const { express, app, server, io } = require("./importMIn");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");
const { deleteFilesInFolder } = require("./middleware/Fsfile");
const { CreateTable } = require("./sql/createteble");
const { ChatOpration, ChatOprationView } = require("./function/chate/ChatJobs");
const { uploads, handleUploadErrors } = require("./middleware/uploads");
const { uploaddata, bucket } = require("./bucketClooud");
const { fFmpegFunction } = require("./middleware/ffmpeg");
const { verifyJWT } = require("./middleware/jwt");
const limiter = require("./middleware/loginLimiter.js");
const { Queue } = require("bullmq");
const config = require("./config.js");
const { ExpressAdapter } = require("@bull-board/express");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter.js");
const { createBullBoard } = require("@bull-board/api");
const { companySub } = require("./routes/companySub");
const company = require("./routes/company");
const postpublic = require("./routes/postpublic");
const chatroute = require("./routes/chatroute");
const usersCompany = require("./routes/usersCompany");
const Login = require("./routes/login");
const apiMoshrif = require("./routes/apiMoshrif");
const HR = require("./routes/HR.js");
const Templet = require("./routes/Templet.js");
const simpleCompanies = require("./DashbordMoshrif/simple-companies");
const simpleAuth = require("./DashbordMoshrif/simple-auth");
const simpleDashboard = require("./DashbordMoshrif/simple-dashboard");
const stageTemplates = require("./DashbordMoshrif/stageTemplates");
const loginActivity = require("./DashbordMoshrif/loginActivity");
const cron = require("node-cron");
const moment = require("moment-timezone");

require("dotenv").config();
const path = require("path");
const {
  operationInvoice,
  checkCompanySubscriptions,
} = require("./function/subscripation/opreationSubscripation.js");
const {
  verificationSend,
} = require("./function/companyselect/userCompanyselect.js");
const { SELECTTablecompany } = require("./sql/selected/selected.js");
const { UpdateStateComany } = require("./sql/update.js");
const { calculateendDate } = require("./middleware/Aid.js");
const subScription = require("./routes/subScription.js");

// Set up middlewares
app.use(cors());
// app.use(helmet());
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://mushrf.net"],
    },
  })
);

app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/upload", express.static("upload"));
app.use(express.static(path.join(__dirname, "/build")));

app.use(
  session({
    secret: process.env.SECRET,
    cookie: { httpOnly: true },
    resave: false,
    saveUninitialized: false,
  })
);

const PORT = process.env.PORT || 8080;

const uploadQueue = new Queue("project-requests", {
  connection: config.redis,
  defaultJobOptions: {
    attempts: 10, // Reduced attempts to 10 for less retries
    backoff: {
      type: "exponential",
      delay: 2000, // Reduced initial delay to 2 seconds for faster retry
    },
    removeOnComplete: true, // Automatically remove successful jobs to free memory
    removeOnFail: false, // Keep failed jobs for diagnostics
  },
});

// Set up Bull Board for queue monitoring
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(uploadQueue)],
  serverAdapter,
});
serverAdapter.setBasePath("/admin/queues");
app.use("/admin/queues", serverAdapter.getRouter());

// app.use("/", require("./routes/root"));

// الربط المالي
app.use("/apis/company", apiMoshrif({ uploadQueue }));
app.use("/api/auth", Login({ uploadQueue }));
app.use("/api/user", usersCompany({ uploadQueue }));
app.use("/api/company", company({ uploadQueue }));

app.use("/api/brinshCompany", companySub({ uploadQueue }));
app.use("/api/posts", postpublic({ uploadQueue }));
app.use("/api/Chate", chatroute({ uploadQueue }));
app.use("/api/HR", HR({ uploadQueue }));
app.use("/api/Templet", Templet({ uploadQueue }));
app.use("/api/subScription", subScription({ uploadQueue }));
app.use("/Maintenance", require("./systemUpdate.js"));
// app.use("/api/dashbord", require("./routes/DashbordMoshrif"));

// تسجيل الـ routes
app.use("/api/dashbord/auth", simpleAuth);
app.use("/api/companies", simpleCompanies);
app.use("/api/dashboard", simpleDashboard);
app.use("/api/stage-templates", stageTemplates);
app.use("/api/login-activity", loginActivity);

// لاستقبال الملفات والصور
app.post("/companies/delete", async (req, res) => {
  const { id, phone, reason } = req.body;
  if (
    String(id).length > 0 &&
    String(phone).length > 0 &&
    String(reason).length > 0
  ) {
    res
      .send({
        ok: true,
        message: "طلبك قيد المراجعه سوف يتم ابلاغك عند اتمام عملية الحذف",
      })
      .status(200);
  } else {
    res.send({ ok: true, message: "نرجو اكمال البيانات " }).status(200);
  }
});
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
        return () => clearTimeout(times);
      } else {
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


app.get('/updatecomapny',async (req,res)=>{
  const idcompany = req.query.id
  const datacompany = await SELECTTablecompany(idcompany);

  const state = datacompany.State === 'true'? "false":"true";
  const Suptype = datacompany.Suptype === 'مجاني'? "مدفوع": "مجاني"
  await UpdateStateComany(state, idcompany, "State");
  await UpdateStateComany(Suptype, idcompany, "Suptype");
  res.status(200).send({success:'تمت العملية بنجاح '})

})






CreateTable();

app.use(limiter);

app.use(errorHandler);

app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404);
    res.sendFile(path.json(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

io.on("connection", (socket) => {
  socket.on("newRome", (nameroom) => {
    socket.join(nameroom);
  });
  ChatOpration(socket, io);
  ChatOprationView(socket, io);
  socket.on("disconnect", (data) => {});
});

// Error handling middleware
app.use(handleUploadErrors);

// const cluster = require("cluster");
// const os = require("os");

// const numCPUs = os.cpus().length;
// // console.log(`Number of CPUs: ${numCPUs}`);
// if (cluster.isMaster) {
//   console.log(`👑 Master ${cluster.isMaster} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

// } else {

// }

// جدولة المهمة لتعمل مرة باليوم (الساعة 12 صباحاً)
cron.schedule("0 0 * * *", () => {
  console.log("⏰ تشغيل التحقق اليومي من الاشتراكات...");
  verificationSend(
    "502464530",
    null,
    "⏰ تشغيل التحقق اليومي من الاشتراكات..."
  );
  checkCompanySubscriptions();
});
const month = moment.parseZone(new Date()).format("yy-MM");
cron.schedule(`0 0 ${calculateendDate(month)} ${moment(new Date()).format("MM")} *`, () => {
  verificationSend(
    "502464530",
    null,
    "⏰ تشغيل اضافة الفواتير الشهرية  للأشتراكات..."
  );
  operationInvoice();
});


server.listen(PORT, () => {
  console.log(PORT, "SERVER ALREADY");
});
