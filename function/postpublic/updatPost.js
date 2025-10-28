const { DeleteTableCommentPostPublic } = require("../../sql/delete");
const { UPDATETableCommentPostPublic } = require("../../sql/update");
const { Postsnotification } = require("../notifcation/NotifcationProject");
const {DeleteBucket} = require("../../bucketClooud");
const {deletePostFromDatabase} = require("../../sql/delete");
const { parsePositiveInt, isNonEmpty, lenBetween, convertArabicToEnglish, esc } = require("../../middleware/Aid");
const CommentUpdate = () => {
  return async (req, res) => {
    try {
      // 1) التحقق من الجلسة
      const userSession = req.session?.user;
      if (!userSession) {
        console.log("Invalid session");
        return res.status(401).json({ success:false, message:"Invalid session" });
      }

      // 2) التقاط/تحقق المدخلات
      const CommentID   = parsePositiveInt(req.body?.CommentID);
      const commentText = String(req.body?.commentText ?? "").trim();

      const errors = {};
      if (!Number.isFinite(CommentID)) errors.CommentID   = "معرّف التعليق غير صالح";
      if (!isNonEmpty(commentText) || !lenBetween(commentText, 1, 2000))
        errors.commentText = "نص التعليق مطلوب (1–2000 حرف)";
      if (Object.keys(errors).length) {
        return res.status(400).json({ success:false, message:"أخطاء في التحقق من المدخلات", errors });
      }


      // 4) التحديث
      await UPDATETableCommentPostPublic([ esc(commentText), convertArabicToEnglish(esc(CommentID)) ]);

      // 5) إشعار (لا تسقط العملية عند فشل الإشعار)
      try {
        await Postsnotification(0, "Comment", userSession.userName, "تعديل تعليقه", CommentID);
      } catch {}

      return res.status(200).json({ success:true, message:"تم تعديل التعليق" });
    } catch (err) {
      console.error("CommentUpdate error:", err);
      return res.status(500).json({ success:false, message:"فشل تنفيذ العملية" });
    }
  };
};

// ===== حذف تعليق =====
const CommentDelete = () => {
  return async (req, res) => {
    try {
      // 1) التحقق من الجلسة (يفضل تفعيلها للحذف أيضاً)
      const userSession = req.session?.user;
      if (!userSession) {
        console.log("Invalid session");
        return res.status(401).json({ success:false, message:"Invalid session" });
      }

      // 2) التقاط/تحقق المدخلات
      const CommentID = parsePositiveInt(req.query?.CommentID);
      if (!Number.isFinite(CommentID)) {
        return res.status(400).json({ success:false, message:"معرّف التعليق غير صالح" });
      }

      // 3) التحقق من وجود التعليق (واختيارياً: الملكية)

   
      // 4) الحذف
      await DeleteTableCommentPostPublic([ convertArabicToEnglish(esc(CommentID)) ]);

      return res.status(200).json({ success:true, message:"تم حذف التعليق" });
    } catch (err) {
      console.error("CommentDelete error:", err);
      return res.status(500).json({ success:false, message:"فشل تنفيذ العملية" });
    }
  };
};


const Deleteposts = async (url) => {
  try {

    await deletePostFromDatabase([url]);
    await DeleteBucket(url);
  } catch (error) {
  }
}



module.exports = { CommentUpdate, CommentDelete,Deleteposts };
