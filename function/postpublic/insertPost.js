const { DeleteTableLikesPostPublic } = require("../../sql/delete");
const { insertTablePostPublic } = require("../../sql/INsertteble");

const {
  insertTableLikesPostPublic,
  insertTableCommentPostPublic,
} = require("../../sql/INsertteble");
const {
  SELECTTableLikesPostPublicotherroad,
} = require("../../sql/selected/selected");
const { Postsnotification } = require("../notifcation/NotifcationProject");




const insertPostURL = async (items) => {
  try {
    if (Object.entries(items.File).length > 0) {
      if (String(items.File.type).includes("video") ) {
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
const Likesinsert = async (req, res) => {
  try {
    const PostId = req.query.PostID;
    const userName = req.query.userName;

    const result = await SELECTTableLikesPostPublicotherroad(PostId, userName);
    if (result === undefined || result === false) {
      await insertTableLikesPostPublic([PostId, userName]);
    } else {
      await DeleteTableLikesPostPublic([PostId, userName]);
    }
    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

const Commentinsert = async (req, res) => {
  try {
    
    const PostId = req.body.PostId;
    const commentText = req.body.commentText;
    const userName = req.body.userName;

    await insertTableCommentPostPublic([
      PostId,
      commentText,
      `${new Date().toUTCString()}`,
      userName,
    ]);
    await Postsnotification(PostId, "Comment",userName, "تعليق");

    res.send({ success: "تمت ارفاق التعليق " }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: "فشل تنفيذ العملية" }).status(400);
  }
};

module.exports = { Likesinsert, Commentinsert ,  insertPostURL};
