const express = require("express");
const {
  ClassChackTableChat,
  ClassViewChat,
  ClassreceiveMessageViews,
} = require("../function/chate/ChatJobsClass");
const { verifyJWT } = require("../middleware/jwt");

const router = express.Router();
router.use(verifyJWT);
router.route("/").get(ClassChackTableChat);
router.route("/ChateView").get(ClassViewChat);
router.route("/Viewed").post(ClassreceiveMessageViews);

module.exports = router;
