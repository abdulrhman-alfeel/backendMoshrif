const { DeleteTableCommentPostPublic } = require("../../sql/delete");
const { UPDATETableCommentPostPublic } = require("../../sql/update");
const { Postsnotification } = require("../notifcation/NotifcationProject");
const {DeleteBucket} = require("../../bucketClooud");
const {deletePostFromDatabase} = require("../../sql/delete");
const CommentUpdate =  () => {
  return async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
    const CommentID = req.body.CommentID;
    const commentText = req.body.commentText;
    //   const userName = req.body.userName;
    await UPDATETableCommentPostPublic([commentText, CommentID]);
    await Postsnotification(0, "Comment",userSession.userName, "تعديل تعليقه",CommentID);

    res.send({ success: "تمت تعديل التعليق" }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: "فشل تنفيذ العملية" }).status(400);
  }
}
};
const CommentDelete =  () => {
  return async (req, res) => {
  try {
    // console.log(req.query);
    const CommentID = req.query.CommentID;
    //   const userName = req.body.userName;
    await DeleteTableCommentPostPublic([CommentID]);

    res.send({ success: "تمت حذف التعليق" }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: "فشل تنفيذ العملية" }).status(400);
  }
}
};

const Deleteposts = async (url) => {
  try {

    await deletePostFromDatabase([url]);
    await DeleteBucket(url);
  } catch (error) {
  }
}



module.exports = { CommentUpdate, CommentDelete,Deleteposts };
