const express = require("express");
const {
  ClassChackTableChat,
  ClassViewChat,
  ClassreceiveMessageViews,
  PostFilemassage,
  Chackarrivedmassage,
  initializeUpload,
  insertdatafile,
  generateResumableUrl,
  filterTableChat,
} = require("../function/chate/ChatJobsClass");
const { verifyJWT } = require("../middleware/jwt");
const { BringDataprojectAndStages } = require("../function/chate/ChatJobs");
const {uploads} = require("../middleware/uploads");

const router = express.Router();
router.use(verifyJWT);
router.route("/").get(ClassChackTableChat);
router.route("/v2/file").post(uploads.single("filechate"),PostFilemassage);
router.route("/ChateView").get(ClassViewChat);
router.route("/filterTableChat").get(filterTableChat);
router.route("/Viewed").post(ClassreceiveMessageViews);
router.route("/BringDataprojectAndStages").get(BringDataprojectAndStages);
router.route("/Chackarrivedmassage").get(Chackarrivedmassage);
router.route("/initializeUpload").get(initializeUpload);
router.route("/insertdatafile").post(insertdatafile);
router.route("/generate-resumable-url").post(generateResumableUrl);

module.exports = router;
