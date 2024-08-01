const { UPDATETableCommentPostPublic } = require("../../sql/update");



const CommentUpdate = async (req, res) => {
    try {
      const CommentID = req.body.CommentID;
      const commentText = req.body.commentText;
    //   const userName = req.body.userName;
      await UPDATETableCommentPostPublic([commentText,CommentID]);
  
      res.send({ success: true }).status(200);
    } catch (err) {
      console.log(err);
      res.send({success:false}).status(400)
    }
  };
  

module.exports={CommentUpdate}