const client = require("../../middleware/redis");
const {
  insertTablecompanySubProject,
  insertTablecompanySubProjectStagetemplet,
  insertTablecompanySubProjectStageSubtemplet,
  insertTablecompanySubProjectStageCUST,
  insertTablecompanySubProjectStagesSub,
  insertTablecompanySubProjectStageNotes,
  insertTablecompanySubProjectStageSubNotes,
  insertTablecompanySubProjectexpense,
  insertTablecompanySubProjectREVENUE,
  insertTablecompanySubProjectReturned,
  insertTablecompanySubProjectarchivesFolder,
  insertTablecompanySubProjectarchivesfile,
} = require("../../sql/INsertteble");
const {
  SELECTTablecompanySubProjectarchivesotherroad,
} = require("../../sql/selected/selected");

const projectBrinsh = async (req, res) => {
  //
  try {
    const IDcompanySub = req.body.IDcompanySub;
    const Nameproject = req.body.Nameproject;
    const Note = req.body.Note;
    const TypeOFContract = req.body.TypeOFContract;
    const GuardNumber = req.body.GuardNumber;
    const LocationProject = req.body.LocationProject;
    const ProjectStartdate = req.body.ProjectStartdate;
    const Imageproject = req.file?.filename;
    // console.log(IDcompanySub, Imageproject);
    await insertTablecompanySubProject([
      IDcompanySub,
      Nameproject,
      Note,
      TypeOFContract,
      GuardNumber,
      LocationProject,
      ProjectStartdate,
      Imageproject,
    ]);

    res
      .send({
        success: true,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res
      .send({
        success: false,
      })
      .status(400);
  }
};

// وظيفة ادخال البيانات في جدوول المراحل السنبل الرئيسي
const StageTemplet = async (req, res) => {
  try {
    // const Type = req.body.Type;
    // const StageName = req.body.StageName;
    // const OrderBy = req.body.OrderBy;
    // const Days = req.body.Days;
    // const Difference = req.body.Difference;
    const teble = req.body.teble;
    for (let index = 0; index < teble.length; index++) {
      const item = teble[index];
      console.log(item);
      await insertTablecompanySubProjectStagetemplet([
        item.Type,
        item.StageName,
        item.Days,
        item.OrderBy,
      ]);
    }
    res
      .send({
        success: true,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res
      .send({
        success: false,
      })
      .status(400);
  }
};

// وظيف ادخال بييانات المراحلة الفرعية السنبل
const StageSubTemplet = async (req, res) => {
  try {
    const teble = req.body.teble;
    console.log(teble);
    for (let index = 0; index < teble.length; index++) {
      const item = teble[index];
      console.log(item);
      await insertTablecompanySubProjectStageSubtemplet([
        item.StageID,
        item.StageSubName,
      ]);
    }
    res
      .send({
        success: true,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res
      .send({
        success: false,
      })
      .status(400);
  }
  const teble = req.body.teble;
};

// وظيفة ادخال البيانات في جدوول المراحل  الرئيسي
const Stage = async (req, res) => {
  try {
    const teble = req.body.teble;
    for (let index = 0; index < teble.length; index++) {
      const item = teble[index];
      console.log(item);
      await insertTablecompanySubProjectStageCUST([
        item.StageID,
        item.ProjectID,
        item.Type,
        item.StageName,
        item.Days,
        item.StartDate,
        item.EndDate,
        item.OrderBy,
        item.Difference,
      ]);
    }
    res
      .send({
        success: true,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res
      .send({
        success: false,
      })
      .status(400);
  }
};

// وظيف ادخال بييانات المراحلة الفرعية
const StageSub = async (req, res) => {
  try {
    const teble = req.body.teble;
    console.log(teble);
    for (let index = 0; index < teble.length; index++) {
      const item = teble[index];
      console.log(item);
      await insertTablecompanySubProjectStagesSub([
        item.StagHOMID,
        item.ProjectID,
        item.StageSubName,
      ]);
    }
    res
      .send({
        success: true,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res
      .send({
        success: false,
      })
      .status(400);
  }
};

// وظيفة ادخال ملاحظات المرحلة الرئيسية
const NotesStage = async (req, res) => {
  try {
    const StagHOMID = req.body.StagHOMID;
    const ProjectID = req.body.ProjectID;
    const Type = req.body.Type;
    const Note = req.body.Note;
    const RecordedBy = req.body.RecordedBy;
    const countdayDelay = req.body.countdayDelay;
    const ImageAttachment = req.file?.filename;
    await insertTablecompanySubProjectStageNotes([
      StagHOMID,
      ProjectID,
      Type,
      Note,
      RecordedBy,
      countdayDelay,
      ImageAttachment,
    ]);
    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// وظيفة ادخال ملاحظات المرحلة الفرعية
const NotesStageSub = async (req, res) => {
  try {
    const StagSubHOMID = req.body.StagSubHOMID;
    const StagHOMID = req.body.StagHOMID;
    const ProjectID = req.body.ProjectID;
    const Type = req.body.Type;
    const Note = req.body.Note;
    const RecordedBy = req.body.RecordedBy;
    const countdayDelay = req.body.countdayDelay;
    const ImageAttachment = req.file?.filename;
    await insertTablecompanySubProjectStageSubNotes([
      StagSubHOMID,
      StagHOMID,
      ProjectID,
      Type,
      Note,
      RecordedBy,
      countdayDelay,
      ImageAttachment,
    ]);

    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// ادخال بيانات المصروفات
const ExpenseInsert = async (req, res) => {
  try {
    const CustID = req.body.CustID;
    const Amount = req.body.Amount;
    const Data = req.body.Data;
    const ClassificationName = req.body.ClassificationName;
    const Image = req.file?.filename;
    const InvoiceNo = req.body.InvoiceNo;
    const Taxable = req.body.Taxable;
    const CreatedDate = req.body.CreatedDate;

    await insertTablecompanySubProjectexpense([
      CustID,
      Amount,
      Data,
      ClassificationName,
      Image,
      InvoiceNo,
      Taxable,
      CreatedDate,
    ]);

    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: true }).status(400);
  }
};

// ادخال بييانات المقبوضات
const RevenuesInsert = async (req, res) => {
  try {
    const CustID = req.body.CustID;
    const Amount = req.body.Amount;
    const Data = req.body.Data;
    const Bank = req.body.Bank;
    await insertTablecompanySubProjectREVENUE([CustID, Amount, Data, Bank]);
    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// ادخال بيانات المرتجع
const ReturnsInsert = async (req, res) => {
  try {
    const CustID = req.body.CustID;
    const Amount = req.body.Amount;
    const Data = req.body.Data;
    await insertTablecompanySubProjectReturned([CustID, Amount, Data]);

    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// اضافة مجلدات جديدة

const AddFolderArchivesnew = async (req, res) => {
  try {
    const CustID = req.body.CustID;
    const FolderName = req.body.FolderName;
    await insertTablecompanySubProjectarchivesFolder([CustID, FolderName]);
    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// إضافة ملف في المجلدات
const AddfileinFolderinArchivesnew = async (req, res) => {
  try {
    const ArchivesID = req.body.ArchivesID;
    const filenew = req.file?.filename;
    const result = await SELECTTablecompanySubProjectarchivesotherroad(
      ArchivesID
    );

    // console.log(result, filenew);

    //  إضافة كائن لبيانات الصورة
    const file = {
      name: filenew,
      type: req.file?.mimetype,
    };
    console.log(file);
    let Folder = [];
    //  التاكد من وجود ملفات في المجلد او لا
    if (result[0].FolderContent !== null){
      Folder = JSON.parse(result[0].FolderContent)
      Folder.push(file)
    }else{
      Folder.push(file);
    }

    //  إضافة الملف في قائمة المجلدات
    await insertTablecompanySubProjectarchivesfile(JSON.stringify(Folder),ArchivesID)

    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

module.exports = {
  projectBrinsh,
  StageTemplet,
  StageSubTemplet,
  StageSub,
  Stage,
  NotesStage,
  NotesStageSub,
  ExpenseInsert,
  RevenuesInsert,
  ReturnsInsert,
  AddFolderArchivesnew,
  AddfileinFolderinArchivesnew,
};
