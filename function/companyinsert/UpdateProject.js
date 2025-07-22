const {
  uploaddata,
  DeleteBucket,
  RenameBucket,
} = require("../../bucketClooud");
const {
  DeleteTablecompanySubProjectphase,
  DeleteTablecompanySubProjectarchives,
  DeleteTablecompanySubProjectall,
  DeleteTablecompanyStageSub,
  DeleteTablecompanyStageHome,
} = require("../../sql/delete");
const {
  SELECTTablecompanySubProjectStageCUST,
  SELECTProjectStartdate,
  SELECTTablecompanySubProjectStageCUSTONe,
  SELECTTablecompanySubProjectarchivesotherroad,
  SELECTTablecompanySubProjectexpenseObjectOne,
  SELECTTablecompanySubProjectREVENUEObjectOne,
  SELECTTablecompanySubProjectReturnedObjectOne,
  SELECTDataAndTaketDonefromTableRequests,
  SELECTTableFinance,
  SELECTTablecompanySubProjectLast_id,
  SELECTTablecompany,
  SELECTSUMAmountandBring,
  SELECTProjectid,
  SELECTStageid,
  SELECTTablecompanybrinshStagesSubAll,
  SELECTStageSubid,
  SELECTStageallid,
} = require("../../sql/selected/selected");
const {
  UpdateTablecompanySubProject,
  UpdateProjectStartdateinProject,
  UPDATETablecompanySubProjectStageNotes,
  UPDATETablecompanySubProjectStageCUST,
  UPDATETablecompanySubProjectarchivesFolder,
  UPDATETablecompanySubProjectarchivesFolderinChildern,
  UPDATETablecompanySubProjectexpense,
  UPDATETablecompanySubProjectREVENUE,
  UPDATETablecompanySubProjectReturned,
  UPDATETableinRequests,
  UPDATETableinRequestsDone,
  UpdateProjectClosorOpen,
  UPDATETablecompanySubProjectStagesSub,
  Updaterateandcost,
  UpdaterateandcostStage,
} = require("../../sql/update");
const {
  Projectinsert,
  Stageinsert,
  RearrangeStageProject,
  Financeinsertnotification,
} = require("../notifcation/NotifcationProject");
const { deleteFileSingle } = require("../../middleware/Fsfile");
const {
  BringCountUserinProject,
  PercentagecalculationforSTage,
} = require("../companyselect/bringProject");

const { StageTempletXsl,Stage,AccountDays } = require("../../middleware/Aid");


const UpdaterateCost = async (
  id,
  type = "rate",
  typeid = "id",
  IDCompany = 0
) => {
  let result = 0;
  if (type === "rate") {
    const rate = await PercentagecalculationforProject(id);
    result = rate;
  } else if (type === "cost") {
    const dataProject = await SELECTSUMAmountandBring(id);
    result = dataProject.RemainingBalance;
  } else {
    const countuser = await BringCountUserinProject(IDCompany, 0, id);
    result = countuser?.countuser;
  }
  await Updaterateandcost(id, result, "companySubprojects", type, typeid);
};

const UpdaterateStage = async (id, StageID) => {
  const rate = await PercentagecalculationforSTage(StageID, id);
  await UpdaterateandcostStage(rate, StageID, id);
};

const addallcostandrate = async () => {
  const result = await SELECTProjectid();
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    // console.log(element.id);
    await UpdaterateCost(element.id);
    await UpdaterateCost(element.id, "cost");
    await UpdaterateCost(element.id, "countuser", "id", 1);
  }
};

const addrateallinstage = async () => {
  const result = await SELECTStageid();
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    // console.log(element.ProjectID, element.StageID);
    await UpdaterateStage(element.ProjectID, element.StageID);
  }
};

const updatelastproject = async () => {
  await Updaterateandcost(149, 0, "companySubprojects", 'rate', 'id');
  await Updaterateandcost(149, 0, "companySubprojects", 'countuser', 'id');

  const result = await SELECTStageallid(149);
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    
    await Updaterateandcost(element.StageCustID,0, "StagesCUST", 'rate', 'StageCustID');
  }

};
// updatelastproject();


// addallcostandrate()
// addrateallinstage();

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

