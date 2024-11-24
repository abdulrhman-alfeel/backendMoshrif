const express = require("express");
const {
  ClassChackTableChat,
  ClassViewChat,
  ClassreceiveMessageViews,
} = require("../function/chate/ChatJobsClass");
const { verifyJWT } = require("../middleware/jwt");
const { BringDataprojectAndStages } = require("../function/chate/ChatJobs");

const router = express.Router();
router.use(verifyJWT);
router.route("/").get(ClassChackTableChat);
router.route("/ChateView").get(ClassViewChat);
router.route("/Viewed").post(ClassreceiveMessageViews);
router.route("/BringDataprojectAndStages").get(BringDataprojectAndStages);

module.exports = router;
