const express = require("express");
const {
  Commentinsert,
  Likesinsert,
} = require("../function/postpublic/insertPost");
const {
  CommentUpdate,
  CommentDelete,
} = require("../function/postpublic/updatPost");
const {
  BringPost,
  BringCommentinsert,
  SearchPosts,
  BringObjectOnefromPost,
  BringDatabrachCompany,
} = require("../function/postpublic/post");
const { verifyJWT } = require("../middleware/jwt");
const router = express.Router();
router.use(verifyJWT);
router.route("/Commentinsert").post(Commentinsert);
router.route("/CommentUpdate").put(CommentUpdate);
router.route("/CommentDelete").delete(CommentDelete);

router.route("/Likesinsert").get(Likesinsert);
router.route("/BringPost").get(BringPost);
router.route("/BringObjectOnefromPost").get(BringObjectOnefromPost);
router.route("/BringCommentinsert").get(BringCommentinsert);
router.route("/SearchPosts").get(SearchPosts);
router.route("/BringDatabrachCompany").get(BringDatabrachCompany);

module.exports = router;