// وظيفة تقوم بتعديل بيانات الشمروع
const UpdataDataProject = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const {
        IDcompanySub,
        Nameproject,
        Note,
        TypeOFContract,
        GuardNumber,
        LocationProject,
        numberBuilding,
        Referencenumber,
        ProjectID,
      } = req.body;

      const StartDate = await SELECTProjectStartdate(ProjectID);

      await UpdateTablecompanySubProject([
        IDcompanySub,
        Nameproject,
        Note,
        TypeOFContract,
        GuardNumber,
        LocationProject,
        numberBuilding,
        Referencenumber,
        ProjectID,
      ]);
      if (StartDate?.numberBuilding !== numberBuilding) {
        await RearrangeStageID(ProjectID, StartDate, numberBuilding);
      }
      res.send({ success: "تمت العملية بنجاح" }).status(200);
      // console.log(ProjectID, "update");

      await Projectinsert(IDcompanySub, userSession.userName, "تعديل");
    } catch (error) {
      console.log(error);
    }
  };
};

const CloseOROpenProject = (uploadQueue) => {
  return async (req, res) => {
    try {
      const idProject = req.query.idProject;
      const project = await SELECTTablecompanySubProjectLast_id(
        idProject,
        "party"
      );
      let Disabled = "true";
      if (project?.Disabled === "true") {
        Disabled = "false";
      }
      await UpdateProjectClosorOpen([Disabled, idProject]);
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(401);
    }
  };
};

// وظيفة تقوم باعادة ترتيب المراحل وايامها
const RearrangeStageID = async (ProjectID, StartDate, numberBuilding) => {
  try {
    const DataSTage = await SELECTTablecompanySubProjectStageCUST(ProjectID);

    let tables = [];
    for (let index = 0; index < DataSTage.length; index++) {
      const element = DataSTage[index];

      const dataSimble = await StageTempletXsl(element.StageID, "update");
      console.log(dataSimble, "dataSimble");
      let Days = await AccountDays(numberBuilding, dataSimble.Days);

      tables.push({
        ...element,
        Days: Math.round(Days),
      });
    }
    let date = StartDate["Contractsigningdate"];
    if (StartDate["ProjectStartdate"] !== null) {
      date = StartDate["ProjectStartdate"];
    }

    await DeleteTablecompanySubProjectphase(ProjectID);
    await Stage(tables, date, "update");
  } catch (error) {
    console.log(error);
  }
};

// const count = 14 + 14 / 3;
// console.log(count);
//  وظيفة لحذف المشروع كامل مع توابعه
const DeletProjectwithDependencies = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
        const id = req.query.idProject;
        await opreationDeletProject(id);
        res.send({ success: "تمت عملية الحذف بنجاح" }).status(200);
   
    } catch (error) {
      console.log(error);
      res.send({ success: "فشلت عملية حذف الرسالة" }).status(200);
    }
  };
};

const opreationDeletProject = (id) => {
  [
    { name: "StagesCUST", type: "ProjectID" },
    { name: "StageNotes", type: "ProjectID" },
    { name: "StagesSub ", type: "projectID" },
    { name: "Expense ", type: "projectID" },
    { name: "Revenue ", type: "projectID" },
    { name: "Returns ", type: "projectID" },
    { name: "Savepdf ", type: "projectID" },
    { name: "Archives ", type: "ProjectID" },
    { name: "Requests ", type: "ProjectID" },
    { name: "Post ", type: "ProjectID" },
    { name: "ChatSTAGE ", type: "ProjectID" },
    { name: "Chat ", type: "ProjectID" },
    { name: "Navigation ", type: "ProjectID" },
    { name: "companySubprojects ", type: "id" },
  ].forEach(async (pic) => {
    await DeleteTablecompanySubProjectall(pic.name, pic.type, id);
  });
};

// وظيفة تقوم بإضافة تاريخ بدء تنفيذ المشروع واعادة ترتيب تواريخ المراحل
const UpdateStartdate = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { ProjectID, ProjectStartdate } = req.body.data;
      await UpdateProjectStartdateinProject([ProjectStartdate, ProjectID]);
      dataItem = await SELECTTablecompanySubProjectStageCUST(ProjectID);
      await DeleteTablecompanySubProjectphase(ProjectID);
      await Stage(dataItem, ProjectStartdate, "update");

      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};
