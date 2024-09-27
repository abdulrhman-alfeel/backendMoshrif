const { DeleteTableLikesPostPublic } = require("../../sql/delete");
const {
  insertTableLikesPostPublic,
  insertTableCommentPostPublic,
} = require("../../sql/INsertteble");
const {
  SELECTTableLikesPostPublicotherroad,
  SELECTTableCommentID,
} = require("../../sql/selected/selected");
const time = require("../chate/TIME.JS");
const { Postsnotification, PostsnotificationCansle } = require("../notifcation/NotifcationProject");

const Likesinsert = async (req, res) => {
  try {

    const PostId = req.query.PostID;
    const userName = req.query.userName;

    const result = await SELECTTableLikesPostPublicotherroad(PostId, userName);
    if (result === undefined || result === false) {
      await insertTableLikesPostPublic([PostId, userName]);
      await Postsnotification(PostId, "Likes",userName, "اعجاب");
    } else {
      await DeleteTableLikesPostPublic([PostId, userName]);
      await PostsnotificationCansle(PostId, "Likes",userName)
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

module.exports = { Likesinsert, Commentinsert };
