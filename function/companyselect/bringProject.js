const {
  SELECTTablecompanySubProject,
  SELECTTablecompanySubProjectindividual,
  SELECTFROMTablecompanysubprojectStagesubTeplet,
  SELECTTablecompanySubProjectStageCUST,
  SELECTTablecompanySubProjectStagesSub,
  SELECTTablecompanySubProjectStageNotes,
  SELECTTablecompanySubProjectexpense,
  SELECTTablecompanySubProjectREVENUE,
  SELECTTablecompanySubProjectReturned,
  SELECTFROMTablecompanysubprojectStageTemplet,
  SELECTTablecompanySubProjectarchivesotherroad,
  SELECTTablecompanySubProjectarchives,
  SELECTSUMAmountandBring,
  SELECTTablecompanySubProjectStageCUSTSubCount,
  SELECTTablecompanybrinshStagesSubAll,
  SELECTTablecompanySubProjectStageCUSTONe,
  SELECTLastTableChateStage,
  SELECTTableSavepdf,
  SELECTTablecompanySubProjectexpenseObjectOneforArchif,
  SELECTSEARCHINFINANCE,
  SELECTTablecompanySubProjectREVENUEObjectOne,
  SELECTTablecompanySubProjectReturnedObjectOne,
  SELECTallDatafromTableRequests,
  SELECTDataAndTaketDonefromTableRequests,
  SELECTProjectStartdate,
  SELECTTablecompanySubProjectLast_id,
  SELECTTablecompany,
} = require("../../sql/selected/selected");
const fs = require("fs");
const path = require("path");
const {
  StatmentAllpdf,
  StatmentExpensePdf,
} = require("../../pdf/convertotpdf");
const { bucket } = require("../../bucketClooud");
const { insertTableSabepdf } = require("../../sql/INsertteble");
const { UPDATETableSavepdf } = require("../../sql/update");
const {
  SELECTTableusersCompanyonObject,
  SELECTTableusersCompany,
} = require("../../sql/selected/selectuser");
const { query } = require("express");
// استيراد بيانات المشروع حسب الفرع
const BringProject = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const IDcompanySub = req.query.IDcompanySub;
    const PhoneNumber = req.query.PhoneNumber;
    const IDfinlty = req.query.IDfinlty;
    let arrayBrinsh = [];
    const Datausere = await SELECTTableusersCompanyonObject(PhoneNumber);
    if (Datausere.job !== "Admin") {
      let validity =
        Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];
      if (validity.length > 0) {
        for (let index = 0; index < validity?.length; index++) {
          const element = validity[index];

          if (
            element.job === "مدير الفرع" &&
            parseInt(element.idBrinsh) === parseInt(IDcompanySub)
          ) {
            const result = await SELECTTablecompanySubProject(
              IDcompanySub,
              IDfinlty
            );
            console.log(result);
            arrayBrinsh = await BringTotalbalance(
              IDcompanySub,
              userSession.IDCompany,
              result
            );
          } else {
            for (let index = 0; index < element.project.length; index++) {
              // console.log(validity);
              const elementProject = element.project[index];
              const result = await SELECTTablecompanySubProjectLast_id(
                elementProject.idProject,
                "party"
              );
              arrayBrinsh.push(result);
            }

            if (arrayBrinsh.length > 0) {
              arrayBrinsh = await BringTotalbalance(
                IDcompanySub,
                userSession.IDCompany,
                arrayBrinsh
              );
            }
          }
        }
      }
    } else {
      const result = await SELECTTablecompanySubProject(IDcompanySub, IDfinlty);
      arrayBrinsh = await BringTotalbalance(
        IDcompanySub,
        userSession.IDCompany,
        result
      );
    }
    // console.log(arrayBrinsh);

    res.send({ success: true, data: arrayBrinsh }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};
// لانشاء كائن المشروع
const BringTotalbalance = async (IDcompanySub, IDCompany, result) => {
  let arrayReturnProject = [];
  const datacompany = await SELECTTablecompany(IDCompany, "DisabledFinance");

  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    const data = await OpreationExtrinProject(element, IDCompany, IDcompanySub);
    if (data !== undefined) {
      arrayReturnProject.push({
        ...data,
        DisabledFinance: datacompany?.DisabledFinance,
      });
    }
  }
  return arrayReturnProject;
};

