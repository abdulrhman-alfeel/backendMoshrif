const { DeleteTableLikesPostPublic } = require("../../sql/delete");
const {
  insertTableLikesPostPublic,
  insertTableCommentPostPublic,
} = require("../../sql/INsertteble");
const {
  SELECTTableLikesPostPublicotherroad,
} = require("../../sql/selected/selected");

const Likesinsert = async (req, res) => {
  try {
    const PostId = req.body.PostId;
    const TypeLikes = req.body.TypeLikes;
    const userName = req.body.userName;
    const result = await SELECTTableLikesPostPublicotherroad(PostId, userName);
    if (result?.length <= 0) {
      await insertTableLikesPostPublic([PostId, TypeLikes, userName]);
      
    }else{
      await DeleteTableLikesPostPublic([PostId,userName])
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
    await insertTableCommentPostPublic([PostId, commentText, userName]);

    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({success:false}).status(400)
  }
};

module.exports={Likesinsert,Commentinsert}