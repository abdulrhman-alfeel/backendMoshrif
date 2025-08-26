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
  projectBrinshv2,
  AddORCanselAchievmentarrayall,
  insertStageSubv2,
} = require("../function/companyinsert/insertProject");
const { uploads } = require("../middleware/uploads");
const {
  BringProject,
  BringStageTemplet,
  BringStageSubTemplet,
  BringStage,
  BringStagev2,
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
  BringProjectObjectone,
  BringDataprojectClosed,
  FilterProject,
  BringDataRequestsV2,
  BringCountRequstsV2,
  BringProjectdashbord,
  FilterProjectdashbord,
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
  DeletProjectwithDependencies,
  DeleteFinance,
  CloseOROpenProject,
  DeleteStageHome,
  DeleteStageSub,
  UpdateDataStageSub,
  Confirmarrivdrequest,
  DeleteRequests,
  UpdateDataStageSubv2,
} = require("../function/companyinsert/UpdateProject");
const { verifyJWT } = require("../middleware/jwt");
const companySub = ({ uploadQueue }) => {
  const router = express.Router();

  router.use(verifyJWT);
  //  عمليات الادخال
  // router.route("/project").post(uploads.single("image"), projectBrinsh);
  router.post("/project", projectBrinsh(uploadQueue));
  router.post("/v2/project", projectBrinshv2(uploadQueue));

  router.post("/StageTemplet", StageTemplet(uploadQueue));
  router.post("/StageSubTemplet", StageSubTemplet(uploadQueue));
  router.post("/Stage", InsertStage(uploadQueue));
  router.post("/StageSub", insertStageSub(uploadQueue));
  router.post("/v2/StageSub",  uploads.single("file"),insertStageSubv2(uploadQueue));
  router.post("/ClassCloaseOROpenStage", ClassCloaseOROpenStage(uploadQueue));
  router.post("/NotesStage", uploads.single("image"), NotesStage(uploadQueue));
  router.post(
    "/NotesStageSub",
    uploads.any("image"),
    NotesStageSub(uploadQueue)
  );
  router.post("/AddORCanselAchievment", AddORCanselAchievment(uploadQueue));
  router.post(
    "/AddORCanselAchievmentarrayall",
    AddORCanselAchievmentarrayall(uploadQueue)
  );
  router.post(
    "/ExpenseInsert",
    uploads.any("image"),
    ExpenseInsert(uploadQueue)
  );
  router.post(
    "/RevenuesInsert",
    uploads.any("image"),
    RevenuesInsert(uploadQueue)
  );
  router.post(
    "/ReturnsInsert",
    uploads.any("image"),
    ReturnsInsert(uploadQueue)
  );
  router.post("/AddFolderArchivesnew", AddFolderArchivesnew(uploadQueue));
  router.post(
    "/AddfileinFolderinArchivesnew",
    uploads.single("file"),
    AddfileinFolderHomeinArchive(uploadQueue)
  );
  router.post(
    "/InsertDatainTableRequests",
    uploads.any("image"),
    InsertDatainTableRequests(uploadQueue)
  );

  // //  عمليات الطلب
  router.get("/v2/BringProject", BringProjectdashbord(uploadQueue));
  router.get("/BringProject", BringProject(uploadQueue));
  router.get("/BringDataprojectClosed", BringDataprojectClosed(uploadQueue));
  router.get("/CloseOROpenProject", CloseOROpenProject(uploadQueue));
  router.get("/FilterProject", FilterProject(uploadQueue));
  router.get("/v2/FilterProject", FilterProjectdashbord(uploadQueue));
  // router.get("/BringProjectindividual", BringProjectindividual(uploadQueue));
  router.get("/BringProjectObjectone", BringProjectObjectone(uploadQueue));
  router.get("/BringStageTemplet", BringStageTemplet(uploadQueue));
  router.get("/BringStageSubTemplet", BringStageSubTemplet(uploadQueue));
  router.get("/BringStage", BringStage(uploadQueue));
  router.get("/v2/BringStage", BringStagev2(uploadQueue));
  router.get("/BringStageOneObject", BringStageOneObject(uploadQueue));
  router.get("/BringStagesub", BringStagesub(uploadQueue));
  router.get("/BringStageNotes", BringStageNotes(uploadQueue));
  router.get("/BringExpense", BringExpense(uploadQueue));
  router.get("/BringRevenue", BringRevenue(uploadQueue));
  router.get("/BringReturned", BringReturned(uploadQueue));
  router.get("/BringArchives", BringArchives(uploadQueue));
  router.get("/BringArchivesFolderdata", BringArchivesFolderdata(uploadQueue));
  router.get("/BringTotalAmountproject", BringTotalAmountproject(uploadQueue));
  router.get(
    "/BringStatmentFinancialforproject",
    BringStatmentFinancialforproject(uploadQueue)
  );
  router.get("/SearchinFinance", SearchinFinance(uploadQueue));
  router.get("/BringDataRequests", BringDataRequests(uploadQueue));
  router.get("/BringCountRequsts", BringCountRequsts(uploadQueue));

  router.get("/v2/BringDataRequests", BringDataRequestsV2(uploadQueue));
  router.get("/v2/BringCountRequsts", BringCountRequstsV2(uploadQueue));

  router.get("/BringReportforProject", BringReportforProject(uploadQueue));

  //  عملية التعديل
  router.put("/projectUpdat", UpdataDataProject(uploadQueue));
  router.put("/RearrangeStage", RearrangeStage(uploadQueue));
  router.put("/UpdateStartdate", UpdateStartdate(uploadQueue));
  router.put("/UpdateDataStage", UpdateDataStage(uploadQueue));
  router.put("/UpdateDataStageSub", UpdateDataStageSub(uploadQueue));
  router.put("/v2/UpdateDataStageSub", uploads.single("file"),UpdateDataStageSubv2(uploadQueue));
  // حذف المشروع
  router.get(
    "/DeletProjectwithDependencies",
    DeletProjectwithDependencies(uploadQueue)
  );
  // حذف عمليات المالية
  router.get("/DeleteFinance", DeleteFinance(uploadQueue));

  //  حذف المراحل الرئيسية
  router.get("/DeleteStageHome", DeleteStageHome(uploadQueue));
  // حذف المراحل الفرعية
  router.get("/DeleteStageSub", DeleteStageSub(uploadQueue));

  router.put(
    "/UpdateNameFolderOrfileinArchive",
    UpdateNameFolderOrfileinArchive(uploadQueue)
  );
  router.put(
    "/UpdateNotesStage",
    uploads.single("image"),
    UpdateNotesStage(uploadQueue)
  );
  router.put(
    "/ExpenseUpdate",
    uploads.any("image"),
    ExpenseUpdate(uploadQueue)
  );
  router.put(
    "/RevenuesUpdate",
    uploads.any("image"),
    RevenuesUpdate(uploadQueue)
  );
  router.put(
    "/ReturnsUpdate",
    uploads.any("image"),
    ReturnsUpdate(uploadQueue)
  );
  router.put(
    "/UPDATEdataRequests",
    uploads.any("image"),
    UPDATEdataRequests(uploadQueue)
  );
  router.put(
    "/UPDATEImplementRquestsORCansle",
    UPDATEImplementRquestsORCansle(uploadQueue)
  );
  router.get("/Confirmarrivdrequest", Confirmarrivdrequest(uploadQueue));

  // //
  router.get("/DeleteRequests", DeleteRequests(uploadQueue));
  return router;
};

module.exports = {companySub};
