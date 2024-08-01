const express = require("express");
const {
  Commentinsert,
  Likesinsert,
} = require("../function/postpublic/insertPost");
const { CommentUpdate } = require("../function/postpublic/updatPost");
const router = express.Router();

router.route("/Commentinsert").post(Commentinsert);
router.route("/CommentUpdate").put(CommentUpdate);
router.route("/Likesinsert").post(Likesinsert);

module.exports = router;