// وظيفة تقوم بإعادة ترتيب المراحل حسب رؤية المستخدم
const RearrangeStage = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const DataSTage = req.body.DataStage;
      const StartDate = await SELECTProjectStartdate(DataSTage[0].ProjectID);
      let date = StartDate["Contractsigningdate"];
      if (StartDate["ProjectStartdate"] !== null) {
        date = StartDate["ProjectStartdate"];
      }
      await DeleteTablecompanySubProjectphase(DataSTage[0].ProjectID);
      await Stage(DataSTage, date, "update");
      await RearrangeStageProject(DataSTage[0].ProjectID, userSession.userName);
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "خطاء في تنفيذ العملية" }).status(401);
    }
  };
};
// وظيفة تعديل تاخيرات المرحلة الرئيسية
const UpdateNotesStage = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      if (req.file) {
        try {
          await uploaddata(req.file);
        } catch (error) {
          console.log(error);
        }
      }
      const StageNoteID = req.body.StageNoteID;
      const Type = req.body.Type;
      const Note = req.body.Note;
      const RecordedBy = req.body.RecordedBy;
      const countdayDelay = req.body.countdayDelay;
      const ImageAttachment =
        req?.file === undefined
          ? req.body?.ImageAttachment
          : req.file?.filename;
      await UPDATETablecompanySubProjectStageNotes([
        Type,
        Note,
        RecordedBy,
        countdayDelay,
        ImageAttachment,
        StageNoteID,
      ]);

      res.send({ success: "تمت العملية بنجاح" }).status(200);
      // اشعارات
      // await Delayinsert(ProjectID, StagHOMID, userSession.userName);
    } catch (err) {
      console.log(err);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

//  وظيفة تعديل بيانات المرحلة الرئيسية
const UpdateDataStage = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const { ProjectID, StageID, StageName, Days } = req.body;

      const verify = await SELECTTablecompanySubProjectStageCUSTONe(
        ProjectID,
        StageID,
        "Update"
      );
      let Dayscont = Days;

      let massege = "تمت العملية بنجاح";
      if (verify !== undefined) {
        if (parseInt(Days) !== parseInt(verify.Days)) {
          massege =
            "تمت العملية بنجاح من دون تغيير تعديل ايام المرحله فهناك مراحل قد اغلقت";
        }
        Dayscont = verify.Days;
      }
      const ObjectStage = await SELECTTablecompanySubProjectStageCUSTONe(
        ProjectID,
        StageID,
        "all"
      );

      const regex = /\b\d{2,3}\b/;
      let indexStage = String(ObjectStage.StageName).match(regex);
      if (indexStage === null) {
        indexStage = String(ObjectStage.StageName).match(/\b\d{1,4}\b/);
      }
      await UPDATETablecompanySubProjectStageCUST([
        `${StageName} (${indexStage[0]})`,
        Dayscont,
        StageID,
        ProjectID,
      ]);
      if (verify === undefined) {
        const StartDate = await SELECTProjectStartdate(ProjectID);
        let date = StartDate["Contractsigningdate"];
        if (StartDate["ProjectStartdate"] !== null) {
          date = StartDate["ProjectStartdate"];
        }
        const table = await SELECTTablecompanySubProjectStageCUST(ProjectID);
        await DeleteTablecompanySubProjectphase(ProjectID);
        await Stage(table, date, "update");
      }

      res.send({ success: massege }).status(200);
      // اشعارات
      await Stageinsert(ProjectID, StageID, userSession.userName, "تعديل");
    } catch (error) {
      console.log(error);
      res.send({ success: "خطاء في تنفيذ العملية" }).status(401);
    }
  };
};

