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
  SELECTSUMAmountandBring,
  SELECTTablecompanySubProjectStageCUSTCount,
  SELECTTablecompanySubProjectStageCUSTSubCount,
  SELECTTablecompanybrinshStagesSubAll,
  SELECTTablecompanySubProjectStageCUSTONe,
} = require("../../sql/selected/selected");
const TempletStage = require("../../TempletStage.json");
const subTemplet = require("../../SubTemplet.json");
// استيراد بيانات المشروع حسب الفرع
const BringProject = async (req, res) => {
  try {
    const IDcompanySub = req.query.IDcompanySub;
    // console.log(IDcompanySub);
    const result = await SELECTTablecompanySubProject(IDcompanySub);
    const arrayReturnProject = await BringTotalbalance(result);
    res.send({ success: true, data: arrayReturnProject }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};
const BringTotalbalance = async (result) => {
  let arrayReturnProject = [];
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    const dataProject = await SELECTSUMAmountandBring(element.id);
    const rate = await PercentagecalculationforProject(element.id);
    arrayReturnProject.push({
      ...element,
      cost: dataProject.RemainingBalance,
      rate: rate,
    });
  }
  return arrayReturnProject;
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
    console.log(Type);
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
    // console.log('hellllllllllllllllllllow')
    const ProjectID = req.query.ProjectID;
    const result = await SELECTTablecompanySubProjectStageCUST(ProjectID);
    let arrayresult = [];
    console.log(result.length, ProjectID);
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      const rate = await PercentagecalculationforSTage(
        element.StageID,
        ProjectID
      );
      arrayresult.push({
        ...element,
        rate: rate,
      });
    }
    // console.log(result)
    res.send({ success: true, data: arrayresult }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد كائن واحد من  المراحل ارئيسية
const BringStageOneObject = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const StageID = req.query.StageID;

    let result = await SELECTTablecompanySubProjectStageCUSTONe(
      ProjectID,
      StageID
    );
    const rate = await PercentagecalculationforSTage(StageID, ProjectID);

    // result?.push(rate);
    result = {
      ...result,
      rate: rate,
    };

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

    const result = await SELECTTablecompanySubProjectStageNotes(
      ProjectID,
      StageID
    );

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد النسبئة المئوية للمشروع

const PercentagecalculationforProject = async (id) => {
  try {
    //  نستدعي عدد كل المراحل الفرعية للمشروع
    const accountallStage = await SELECTTablecompanybrinshStagesSubAll(id);
    const countall = accountallStage["COUNT(StageSubName)"];
    const accountTrueStage = await SELECTTablecompanybrinshStagesSubAll(
      id,
      "true"
    );
    const countTrue = accountTrueStage["COUNT(StageSubName)"];
    let rate = (countTrue / countall) * 100;
    if (isNaN(rate)) {
      rate = 0;
    }

    return rate;
  } catch (error) {
    console.log(error);
  }
};

//  استيراد النسبئة المئوية للمرحلة
const PercentagecalculationforSTage = async (StageID, ProjectID) => {
  try {
    const accountallStageSub =
      await SELECTTablecompanySubProjectStageCUSTSubCount(StageID, ProjectID);
    const countall = accountallStageSub["COUNT(StageSubName)"];
    const accountTrueStageSub =
      await SELECTTablecompanySubProjectStageCUSTSubCount(
        StageID,
        ProjectID,
        "true"
      );
    const countTrue = accountTrueStageSub["COUNT(StageSubName)"];
    let rate = (countTrue / countall) * 100;

    if (isNaN(rate)) {
      rate = 0;
    }
    return rate;
  } catch (error) {
    console.log(error);
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

//  استيراد بيانات العهد
const BringRevenue = async (req, res) => {
  try {
    const idproject = req.query.idproject;
    const result = await SELECTTablecompanySubProjectREVENUE(idproject);
    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

//  استيراد بيانات المرتجعات
const BringReturned = async (req, res) => {
  try {
    const idproject = req.query.idproject;
    const result = await SELECTTablecompanySubProjectReturned(idproject);

    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد بيانات الارشيف
const BringArchives = async (req, res) => {
  try {
    const idproject = req.query.idproject;
    const result = await SELECTTablecompanySubProjectarchives(idproject);
    res.send({ success: true, data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// استيراد ملفات فرع مجلد الارشيف
const BringArchivesFolderdata = async (req, res) => {
  try {
    const ArchivesID = req.query.ArchivesID;
    const idSub = req.query.idSub;
    const type = req.query.type;
    let result;
    result = await SELECTTablecompanySubProjectarchivesotherroad(
      parseInt(ArchivesID)
    );

    const children = JSON.parse(result.children);
    const findChild = children.find(
      (items) => parseInt(items.id) === parseInt(idSub)
    );
    if (parseInt(ArchivesID) !== parseInt(idSub) ) {
      // if(type === 'goBack' && findChild !== undefined){
      //   result = await ExtractDatafromFolderchilde(children);
      // }else{
        const resultall = await BringchildeArchives(children, parseInt(idSub));
        result = await ExtractDatafromFolderchilde(resultall);

      // }
    } else {
      console.log(type, "type no archivesid !== idsub");

      result = await ExtractDatafromFolderchilde(children);
    }
    res.send({ success: true, data: result || [] }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

const BringchildeArchives = async (children, idSub) => {
  return new Promise(async (resolve, reject) => {
    try {
      const folder = children?.find(
        (folder) => parseInt(folder.id) === parseInt(idSub)
      );
      // console.log(folder, "hhhhhhhkkkkkkkkkkkkkkkkkk", idSub);

      if (folder) {
        resolve(folder.children);
      } else {
        
        children?.forEach(async (pic) => {
          if (pic.children) {
            const childrenNew = await BringchildeArchives(pic.children, idSub);
            // if(childrenNew !== undefined){
              resolve(childrenNew);
            // }
          }
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);

    }
  });
};

function findParentId(data, childId) {
  for (let index = 0; index < data.length; index++) {
    const items = data[index];

    if (items.children) {
      for (const child of items.children) {
        if (parseInt(child.id) === parseInt(childId)) {
          return items.id; // parent ID found
        }

        const parentId = findParentId([child], childId);
        if (parentId !== undefined) {
          return parentId; // parent ID found in subtree
        }
      }
    }
  }
}

const ExtractDatafromFolderchilde = async (children) => {
  return new Promise((resolve, reject) => {
    let array = [];
    try {
      children?.forEach((pic) => {
        array.push({
          id: pic.id,
          name: pic.name,
          type: pic.type,
          size: pic?.size !== undefined ? pic.size : null,
        });
      });
      resolve(array);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
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
  PercentagecalculationforSTage,
  BringStageOneObject,
  BringArchivesFolderdata,
};