const BringDataprojectClosed = async (req, res) => {
  try {
    const IDCompanySub = req.query.IDCompanySub;
    const IDfinlty = req.query.IDfinlty;
    const result = await SELECTTablecompanySubProject(
      IDCompanySub,
      IDfinlty,
      "all",
      "false"
    );

    res.send({ success: "تمت العملية بنجاح", data: result }).status(200);
  } catch (error) {
    res.send({ success: "فشل تنفيذ العملية" }).status(401);

    console.log(error);
  }
};

// عملية استخراج بيانات المشروع ككائان واحد
const OpreationExtrinProject = async (element, IDCompany, IDcompanySub) => {
  try {
    if (element?.id !== undefined) {
      const dataProject = await SELECTSUMAmountandBring(element.id);
      const rate = await PercentagecalculationforProject(element.id);
      const { daysDifference, Total } = await AccountCostProject(
        element.id,
        element.ConstCompany
      );
      const countuser = await BringCountUserinProject(
        IDCompany,
        IDcompanySub,
        element.id
      );
      const data = {
        ...element,
        DaysUntiltoday: daysDifference,
        TotalcosttothCompany: Total,
        cost: dataProject.RemainingBalance,
        rate: rate,
        countuser: countuser,
      };
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
//  عملية رئيسية لجلب مشروع واحد
const BringProjectObjectone = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const idProject = req.query.idProject;
    const result = await SELECTTablecompanySubProjectLast_id(
      idProject,
      "party"
    );

    const data = await OpreationExtrinProject(
      result,
      userSession.IDCompany,
      result?.IDcompanySub
    );

    res.send({ success: "تم نجاح العملية", data: data }).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: "فشل تنفيذ العملية" });
  }
};
// لمعرفة عدد مستخدمي المشروع

const BringCountUserinProject = (IDCompany, IDcompanySub, idproject) => {
  return new Promise(async (resolve, reject) => {
    let arrayvalidityuser = [];
    const result = await SELECTTableusersCompany(IDCompany);
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      // console.log(element.Validity)
      const validity = JSON.parse(element.Validity) || [];
      if (validity.length > 0) {
        // console.log(type, "mmmmmmmm");
        const datanew = await BringUserinProject(
          validity,
          IDcompanySub,
          idproject,
          element
        );
        if (Object.entries(datanew).length > 0) {
          arrayvalidityuser.push(datanew);
        }
      }
    }
    resolve(arrayvalidityuser.length);
  });
};
const BringUserinProject = (Validity, idBrinsh, idProject, element) => {
  let arrayUser = {};
  //      لاخراج  البيانات من داخل حاوية الصلاحيات
  Validity.forEach((pic) => {
    //  للتحقق من وجود المستخدم بداخل الفرع
    if (parseInt(pic.idBrinsh) === parseInt(idBrinsh)) {
      //  للتحقق من وجود تحديد عدد المشاريع
      if (pic?.project.length > 0) {
        const findUserinProject = pic?.project?.find(
          (items) => parseInt(items.idProject) === parseInt(idProject)
        );
        //  للتحقق من وجود ان للمستخدم صلاحية لدخول المشروع
        if (findUserinProject) {
          arrayUser = element;
        }
      }
    }
  });
  return arrayUser;
};

const AccountCostProject = async (id, ConstCompany) => {
  const DataProject = await SELECTTablecompanySubProject(id, 0, "difference");
  let StartDate = new Date(DataProject[0].Contractsigningdate);
  const date2 = new Date();
  const daysDifference = await differenceInDays(StartDate, date2);
  // console.log(daysDifference);
  let Total = parseInt(ConstCompany) * daysDifference;
  if (isNaN(Total)) {
    Total = 0;
  }
  return { daysDifference, Total };
};

