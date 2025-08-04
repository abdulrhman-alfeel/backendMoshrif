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
  SELECTTableCommentPostPublic,
  SELECTDataPrivatPostonObject,
} = require("../../sql/selected/selected");
const { Postsnotification } = require("../notifcation/NotifcationProject");

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
const Likesinsert = () => {
  return async (req, res) => {
    try {
      const { PostID, userName } = req.query;

      const result = await SELECTTableLikesPostPublicotherroad(
        PostID,
        userName
      );
      if (result === undefined || result === false) {
        await insertTableLikesPostPublic([PostID, userName]);
      } else {
        await DeleteTableLikesPostPublic([PostID, userName]);
      }
      res.send({ success: true }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

const Commentinsert = () => {
  return async (req, res) => {
    try {
      const { PostId, commentText, userName } = req.body;
      await insertTableCommentPostPublic([
        PostId,
        commentText,
        `${new Date().toUTCString()}`,
        userName,
      ]);
      await Postsnotification(PostId, "Comment", userName, "تعليق");

      res.send({ success: "تمت ارفاق التعليق " }).status(200);
      await insertCommentinchat(PostId, commentText, userName);
    } catch (err) {
      console.log(err);
      res.send({ success: "فشل تنفيذ العملية" }).status(400);
    }
  };
};

const insertCommentinchat = async (PostID, commentText, userName) => {
  const result = await SELECTDataPrivatPostonObject(PostID);
  const generateID =  Math.random().toString(36).substring(2, 10);

  const data = [
    generateID,
    result.StageID,
    result.ProjectID,
    userName,
    commentText,
    `${new Date().toUTCString()}`,
    JSON.stringify({}),
    JSON.stringify({
      PostID:PostID,
      idSendr: "post",
      timeminet: result.timeminet,
      message: result.postBy,
      File: { uri: result.url, name: result.url, type: "video/mp4" },
    }),
  ];
  await insertTableChateStage(data);
};
module.exports = { Likesinsert, Commentinsert, insertPostURL };
