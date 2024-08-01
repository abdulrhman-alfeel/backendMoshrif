const express = require("express");
const {
  ClassChackTableChat,
  ClassViewChat,
  ClassreceiveMessageViews
} = require("../function/chate/ChatJobsClass");

const router = express.Router();

router.route("/").get(ClassChackTableChat);
router.route("/ChateView").get(ClassViewChat);
router.route("/Viewed").post(ClassreceiveMessageViews);

module.exports = router;