function differenceInDays(startDate, endDate) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24; // Milliseconds in one day
  const differenceInMilliseconds = endDate - startDate; // Difference in milliseconds
  return Math.floor(differenceInMilliseconds / millisecondsPerDay); // Convert to days
}

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
    // console.log(Type);
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
    // console.log(result.length, ProjectID);
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
    let array = [];
    result.forEach((pic) => {
      array.push({
        ...pic,
        Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
      });
    });
    res.send({ success: true, data: array }).status(200);
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
    let array = [];
    result.forEach((pic) => {
      array.push({
        ...pic,
        Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
      });
    });
    res.send({ success: true, data: array }).status(200);
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
    let array = [];
    result.forEach((pic) => {
      array.push({
        ...pic,
        Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
      });
    });
    res.send({ success: true, data: array }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};
// استيراد المجموع لبيانات المالية

const BringTotalAmountproject = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const result = await SELECTSUMAmountandBring(ProjectID);
    res.send(result).status(200);
  } catch (error) {
    console.log(error);
    res.status(404);
  }
};

// استيراد كشف حساب المالية للمشروع

const BringStatmentFinancialforproject = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    // await DeleteTableSavepdf(ProjectID);
    const type = req.query.type;
    let namefile;
    let verify = false;
    let chackprojct = false;

    const sevepdf = await SELECTTableSavepdf(ProjectID);
    const Totalproject = await SELECTSUMAmountandBring(ProjectID);
    console.log(Totalproject);

    if (sevepdf !== 0 && sevepdf?.Total !== undefined) {
      if (
        (parseInt(sevepdf.Total) === parseInt(Totalproject.RemainingBalance) &&
          type === "all") ||
        (type !== "all" &&
          parseInt(sevepdf.TotalExpense) ===
            parseInt(Totalproject.TotalExpense))
      ) {
        namefile = type === "all" ? sevepdf.namefileall : sevepdf.namefileparty;
        if (namefile !== null) {
          return res
            .status(200)
            .send({ success: "تمت العملية بنجاح", url: namefile });
        } else {
          verify = true;
          chackprojct = true;
        }
      } else {
        verify = true;
        chackprojct = true;
      }
    } else {
      verify = true;
    }
    let kindTable;
    let kindTotal;
    const output = Math.floor(1000 + Math.random() * 9000);
    if (verify) {
      try {
        namefile =
          type === "all" ? sevepdf?.namefileall : sevepdf?.namefileparty;
        if (namefile) {
          const file = bucket.file(namefile);
          await file.delete();
          console.log(`File ${namefile} deleted successfully.`);
        }
      } catch (error) {
        console.log(error);
      }

      if (type === "all") {
        namefile = `${output}all.pdf`;
      } else {
        namefile = `${output}party.pdf`;
      }

      const filePath = path.join(__dirname, "../../upload", namefile);
      if (type === "all") {
        await StatmentAllpdf(ProjectID, filePath);
        kindTable = "Total";
        kindTotal = Totalproject.RemainingBalance;
      } else {
        await StatmentExpensePdf(ProjectID, filePath);
        kindTable = "TotalExpense";
        kindTotal = Totalproject.TotalExpense;
      }

      if (fs.existsSync(filePath)) {
        await bucket.upload(filePath);
      } else {
        console.error(`File ${filePath} does not exist for upload.`);
        return res
          .status(400)
          .send({ success: "فشل في تنفيذ العملية - الملف غير موجود" });
      }

      let nametable = type !== "all" ? "namefileparty" : "namefileall";
      if (chackprojct) {
        await UPDATETableSavepdf(
          [namefile, kindTotal, ProjectID],
          nametable,
          kindTable
        );
      } else {
        await insertTableSabepdf(
          [ProjectID, namefile, kindTotal],
          nametable,
          kindTable
        );
      }

      res.status(200).send({ success: "تمت العملية بنجاح", url: namefile });
    }
  } catch (error) {
    console.error("Error in processing:", error);
    res.status(400).send({ success: "فشل في تنفيذ العملية" });
  }
};

