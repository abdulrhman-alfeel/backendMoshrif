const express = require("express");
const {
  projectBrinsh,
  StageTemplet,
  StageSubTemplet,
  Stage,
  StageSub,
  NotesStage,
  NotesStageSub,
  ExpenseInsert,
  RevenuesInsert,
  ReturnsInsert,
  AddFolderArchivesnew,
  AddfileinFolderinArchivesnew,
} = require("../function/companyinsert/insertProject");
const uploads = require("../middleware/uploads");
const { BringProject, BringProjectindividual, BringStageTemplet, BringStageSubTemplet, BringStage, BringStagesub, BringStageNotes, BringStageSubNotes, BringExpense, BringRevenue, BringReturned, BringArchives, BringArchivesFolderdata } = require("../function/companyselect/bringProject");

const router = express.Router();
//  عمليات الادخال 
router.route("/project").post(uploads.single("image"), projectBrinsh);
router.route("/StageTemplet").post(StageTemplet);
router.route("/StageSubTemplet").post(StageSubTemplet);
router.route("/Stage").post(Stage);
router.route("/StageSub").post(StageSub);
router.route("/NotesStage").post(uploads.single("image"), NotesStage);
router.route("/NotesStageSub").post(uploads.single("image"), NotesStageSub);
router.route("/ExpenseInsert").post(uploads.single("image"), ExpenseInsert);
router.route("/RevenuesInsert").post(RevenuesInsert);
router.route("/ReturnsInsert").post(ReturnsInsert);
router.route("/AddFolderArchivesnew").post(AddFolderArchivesnew);
router.route("/AddfileinFolderinArchivesnew").post(uploads.single('file'),AddfileinFolderinArchivesnew);

//  عمليات الطلب 

router.route("/BringProject").get(BringProject);
router.route('/BringProjectindividual').get(BringProjectindividual);
router.route("/BringStageTemplet").get(BringStageTemplet);
router.route("/BringStageSubTemplet").get(BringStageSubTemplet);
router.route('/BringStage').get(BringStage);
router.route('/BringStagesub').get(BringStagesub);
router.route("/BringStageNotes").get(BringStageNotes);
router.route("/BringStageSubNotes").get(BringStageSubNotes);
router.route("/BringExpense").get(BringExpense),
router.route("/BringRevenue").get(BringRevenue),
router.route("/BringReturned").get(BringReturned)
router.route("/BringArchives").get(BringArchives),
router.route("/BringArchivesFolderdata").get(BringArchivesFolderdata)

module.exports = router;
