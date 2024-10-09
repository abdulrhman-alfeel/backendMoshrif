const express = require("express");
const {
  projectBrinsh,
  StageTemplet,
  StageSubTemplet,
  NotesStage,
  NotesStageSub,
  ExpenseInsert,
  RevenuesInsert,
  ReturnsInsert,
  AddFolderArchivesnew,
  InsertStage,
  insertStageSub,
  AddORCanselAchievment,
  ClassCloaseOROpenStage,
  AddfileinFolderHomeinArchive,
  InsertDatainTableRequests,
} = require("../function/companyinsert/insertProject");
const uploads = require("../middleware/uploads");
const {
  BringProject,
  BringProjectindividual,
  BringStageTemplet,
  BringStageSubTemplet,
  BringStage,
  BringStagesub,
  BringStageNotes,
  BringExpense,
  BringRevenue,
  BringReturned,
  BringArchives,
  BringArchivesFolderdata,
  BringStageOneObject,
  BringTotalAmountproject,
  BringStatmentFinancialforproject,
  SearchinFinance,
  BringDataRequests,
  BringCountRequsts,
  BringReportforProject,
} = require("../function/companyselect/bringProject");
const {
  UpdataDataProject,
  RearrangeStage,
  UpdateStartdate,
  UpdateNotesStage,
  UpdateDataStage,
  UpdateNameFolderOrfileinArchive,
  ExpenseUpdate,
  RevenuesUpdate,
  ReturnsUpdate,
  UPDATEdataRequests,
  UPDATEImplementRquestsORCansle,
} = require("../function/companyinsert/UpdateProject");
const { verifyJWT } = require("../middleware/jwt");

const router = express.Router();

router.use(verifyJWT);
//  عمليات الادخال
// router.route("/project").post(uploads.single("image"), projectBrinsh);
router.route("/project").post(projectBrinsh);
router.route("/StageTemplet").post(StageTemplet);
router.route("/StageSubTemplet").post(StageSubTemplet);
router.route("/Stage").post(InsertStage);
router.route("/StageSub").post(insertStageSub);
router.route("/ClassCloaseOROpenStage").post(ClassCloaseOROpenStage);
router.route("/NotesStage").post(uploads.single("image"), NotesStage);
router.route("/NotesStageSub").post(uploads.any("image"),NotesStageSub);
router.route("/AddORCanselAchievment").post(AddORCanselAchievment);
router.route("/ExpenseInsert").post(uploads.any("image"), ExpenseInsert);
router.route("/RevenuesInsert").post(uploads.any("image"), RevenuesInsert);
router.route("/ReturnsInsert").post(uploads.any("image"), ReturnsInsert);
router.route("/AddFolderArchivesnew").post(AddFolderArchivesnew);
router
  .route("/AddfileinFolderinArchivesnew")
  .post(uploads.single("file"), AddfileinFolderHomeinArchive);
router
  .route("/InsertDatainTableRequests")
  .post(uploads.any("image"), InsertDatainTableRequests);

//  عمليات الطلب
router.route("/BringProject").get(BringProject);
router.route("/BringProjectindividual").get(BringProjectindividual);
router.route("/BringStageTemplet").get(BringStageTemplet);
router.route("/BringStageSubTemplet").get(BringStageSubTemplet);
router.route("/BringStage").get(BringStage);
router.route("/BringStageOneObject").get(BringStageOneObject);
router.route("/BringStagesub").get(BringStagesub);
router.route("/BringStageNotes").get(BringStageNotes);
router.route("/BringExpense").get(BringExpense),
  router.route("/BringRevenue").get(BringRevenue),
  router.route("/BringReturned").get(BringReturned);
router.route("/BringArchives").get(BringArchives),
  router.route("/BringArchivesFolderdata").get(BringArchivesFolderdata);
router.route("/BringTotalAmountproject").get(BringTotalAmountproject);
router
  .route("/BringStatmentFinancialforproject")
  .get(BringStatmentFinancialforproject);
router.route("/SearchinFinance").get(SearchinFinance);
router.route("/BringDataRequests").get(BringDataRequests);
router.route("/BringCountRequsts").get(BringCountRequsts);
router.route("/BringReportforProject").get(BringReportforProject);

//  عملية التعديل
router.route("/projectUpdat").put(UpdataDataProject);
router.route("/RearrangeStage").put(RearrangeStage);
router.route("/UpdateStartdate").put(UpdateStartdate);
router.route("/UpdateDataStage").put(UpdateDataStage);
router
  .route("/UpdateNameFolderOrfileinArchive")
  .put(UpdateNameFolderOrfileinArchive);
router
  .route("/UpdateNotesStage")
  .put(uploads.single("image"), UpdateNotesStage);
router.route("/ExpenseUpdate").put(uploads.any("image"), ExpenseUpdate);
router.route("/RevenuesUpdate").put(uploads.any("image"), RevenuesUpdate);
router.route("/ReturnsUpdate").put(uploads.any("image"), ReturnsUpdate);
router
  .route("/UPDATEdataRequests")
  .put(uploads.any("image"), UPDATEdataRequests);
router
  .route("/UPDATEImplementRquestsORCansle")
  .put(UPDATEImplementRquestsORCansle);

module.exports = router;
