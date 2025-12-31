const { lenBetween, parsePositiveInt, sanitizeFilename, isNonEmpty,toISO } = require("../../middleware/Aid");
const { DeleteTableLikesPostPublic } = require("../../sql/delete");
const {
  insertTablePostPublic,
  insertTableChateStage,
} = require("../../sql/INsertteble");

const {
  insertTableLikesPostPublic,
  insertTableCommentPostPublic,
} = require("../../sql/INsertteble");
const {
  SELECTTableLikesPostPublicotherroad,
  SELECTTableIDcompanytoPost,
  SELECTDataPrivatPostonObject,
} = require("../../sql/selected/selected");
const { Postsnotification } = require("../notifcation/NotifcationProject");

// ===== Helpers (بدون مكتبات): تطبيع/تحقق/تنظيف =====



const ALLOWED_VIDEO_MIMES = [
  "video/mp4","video/webm","video/ogg","video/quicktime","video/x-msvideo","video/x-matroska"
];
const MAX_VIDEO_SIZE = 300 * 1024 * 1024; // 300MB (عدّل حسب حاجتك)

// ===================================================================
// insertPostURL: إدراج منشور فيديو (من رابط محفوظ لديك)
// ===================================================================
// const insertPostURL = async (items) => {
//   try {
//     // تحقق أساسي من الكائن
//     if (!items || typeof items !== "object") return;

//     // تحقق من وجود ملف ونوعه (فيديو)
//     const file = items.File || {};
//     const fileType = String(file.type || "").toLowerCase();
//     const fileName = sanitizeFilename(file.name || "");
//     if (!isNonEmpty(fileType) || !fileType.includes("video")) return;

//     // (اختياري) لو توفر لديك الحجم:
//     if (Number.isFinite(file.size) && file.size > MAX_VIDEO_SIZE) {
//       console.warn("insertPostURL: video too large");
//       return;
//     }

//     // تحقق من الحقول الضرورية
//     const sender    = String(items.Sender ?? "").trim();
//     const message   = String(items.message ?? "").trim();
//     const stageId   = items.StageID;
//     const projectId = parsePositiveInt(items.ProjectID);

//     if (!isNonEmpty(sender))            throw new Error("Sender is required");
//     if (!Number.isFinite(projectId))    throw new Error("ProjectID invalid");
//     if (!isNonEmpty(stageId))           throw new Error("StageID invalid");
//     if (!ALLOWED_VIDEO_MIMES.some(m => fileType.includes(m.split("/")[1]) || m === fileType)) {
//       // نسمح بأي video/* لكن نفضّل من القائمة
//       console.warn("insertPostURL: non-preferred video mime", fileType);
//     }

//     // جلب بيانات المشروع/الشركة
//     const result = await SELECTTableIDcompanytoPost(projectId);
//     if (!result) throw new Error("Project not found");

//     const data = [
//       sender,
//       fileName || "video",           // اسم ظاهر
//       fileType,
//       message || '',               // قد يكون null
//       toISO(),                       // وقت UTC ISO
//       stageId,
//       projectId,
//       result.IDcompanySub,
//       result.NumberCompany,
//     ];

//     await insertTablePostPublic(data);
//   } catch (err) {
//     console.log("insertPostURL error:", err.message);
//   }
// };