// وظيفة حذف المرحلة الرئيسية
const DeleteStageHome = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
        const { ProjectID, StageID } = req.query;
        await DeleteTablecompanyStageHome(ProjectID, StageID);
        await DeleteTablecompanyStageSub(ProjectID, StageID);
        const table = await SELECTTablecompanySubProjectStageCUST(ProjectID);
        let arraytable = [];
        table
          .filter(
            (item) => item.ProjectID !== ProjectID && item.StageID !== StageID
          )
          .forEach((pic) => {
            let split = pic?.StageName?.split("(");
            let b = split[0].trim();
            arraytable.push({
              ...pic,
              StageName: b,
            });
          });
        if (arraytable.length > 0) {
          await DeleteTablecompanySubProjectphase(ProjectID);
          const StartDate = await SELECTProjectStartdate(ProjectID);
          let date = StartDate["Contractsigningdate"];
          if (StartDate["ProjectStartdate"] !== null) {
            date = StartDate["ProjectStartdate"];
          }
          await Stage(arraytable, date);
        }
        res.send({ success: "نجح تنيفذ العملية" }).status(200);
        await UpdaterateCost(ProjectID);
        await UpdaterateStage(ProjectID, StageID);
   
    } catch (error) {
      console.log(error);
    }
  };
};

// وظيفة تعديل المرحلة الفرعية
const UpdateDataStageSub = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { StageSubName, StageSubID } = req.body;
      await UPDATETablecompanySubProjectStagesSub([StageSubName, StageSubID]);
      res.send({ success: "تم تنفيذ العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(200);
    }
  };
};
// وظيفة حذف المرحلة الفرعية
const DeleteStageSub = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
        const StageSubID = req.query.StageSubID;
        await DeleteTablecompanySubProjectall(
          "StagesSub",
          "StageSubID",
          StageSubID
        );
        res.send({ success: "تم تنفيذ العملية بنجاح" }).status(200);
        const result = await SELECTStageSubid(
          "StagesSub",
          "ProjectID,StagHOMID",
          `StageSubID=${StageSubID}`
        );
        await UpdaterateCost(result?.ProjectID);
        await UpdaterateStage(result?.ProjectID, result?.StagHOMID);
     
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(501);
    }
  };
};

// *********************************************************************************
// ****************تعديل اسم المجلد او حذفة في الارشيف ***************************

// وظيفة عملية تعديل اسم اي ملف في الارشيف
const ClassUpdataNmaeinArchive = async (
  ArchivesID,
  name,
  idsub,
  kidopreation
) => {
  let childrenNew;
  try {
    const children = await SELECTTablecompanySubProjectarchivesotherroad(
      ArchivesID
    );
    let Children =
      children.children !== null ? JSON.parse(children.children) : [];
    if (kidopreation === "update") {
      childrenNew = await updateChild(name, Children, idsub);
    } else {
      childrenNew = await deletChild(Children, idsub);
    }

    if (childrenNew !== undefined) {
      await UPDATETablecompanySubProjectarchivesFolderinChildern([
        JSON.stringify(childrenNew),
        ArchivesID,
      ]);
    }
  } catch (error) {
    console.log(error);
  }
};