// عمليات البحث في قسم المالية
const SearchinFinance = async (req, res) => {
  try {
    // console.log(req.query);
    const projectID = req.query.projectID;
    const type = req.query.type;
    const from = req.query.from;
    const to = req.query.to;
    const fromtime = req.query.fromtime;
    const totime = req.query.totime;
    // {id: 1, name: 'مصروفات'},
    // {id: 2, name: 'عهد'},
    // {id: 3, name: 'مرتجعات'},
    let array = [];

    let kind =
      type === "مصروفات" ? "Expense" : type === "عهد" ? "Revenue" : "Returns";
    const result = await SELECTSEARCHINFINANCE(
      kind,
      projectID,
      parseInt(from),
      parseInt(to),
      fromtime,
      totime
    );
    // console.log(result);
    if (result.length > 0) {
      result.forEach((pic) => {
        array.push({
          ...pic,
          Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
        });
      });
    }
    res.send({ success: "تمت العملية بنجاح", data: array }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(400);
  }
};

// *******************************************************************************************
//******************************** استيراد بيانات الارشيف************************************
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
    const idproject = req.query.idproject;
    let result;
    result = await SELECTTablecompanySubProjectarchivesotherroad(
      parseInt(ArchivesID)
    );

    const children = JSON.parse(result.children);

    if (verifyfromfiletname(result.FolderName)) {
      if (parseInt(ArchivesID) !== parseInt(idSub)) {
        const resultall = await BringchildeArchives(children, parseInt(idSub));
        result = await ExtractDatafromFolderchilde(resultall);
      } else {
        // console.log(type, "type no archivesid !== idsub");
        result = await ExtractDatafromFolderchilde(children);
      }
    } else {
      result = await ExtractDatafromFolderHome(
        idproject,
        result.FolderName,
        type,
        idSub
      );
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

const ExtractDatafromFolderchilde = async (children) => {
  return new Promise((resolve, reject) => {
    let array = [];
    try {
      children?.forEach((pic, index) => {
        array.push({
          id: pic.id,
          namefile: `${pic.Date}(${index + 1})`,
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

//  التحقق ان المطلوب ليس من الملفات الرئيسية
const verifyfromfiletname = (folder) => {
  try {
    if (
      folder !== "المراحل" &&
      folder !== "العهد" &&
      folder !== "المرتجعات" &&
      folder !== "الفواتير والسندات"
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

// استخراج ملفات الفرعية للملفات الرئيسية للنظام
const ExtractDatafromFolderHome = async (
  idproject,
  FolderName,
  type = "Home",
  idSub = 0
) => {
  // console.log(FolderName);
  try {
    switch (FolderName) {
      case "المراحل":
        return await ExtractDatafromStage(idproject, type, idSub);
      case "الفواتير والسندات":
        return await ExtractDatafromExpense(idproject, type, idSub);
      case "العهد":
        return await ExtractDatafromRevenue(idproject, type, idSub);
      case "المرتجعات":
        return await ExtractDatafromReturn(idproject, type, idSub);
    }
  } catch (error) {
    console.log(error);
  }
};

// استخراج ملفات المراحل

const ExtractDatafromStage = async (idproject, type, idSub) => {
  try {
    let arrayfolder = [];
    const StagesCUST = await SELECTTablecompanySubProjectStageCUST(idproject);
    if (type === "Home") {
      StagesCUST.forEach((pic) => {
        arrayfolder.push({
          id: pic.StageID,
          idproject: idproject,
          name: pic.StageName,
          type: "folder",
        });
      });
    } else {
      let kind = idSub === "A1" ? "Chat" : "ChatSTAGE";
      const fileArray = await SELECTLastTableChateStage(
        idproject,
        idSub,
        1,
        "files",
        kind
      );
      // console.log(fileArray);
      for (let index = 0; index < fileArray.length; index++) {
        const element = fileArray[index];
        const Files = JSON.parse(element.File);
        if (Files.name !== undefined && Files.name !== "") {
          arrayfolder.push({
            id: index + 1,
            namefile: `${element.Date}(${index + 1})`,
            name: Files.name,
            type: Files.type,
            size: Files.size,
          });
        }
      }
    }

    return arrayfolder;
  } catch (error) {
    console.log(error);
  }
};

// استخراج الفواتير والسندات

const ExtractDatafromExpense = async (idproject, type, idSub) => {
  const dataHome = await SELECTTablecompanySubProjectexpense(
    idproject,
    "InvoiceNO"
  );
  // console.log(dataHome);
  let arrayfolder = [];
  if (type === "Home") {
    dataHome.forEach((pic, index) => {
      arrayfolder.push({
        id: pic.InvoiceNo,
        idproject: idproject,
        name: pic.InvoiceNo,
        type: "folder",
      });
    });
  } else {
    const datasub = await SELECTTablecompanySubProjectexpenseObjectOneforArchif(
      idSub,
      idproject
    );
    const Images = datasub.Image !== null ? JSON.parse(datasub.Image) : [];
    for (let index = 0; index < Images.length; index++) {
      const element = Images[index];
      arrayfolder.push({
        id: index + 1,
        namefile: `${datasub.InvoiceNo}-(${index + 1})`,
        name: element,
        type: "image/jpeg",
        size: 0,
      });
    }
    console.log(arrayfolder);
    arrayfolder.push({
      id: arrayfolder.length + 1,
      Data: datasub,
      type: "Data",
      kindPage: "BringExpense",
      size: 0,
    });
  }
  return arrayfolder;
};

//
const ExtractDatafromReturn = async (idproject, type, idSub) => {
  try {
    const dataHome = await SELECTTablecompanySubProjectReturned(idproject);
    let arrayfolder = [];
    if (type === "Home") {
      dataHome.forEach((pic) => {
        arrayfolder.push({
          id: pic.ReturnsId,
          name: pic.ReturnsId,
          type: "folder",
        });
      });
    } else {
      const datasub = await SELECTTablecompanySubProjectReturnedObjectOne(
        idSub
      );
      const Images = datasub.Image !== null ? JSON.parse(datasub.Image) : [];
      for (let index = 0; index < Images.length; index++) {
        const element = Images[index];
        arrayfolder.push({
          id: index + 1,
          namefile: `${datasub.ReturnsId}-(${index + 1})`,
          name: element,
          type: "image/jpeg",
          size: 0,
        });
      }
      arrayfolder.push({
        id: arrayfolder.length + 1,
        Data: datasub,
        type: "Data",
        kindPage: "Return",
        size: 0,
      });
    }
    return arrayfolder;
  } catch (error) {
    console.log(error);
  }
};
const ExtractDatafromRevenue = async (idproject, type, idSub) => {
  try {
    const dataHome = await SELECTTablecompanySubProjectREVENUE(idproject);
    let arrayfolder = [];
    if (type === "Home") {
      dataHome.forEach((pic) => {
        arrayfolder.push({
          id: pic.RevenueId,
          name: pic.RevenueId,
          type: "folder",
        });
      });
    } else {
      const datasub = await SELECTTablecompanySubProjectREVENUEObjectOne(idSub);
      const Images = datasub.Image !== null ? JSON.parse(datasub.Image) : [];
      for (let index = 0; index < Images.length; index++) {
        const element = Images[index];
        arrayfolder.push({
          id: index + 1,
          namefile: `${datasub.RevenueId}-(${index + 1})`,

          name: element,
          type: "image/jpeg",
          size: 0,
        });
      }
      arrayfolder.push({
        id: arrayfolder.length + 1,
        Data: datasub,
        type: "Data",
        kindPage: "BringRevenue",

        size: 0,
      });
    }
    return arrayfolder;
  } catch (error) {
    console.log(error);
  }
};

// ********************************************************************************
// ************** استيرات بيانات الطلبيات ***************************************
// console.log(count['COUNT(Done)'],count,'hhh')
const BringDataRequests = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const Type = req.query.Type;
    const result = await SELECTallDatafromTableRequests(Type, ProjectID);
    let arraynew = [];
    await Promise.all(
      result.map(async (pic) => {
        let InsertBy = null;
        let Implementedby = null;
        if (pic.InsertBy !== null) {
          const user = await SELECTTableusersCompanyonObject(pic.InsertBy);
          InsertBy = user.userName;
        }
        if (pic.Implementedby !== null) {
          const user = await SELECTTableusersCompanyonObject(pic.Implementedby);
          Implementedby = user.userName;
        }
        arraynew.push({
          ...pic,
          Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
          InsertBy: InsertBy,
          Implementedby: Implementedby,
        });
      })
    );
    // console.log(arraynew);
    res.send({ success: "تمت العملية بنجاح", data: arraynew }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(200);
  }
};

const BringCountRequsts = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;

    const countCLOSE = await SELECTDataAndTaketDonefromTableRequests(
      ProjectID,
      "false"
    );
    const countOPEN = await SELECTDataAndTaketDonefromTableRequests(
      ProjectID,
      "true"
    );
    res.send({
      success: "تمت العملية النجاح",
      data: {
        Close: countCLOSE["COUNT(Done)"],
        Open: countOPEN["COUNT(Done)"],
      },
    });
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(200);
  }
};

// *******************************************************************************
// *************************** انشاء تقرير للمشروع *****************************

const BringReportforProject = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;

    const result = await SELECTTablecompanySubProjectStageCUST(ProjectID);
    let arrayresult = [];
    let arrayDelay = [];
    let arrayTrue = [];
    // console.log(result.length, ProjectID);
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if (
        element.Done === "true" &&
        String(element.Difference).startsWith("-")
      ) {
        arrayDelay.push(index);
      }
      const rate = await PercentagecalculationforSTage(
        element.StageID,
        ProjectID
      );
      if (rate === 0) {
        arrayresult.push(rate);
      }
      if (rate === 100) {
        arrayTrue.push(rate);
      }
    }
    // اجمالي الهام
    const accountallStageProject = await SELECTTablecompanybrinshStagesSubAll(
      ProjectID
    );
    const countall = accountallStageProject["COUNT(StageSubName)"];

    // اجمالي المهام المنفذة
    const accountTrueStage = await SELECTTablecompanybrinshStagesSubAll(
      ProjectID,
      "true"
    );
    // اجمالي قيد الانتظار
    const accountFalseStage = await SELECTTablecompanybrinshStagesSubAll(
      ProjectID,
      "false"
    );

    // عدد المراحل المنجزة
    const countTrue = accountTrueStage["COUNT(StageSubName)"];

    // النسبة المئوية للمشروع
    const rateProject = await PercentagecalculationforProject(ProjectID);

    // قيد الانتظار
    //  عدد المهام قيد التنفيذ
    const StagesPending = accountFalseStage["COUNT(StageSubName)"];
    // المتأخرة
    //  عدد المراحل المتأخرة
    const LateStages = arrayDelay.length;
    // الطلبات
    const countallRequests = await SELECTDataAndTaketDonefromTableRequests(
      ProjectID,
      "allCount"
    );
    //  عدد الطلبات المغلقة
    const countCLOSE = await SELECTDataAndTaketDonefromTableRequests(
      ProjectID,
      "false"
    );
    let RateRequests =
      (countCLOSE["COUNT(Done)"] / countallRequests["COUNT(Done)"]) * 100;
    if (isNaN(RateRequests)) {
      RateRequests = 0;
    }
    // عدد الطلبات المفتوحة
    const countOPEN = await SELECTDataAndTaketDonefromTableRequests(
      ProjectID,
      "true"
    );
    // اكثر مهندس متفاعل عبر معرفة اكثر المهام منجزة

    const userMostAccomplished = await ExtractTheMostAccomplished(
      ProjectID,
      countTrue
    );
    const itemProject = await SELECTProjectStartdate(ProjectID, "Const");
    const { daysDifference, Total } = await AccountCostProject(
      itemProject.id,
      itemProject.ConstCompany
    );
    let data = {
      countSTageTrue: countTrue,
      countStageall: countall,
      rateProject: rateProject,
      StagesPending: StagesPending,
      LateStages: LateStages,
      countallRequests: countallRequests["COUNT(Done)"],
      countCLOSE: countCLOSE["COUNT(Done)"],
      countOPEN: countOPEN["COUNT(Done)"],
      RateRequests: RateRequests,
      MostAccomplished: userMostAccomplished,
      DaysUntiltoday: daysDifference,
      TotalcosttothCompany: Total,
    };
    res.send({ success: "تمت العملية بنجاح", data: data }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(404);
  }
};

// استخراج اكثر المهندسين انجازاً
const ExtractTheMostAccomplished = (ProjectID, countTrue) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await SELECTTablecompanySubProjectStagesSub(
        ProjectID,
        0,
        "accomplished"
      );
      let arrayNew = [];
      console.log(result);
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        let arrayClosing = [];
        let Operations =
          element.closingoperations !== null
            ? JSON.parse(element.closingoperations)
            : [];
        for (let P = 0; P < Operations.length; P++) {
          const item = Operations[P];
          if (item.type === "تم الانجاز") {
            arrayClosing.push(item);
          }
        }
        arrayNew.push(arrayClosing[arrayClosing.length - 1]);
      }
      const similarPhoneNumbers = await countOccurrences(
        arrayNew,
        "PhoneNumber"
      );
      // console.log(similarPhoneNumbers);
      const largestNumber = await extractLargestNumber(similarPhoneNumbers);
      let arrayUser = [];
      for (let index = 0; index < largestNumber?.user.length; index++) {
        const items = largestNumber?.user[index];
        const DataUser = await SELECTTableusersCompanyonObject(items);
        let rate = (largestNumber.maxNumber / countTrue) * 100;
        if (isNaN(rate)) {
          rate = 0;
        }
        arrayUser.push({
          id: DataUser.id,
          userName: DataUser.userName,
          IDNumber: DataUser.IDNumber,
          PhoneNumber: DataUser.PhoneNumber,
          image: DataUser.image,
          job: DataUser.job,
          Count: largestNumber.maxNumber,
          rate: rate,
        });
      }
      resolve(arrayUser);
    } catch (error) {
      console.log(error);
    }
  });
};

// const data = { Alice: 4, Bob: 2,Bobd: 4, Charlie: 1 };

// Function to extract the largest number
function extractLargestNumber(obj) {
  const maxNumber = Math.max(...Object.values(obj));
  const user = Object.entries(obj)
    .filter(([key, value]) => value === maxNumber)
    .map((item) => item[0]);
  return { user, maxNumber };
}

// const largestNumber = extractLargestNumber(data);
// console.log(largestNumber); // Output: 4

// Sample data array
// let array = [
//   { id: 1001, userName: 'Alice', PhoneNumber: '1234567890', Date: new Date().toDateString() },
//   { id: 1002, userName: 'Bob', PhoneNumber: '1234567891', Date: new Date().toDateString() },
//   { id: 1003, userName: 'Alice', PhoneNumber: '1234567890', Date: new Date().toDateString() },
//   { id: 1004, userName: 'Charlie', PhoneNumber: '1234567892', Date: new Date().toDateString() },
//   { id: 1005, userName: 'Bob', PhoneNumber: '1234567891', Date: new Date().toDateString() },
// ];
function countOccurrences(arr, key) {
  return arr.reduce((acc, item) => {
    const value = item[key];
    if (acc[value]) {
      acc[value] += 1; // Increment count if already exists
    } else {
      acc[value] = 1; // Initialize count
    }
    return acc;
  }, {});
}

// const phoneNumberCounts = countOccurrences(array, 'userName');
// console.log(phoneNumberCounts);

// Function to extract duplicates based on userName or PhoneNumber
// function extractSimilarElements(arr, key) {
//     const seen = new Set();
//     const duplicates = arr.filter(item => {
//         const value = item[key];
//         if (seen.has(value)) {
//             return true; // Found a duplicate
//         }
//         seen.add(value);
//         return false;
//     });
//     return [...new Set(duplicates)]; // Remove duplicates from the result
// }

// Extract duplicates based on PhoneNumber

// const similarPhoneNumbers = extractSimilarElements(array, 'PhoneNumber');
// console.log(similarPhoneNumbers);
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
  BringTotalAmountproject,
  BringStatmentFinancialforproject,
  SearchinFinance,
  BringDataRequests,
  BringCountRequsts,
  BringReportforProject,
  BringProjectObjectone,
  BringDataprojectClosed,
};
