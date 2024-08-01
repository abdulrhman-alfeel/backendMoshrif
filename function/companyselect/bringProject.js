const {
  SELECTTablecompanySubProject,
  SELECTTablecompanySubProjectindividual,
  SELECTFROMTablecompanysubprojectStagesubTeplet,
  SELECTTablecompanySubProjectStageCUST,
  SELECTTablecompanySubProjectStagesSub,
  SELECTTablecompanySubProjectStageNotes,
  SELECTTablecompanySubProjectStageSubNotes,
  SELECTTablecompanySubProjectexpense,
  SELECTTablecompanySubProjectREVENUE,
  SELECTTablecompanySubProjectReturned,
  SELECTFROMTablecompanysubprojectStageTemplet,
  SELECTTablecompanySubProjectarchivesotherroad,
  SELECTTablecompanySubProjectarchives,
} = require("../../sql/selected/selected");

// استيراد بيانات المشروع حسب الفرع
const BringProject = async (req, res) => {
  try {
    const IDcompanySub = req.query.IDcompanySub;
    console.log(IDcompanySub)
    const result = await SELECTTablecompanySubProject(IDcompanySub);
    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد بيانات المشروع حسب صلاحية المستخدم
const BringProjectindividual = async (req, res) => {
  try {
    const IDcompanySub = req.query.IDcompanySub;
    const idproject = req.query.idproject;
    const result = await SELECTTablecompanySubProjectindividual(
      idproject,
      IDcompanySub
    );
    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد بيانات سنيبل المراحل
const BringStageTemplet = async (req, res) => {
  try {
    const Type = req.query.Type;
    console.log(Type)
    const result = await SELECTFROMTablecompanysubprojectStageTemplet(Type);

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد بيانات سنبل المراحل الفرعية
const BringStageSubTemplet = async (req, res) => {
  try {
    const StageID = req.query.StageID;
    const result = await SELECTFROMTablecompanysubprojectStagesubTeplet(
      StageID
    );

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

//  استيراد بيانات المراحل الاساسية
const BringStage = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const result = await SELECTTablecompanySubProjectStageCUST(ProjectID);

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد بيانات المراحل الفرعية
const BringStagesub = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const StageID = req.query.StageID;
    const result = await SELECTTablecompanySubProjectStagesSub(
      ProjectID,
      StageID
    );

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد ملاحظات المراحل الرئيسية للمشروع
const BringStageNotes = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const StageID = req.query.StageID;

    const result = await SELECTTablecompanySubProjectStageNotes(ProjectID, StageID);

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد ملاحظات المراحل الفرعية للمراحل الرئيسية للمشروع
const BringStageSubNotes = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const StageID = req.query.StageID;
    const StagSubHOMID = req.query.StagSubHOMID;

    const result = await SELECTTablecompanySubProjectStageSubNotes(
      ProjectID,
      StageID,
      StagSubHOMID
    );

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد بيانات المصروفات
const BringExpense = async (req, res) => {
  try {
    const idproject = req.query.idproject;
    const result = await SELECTTablecompanySubProjectexpense(idproject);
    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

//  استيراد بيانات المقبوضات
const BringRevenue = async (req, res) => {
  try {
    const idproject = req.query.idproject;
    const result = await SELECTTablecompanySubProjectREVENUE(idproject);
    res.send({success:true, data:result}).status(200);
  } catch (err) {
    console.log(err);
    res.send({success:false}).status(400)
  }
};

//  استيراد بيانات المرتجعات
const BringReturned = async (req,res) =>{
    try{
        const idproject = req.query.idproject;
        const result = await SELECTTablecompanySubProjectReturned(idproject);

        res.send({success:true,data:result}).status(200)
    }catch(err){console.log(err);
        res.send({success:false}).status(400)
    }
}


// استيراد بيانات الارشيف 

const BringArchives = async (req,res) =>{
    try{
        const idproject = req.query.idproject;
        const result = await SELECTTablecompanySubProjectarchives(idproject);
        res.send({success:true,data:result}).status(200)
    }catch(err){
        console.log(err);
        res.send({success:false}).status(400)
    }
}
const BringArchivesFolderdata = async (req,res) =>{
    try{
        const ArchivesID = req.query.ArchivesID;
        const result = await SELECTTablecompanySubProjectarchivesotherroad(ArchivesID);
        res.send({success:true,data:result}).status(200)
    }catch(err){
        console.log(err);
        res.send({success:false}).status(400)
    }
}
module.exports = {
  BringProject,
  BringProjectindividual,
  BringStageTemplet,
  BringStageSubTemplet,
  BringStage,
  BringStagesub,
  BringStageNotes,
  BringStageSubNotes,
  BringExpense,
  BringRevenue,
  BringReturned,
  BringArchives,
  BringArchivesFolderdata
};