const updateChild = (name, children, idsub) => {
  return new Promise((resolve, reject) => {
    const fileIndex = children.findIndex(
      (file) => parseInt(file.id) === parseInt(idsub)
    );
    if (fileIndex > -1) {
      children[fileIndex].name = name;
      resolve(children);
    } else {
      const promises = [];
      children.forEach((child) => {
        if (child.children) {
          promises.push(updateChild(name, child.children, idsub));
        }
      });
      Promise.all(promises)
        .then((results) => {
          resolve(children);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};
const deletChild = (children, idsub) => {
  return new Promise((resolve, reject) => {
    const fileIndex = children.findIndex(
      (file) => file.id === idsub // Assuming ids are strings
    );

    if (fileIndex > -1) {
      // File found, filter it out
      const updatedChildren = children.filter((file) => file.id !== idsub);
      resolve(updatedChildren);
    } else {
      // File not found, check children recursively
      const promises = children.map((child) => {
        if (child.children) {
          return deletChild(child.children, idsub).then((updatedChildren) => {
            // Update child with new children if any were deleted
            if (updatedChildren.length !== child.children.length) {
              child.children = updatedChildren;
            }
            return child; // Return updated child
          });
        }
        return Promise.resolve(child); // Return child as is if no children
      });

      Promise.all(promises)
        .then((results) => {
          resolve(results); // Return all updated children
        })
        .catch((error) => {
          reject(`Error in processing children: ${error}`);
        });
    }
  });
};

const UpdateNameFolderOrfileinArchive = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { ArchivesID, id, type, name, kidopreation } = req.body;

      if (type === "folder") {
        if (parseInt(ArchivesID) === parseInt(id)) {
          await SwitchbetweendeleteorupdatefolderHome(name, id, kidopreation);
        } else {
          await ClassUpdataNmaeinArchive(ArchivesID, name, id, kidopreation);
        }
        res.send({ success: "تمت العملية بنجاح" }).status(200);
      } else {
        const nameOld = req.body.nameOld;
        // console.log(nameOld);
        // Get a reference to the file
        await ClassUpdataNmaeinArchive(ArchivesID, name, id, kidopreation);
        await Switchbetweendeleteorupdatefiles(nameOld, name, kidopreation);
        // console.log("okkkk");
        res.send({ success: "تمت العملية بنجاح" }).status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "خطاء في تنفيذ العملية" }).status(401);
    }
  };
};

// وظيفة تعديل اوحذف من جوجل كلاود
const Switchbetweendeleteorupdatefiles = async (nameOld, name, type) => {
  try {
    switch (type) {
      case "update":
        await RenameBucket(nameOld, name);
        break;
      case "delete":
        await DeleteBucket(nameOld);
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

// تبديل بين حذف او تعديل المجلد الرئيسي
const SwitchbetweendeleteorupdatefolderHome = async (name, idsub, type) => {
  try {
    if (type === "update") {
      await UPDATETablecompanySubProjectarchivesFolder([name, idsub]);
    } else {
      await DeleteTablecompanySubProjectarchives(idsub);
    }
  } catch (error) {
    console.log(error);
  }
};

// تعديل بيانات المصروفات
const ExpenseUpdate = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const { Expenseid, Amount, Data, ClassificationName, Imageolddelete } =
        req.body;

      const elementUpdate = await SELECTTablecompanySubProjectexpenseObjectOne(
        Expenseid
      );
      // console.log(elementUpdate);

      const Imageoldindatabese =
        elementUpdate.Image !== null ? JSON.parse(elementUpdate.Image) : [];

      let arrayImage = [...Imageoldindatabese];

      if (Imageoldindatabese.length > 0 && String(Imageolddelete).length > 0) {
        // console.log(Imageoldindatabese, Imageolddelete, "arrays");

        // Delete old images from the database and bucket storage
        const imagesToDelete = Imageolddelete ? Imageolddelete.split(",") : [];
        await Promise.all(
          imagesToDelete.map(async (pic) => {
            arrayImage = arrayImage.filter((item) => item !== pic); // Remove the image from arrayImage
            try {
              await DeleteBucket(pic);
            } catch (error) {
              console.error(`Failed to delete image ${pic}:`, error);
            }
          })
        );
      }
      if (req.files && req.files.length > 0) {
        // Upload new images and update the array
        await Promise.all(
          req.files.map(async (element) => {
            try {
              await uploaddata(element);
              deleteFileSingle(element.filename, "upload");

              arrayImage.push(element.filename);
            } catch (error) {
              console.error(
                `Failed to upload image ${element.filename}:`,
                error
              );
            }
          })
        );
      }

      await UPDATETablecompanySubProjectexpense([
        Amount,
        Data,
        ClassificationName,
        JSON.stringify(arrayImage),
        Expenseid,
      ]);

      res.send({ success: "تمت العملية بنجاح" }).status(200);
      await UpdaterateCost(elementUpdate?.projectID, "cost");
      // await Financeinsertnotification(
      //   0,
      //   "مصروفات",
      //   "تعديل",
      //   userSession.userName,
      //   Expenseid
      // );
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(401);
    }
  };
};

// ادخال بييانات العهد
const RevenuesUpdate = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      const data = await SELECTTablecompany(userSession?.IDCompany);
      if (data.DisabledFinance === "true") {
        const RevenueId = req.body.RevenueId;
        const Amount = req.body.Amount;
        const Data = req.body.Data;
        const Bank = req.body.Bank;

        const Imageolddelete = req.body.Imageolddelete;
        const elementUpdate =
          await SELECTTablecompanySubProjectREVENUEObjectOne(RevenueId);
        // console.log(elementUpdate);

        const Imageoldindatabese =
          elementUpdate.Image !== null ? JSON.parse(elementUpdate.Image) : [];
        let arrayImage = [...Imageoldindatabese];
        // console.log(req.files, Imageoldindatabese, "kkkkkkk");
        if (
          Imageoldindatabese.length > 0 &&
          String(Imageolddelete).length > 0
        ) {
          // console.log(Imageolddelete, "arrays");
          const imageDelete = Imageolddelete ? Imageolddelete.split(",") : [];
          await Promise.all(
            imageDelete.map(async (pic) => {
              arrayImage = arrayImage.filter((item) => item !== pic);
              try {
                await DeleteBucket(pic);
              } catch (error) {
                console.log(error);
              }
            })
          );
        }
        if (req.files && req.files.length > 0) {
          // حذف الصورة السابقة من قاعدة البيانات ومن buckte storge
          await Promise.all(
            req.files.map(async (element) => {
              try {
                await uploaddata(element);
                deleteFileSingle(element.filename, "upload");

                arrayImage.push(element.filename);
              } catch (error) {
                console.error(
                  `Failed to upload image ${element.filename}:`,
                  error
                );
              }
            })
          );
        }

        await UPDATETablecompanySubProjectREVENUE([
          Amount,
          Data,
          Bank,
          JSON.stringify(arrayImage),
          RevenueId,
        ]);
        res.send({ success: "تمت العملية بنجاح" }).status(200);
        await UpdaterateCost(elementUpdate?.projectID, "cost");
        // await Financeinsertnotification(
        //   0,
        //   "عهد",
        //   "تعديل",
        //   userSession.userName,
        //   RevenueId
        // );
      } else {
        res
          .send({ success: "تم ايقاف الحذف اليدوي من قبل الادمن" })
          .status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

// ادخال بيانات المرتجع
const ReturnsUpdate = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const { ReturnsId, Amount, Data, Imageolddelete } = req.body;

      const elementUpdate = await SELECTTablecompanySubProjectReturnedObjectOne(
        ReturnsId
      );
      // (elementUpdate);
      const Imageoldindatabese =
        elementUpdate.Image !== null ? JSON.parse(elementUpdate.Image) : [];
      let arrayImage = [...Imageoldindatabese];

      if (Imageoldindatabese.length > 0 && String(Imageolddelete).length > 0) {
        // console.log(Imageolddelete, "arrays");

        const ImageDelete = Imageolddelete ? Imageolddelete.split(",") : [];
        await Promise.all(
          ImageDelete.map(async (pic) => {
            arrayImage = arrayImage.filter((item) => item !== pic);
            try {
              await DeleteBucket(pic);
            } catch (error) {
              console.log(error);
            }
          })
        );
      }
      if (req.files && req.files.length > 0) {
        await Promise.all(
          req.files.map(async (element) => {
            try {
              await uploaddata(element);
              deleteFileSingle(element.filename, "upload");

              arrayImage.push(element.filename);
            } catch (error) {
              console.error(
                `Failed to upload image ${element.filename}:`,
                error
              );
            }
          })
        );
      }
      // حذف الصورة السابقة من قاعدة البيانات ومن buckte storge
      await UPDATETablecompanySubProjectReturned([
        Amount,
        Data,
        JSON.stringify(arrayImage),
        ReturnsId,
      ]);
      res.send({ success: "تمت العملية بنجاح" }).status(200);
      await UpdaterateCost(elementUpdate?.projectID, "cost");

      // await Financeinsertnotification(
      //   0,
      //   "مرتجعات",
      //   "تعديل",
      //   userSession.userName,
      //   ReturnsId
      // );
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

const DeleteFinance = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      const data = await SELECTTablecompany(userSession?.IDCompany);
      if (
        data.DisabledFinance === "true"
      ) {
        const { id, type } = req.query;
        let nametype;
        let typeid;
        if (type === "مصروفات") {
          nametype = "Expense";
          typeid = "Expenseid";
        } else if (type === "عهد") {
          nametype = "Revenue";
          typeid = "RevenueId";
        } else {
          nametype = "Returns";
          typeid = "ReturnsId";
        }
        const result = await SELECTTableFinance(id, nametype, typeid);
        let Images = Boolean(result.Image) ? JSON.parse(result.Image) : [];
        for (let index = 0; index < Images.length; index++) {
          const element = Images[index];
          await Switchbetweendeleteorupdatefiles(element, "", "delete");
        }
        await DeleteTablecompanySubProjectall(nametype, typeid, id);
        res.send({ success: "تم الحذف بنجاح" }).status(200);
        await UpdaterateCost(result?.projectID, "cost");
      } else {
        res
          .send({ success: "تم ايقاف الحذف اليدوي من قبل الادمن" })
          .status(200);
      }
    } catch (error) {
      res.send({ success: "فشل تنفيذ العملية" }).status(500);
      console.log(error);
    }
  };
};