const insertPostURL = async (items) => {
  try {
    if (Object.entries(items.File).length > 0) {
      if (String(items.File.type).includes("video")) {
        const result = await SELECTTableIDcompanytoPost(items.ProjectID);
        const data = [
          items.Sender,
          items.File.name,
          items.File.type,
          items.message,
          `${new Date().toUTCString()}`,
          items.StageID,
          items.ProjectID,
          result.IDcompanySub,
          result.NumberCompany,
        ];
        await insertTablePostPublic(data);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

// ===================================================================
// Likesinsert: تبديل الإعجاب (Like/Unlike)
// ===================================================================
const Likesinsert = () => {
  return async (req, res) => {
    try {
      const PostID  = parsePositiveInt(req.query?.PostID);
      const userName = String(req.query?.userName ?? "").trim();

      const errors = {};
      if (!Number.isFinite(PostID)) errors.PostID = "رقم المنشور غير صالح";
      if (!isNonEmpty(userName) || !lenBetween(userName, 2, 100)) errors.userName = "اسم المستخدم غير صالح";
      if (Object.keys(errors).length) return res.status(400).json({ success:false, errors });

      const found = await SELECTTableLikesPostPublicotherroad(PostID, userName);
      if (!found) {
        await insertTableLikesPostPublic([PostID, userName]);
      } else {
        await DeleteTableLikesPostPublic([PostID, userName]);
      }

      return res.status(200).json({ success:true });
    } catch (err) {
      console.log("Likesinsert error:", err);
      return res.status(500).json({ success:false, message:"فشل العملية" });
    }
  };
};

// ===================================================================
// Commentinsert: إضافة تعليق على منشور + إدخاله في دردشة المرحلة
// ===================================================================
const Commentinsert = () => {
  return async (req, res) => {
    try {
      const PostId      = parsePositiveInt(req.body?.PostId);
      const commentText = String(req.body?.commentText ?? "").trim();
      const userName    = String(req.body?.userName ?? "").trim();

      const errors = {};
      if (!Number.isFinite(PostId)) errors.PostId = "رقم المنشور غير صالح";
      if (!isNonEmpty(commentText) || !lenBetween(commentText, 1, 2000)) errors.commentText = "التعليق مطلوب (1–2000)";
      if (!isNonEmpty(userName) || !lenBetween(userName, 2, 100)) errors.userName = "اسم المستخدم غير صالح";
      if (Object.keys(errors).length) return res.status(400).json({ success:false, errors });

      await insertTableCommentPostPublic([
        PostId,
        commentText,
        toISO(),
        userName,
      ]);

      // إرسال الإشعار بعد الإدراج
      try { await Postsnotification(PostId, "Comment", userName, "تعليق"); } catch {}

      // إدراج نسخة في دردشة المرحلة (لا تُسقط العملية عند الفشل)
      try { await insertCommentinchat(PostId, commentText, userName); } catch {}

      return res.status(200).json({ success:"تمت إرفاق التعليق" });
    } catch (err) {
      console.log("Commentinsert error:", err);
      return res.status(500).json({ success:"فشل تنفيذ العملية" });
    }
  };
};

// ===================================================================
// insertCommentinchat: ربط التعليق بقناة دردشة المرحلة
// ===================================================================
const insertCommentinchat = async (PostID, commentText, userName) => {
  const postIdNum = parsePositiveInt(PostID);
  if (!Number.isFinite(postIdNum)) throw new Error("Invalid PostID");

  const result = await SELECTDataPrivatPostonObject(postIdNum);
  if (!result) throw new Error("Post not found");

  const stageId   = result.StageID;
  const projectId = parsePositiveInt(result.ProjectID);
  if (!isNonEmpty(stageId) || !Number.isFinite(projectId)) {
    throw new Error("Stage/Project IDs missing");
  }

  // مُعرّف بسيط دون مكتبات
  const generateID = (Date.now().toString(36) + Math.random().toString(36).slice(2,10)).toUpperCase();

  // نبني مرفق دردشة من بيانات المنشور
  const fileUri  = String(result.url ?? "").trim();
  const fileName = sanitizeFilename(result.url ?? "video");
  const fileType = String(result.type ?? "video/mp4"); // احتياطي

  const meta = {}; // أي ميتاداتا إضافية مطلوبة
  const payload = {
    PostID: postIdNum,
    idSendr: "post",
    timeminet: result.timeminet ?? null,
    message: result.postBy ?? null,
    File: isNonEmpty(fileUri) ? { uri: fileUri, name: fileName, type: fileType } : null,
  };

  const data = [
    generateID,
    stageId,
    projectId,
    userName,
    commentText,
    toISO(),
    JSON.stringify(meta),
    JSON.stringify(payload),
  ];

  await insertTableChateStage(data);
};

module.exports = { Likesinsert, Commentinsert, insertPostURL };