// *******************************************************************
// ****************** تعديل بيانات الطلبيات ************************

// تعديل بيانات الطلبيات الرئيسية
const UPDATEdataRequests = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const { Type, Data, RequestsID, user, Imageolddelete } = req.body;

      const elementUpdate = await SELECTDataAndTaketDonefromTableRequests(
        RequestsID
      );

      const Imageoldindatabese =
        elementUpdate.Image !== null ? JSON.parse(elementUpdate.Image) : [];
      let arrayImage = [...Imageoldindatabese];
      if (Imageoldindatabese.length > 0 && String(Imageolddelete).length > 0) {
        const imageDelete = Imageolddelete ? Imageolddelete.split(",") : [];
        await Promise.all(
          imageDelete.map(async (pic) => {
            arrayImage = arrayImage.filter((item) => item !== pic);
            try {
              await DeleteBucket(pic);
            } catch (error) {
              console.log(error);
            }
          })
        );
      }

      if (req.files && req.files.length > 0) {
        // حذف الصورة السابقة من قاعدة البيانات ومن buckte storge
        await Promise.all(
          req.files.map(async (element) => {
            try {
              await uploaddata(element);
              deleteFileSingle(element.filename, "upload");
              arrayImage.push(element.filename);
            } catch (error) {
              console.error(
                `Failed to upload image ${element.filename}:`,
                error
              );
            }
          })
        );
      }

      await UPDATETableinRequests([
        Type,
        Data,
        user,
        JSON.stringify(arrayImage),
        RequestsID,
      ]);
      res.send({ success: "تمت العملية بنجاح" }).status(200);

      await Financeinsertnotification(
        0,
        "طلب",
        "تعديل",
        userSession.userName,
        RequestsID
      );
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ  العملية" }).status(401);
    }
  };
};
// تنفيذ الطلبيه او الغاء التنفيذ
const UPDATEImplementRquestsORCansle = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { user, RequestsID } = req.body;
      const DoneOrgin = await SELECTDataAndTaketDonefromTableRequests(
        RequestsID
      );
      let Done;
      Done = DoneOrgin.Done === "true" ? "false" : "true";

      await UPDATETableinRequestsDone([Done, user, RequestsID]);
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ  العملية" }).status(401);
    }
  };
};
const Confirmarrivdrequest = (uploadQueue) => {
  return async (req, res) => {
    try {
      const RequestsID = req.query.RequestsID;
      const DoneOrgin = await SELECTDataAndTaketDonefromTableRequests(
        RequestsID
      );
      const Done = DoneOrgin.checkorderout === "true" ? "false" : "true";
      await UPDATETableinRequestsDone(
        [Done, RequestsID],
        (type = "checkorderout=?")
      );
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ  العملية" }).status(401);
    }
  };
};

const DeleteRequests = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
        const RequestsID = req.query.RequestsID;
        await DeleteTablecompanySubProjectall(
          "Requests",
          "RequestsID",
          RequestsID
        );
        res.send({ success: "تم تنفيذ العملية بنجاح" }).status(200);
  
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(501);
    }
  };
};

module.exports = {
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
  RearrangeStageID,
  Switchbetweendeleteorupdatefiles,
  opreationDeletProject,
  UpdaterateCost,
  UpdaterateStage,
};
