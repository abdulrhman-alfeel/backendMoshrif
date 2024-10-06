const { uploaddata, bucket } = require("../../bucketClooud");
const {
  DeleteTablecompanySubProjectphase,
  DeleteTablecompanySubProjectarchives,
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
} = require("../../sql/update");
const {
  Projectinsert,
  Delayinsert,
  Stageinsert,
  RearrangeStageProject,
  Financeinsertnotification,
} = require("../notifcation/NotifcationProject");
const { Stage } = require("./insertProject");
// وظيفة تقوم بتعديل بيانات الشمروع
const UpdataDataProject = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
    const IDcompanySub = req.body.IDcompanySub;
    const Nameproject = req.body.Nameproject;
    const Note = req.body.Note;
    const TypeOFContract = req.body.TypeOFContract;
    const GuardNumber = req.body.GuardNumber;
    const LocationProject = req.body.LocationProject;
    const ProjectID = req.body.ProjectID;
    await UpdateTablecompanySubProject([
      IDcompanySub,
      Nameproject,
      Note,
      TypeOFContract,
      GuardNumber,
      LocationProject,
      ProjectID,
    ]);

    res.send({ success: "تمت العملية بنجاح" }).status(200);
    await Projectinsert(ProjectID, userSession.userName);
  } catch (error) {
    console.log(error);
  }
};

// وظيفة تقوم بإضافة تاريخ بدء تنفيذ المشروع واعادة ترتيب تواريخ المراحل
const UpdateStartdate = async (req, res) => {
  try {
    const ProjectID = req.body.data.ProjectID;
    const ProjectStartdate = req.body.data.ProjectStartdate;
    await UpdateProjectStartdateinProject([ProjectStartdate, ProjectID]);
    dataItem = await SELECTTablecompanySubProjectStageCUST(ProjectID);
    await DeleteTablecompanySubProjectphase(ProjectID);
    await Stage(dataItem, ProjectStartdate);
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل في تنفيذ العملية" }).status(401);
  }
};
// وظيفة تقوم بإعادة ترتيب المراحل حسب رؤية المستخدم
const RearrangeStage = async (req, res) => {
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
    await Stage(DataSTage, date);
    await RearrangeStageProject(DataSTage[0].ProjectID,userSession.userName);
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "خطاء في تنفيذ العملية" }).status(401);
  }
};
// وظيفة تعديل تاخيرات المرحلة الرئيسية
const UpdateNotesStage = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
  if(req.file){
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
      req?.file === undefined ? req.body?.ImageAttachment : req.file?.filename;
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
//  وظيفة تعديل بيانات المرحلة
const UpdateDataStage = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
    const ProjectID = req.body.ProjectID;
    const StageID = req.body.StageID;
    const StageName = req.body.StageName;
    const Days = req.body.Days;
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

    await UPDATETablecompanySubProjectStageCUST([
      StageName,
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
      // console.log(table)
      await Stage(table, date);
    }

    res.send({ success: massege }).status(200);
    // اشعارات
    await Stageinsert(ProjectID, StageID, userSession.userName, "تعديل");
  } catch (error) {
    console.log(error);
    res.send({ success: "خطاء في تنفيذ العملية" }).status(401);
  }
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
    // console.log("ah", childrenNew);

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
      (file) => parseInt(file.id) === parseInt(idsub)
    );
    if (fileIndex > -1) {
      const newchildren = children.filter(
        (file) => parseInt(file.id) !== parseInt(idsub)
      );
      resolve(newchildren);
    } else {
      const promises = [];
      children.forEach((child) => {
        if (child.children) {
          promises.push(deletChild(child.children, idsub));
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

const UpdateNameFolderOrfileinArchive = async (req, res) => {
  try {
    const ArchivesID = req.body.ArchivesID;
    const idsub = req.body.id;
    const type = req.body.type;
    const name = req.body.name;
    const kidopreation = req.body.kidopreation;

    if (type === "folder") {
      if (parseInt(ArchivesID) === parseInt(idsub)) {
        await SwitchbetweendeleteorupdatefolderHome(name, idsub, kidopreation);
      } else {
        await ClassUpdataNmaeinArchive(ArchivesID, name, idsub, kidopreation);
      }
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } else {
      const nameOld = req.body.nameOld;
      // console.log(nameOld);
      // Get a reference to the file
      await Switchbetweendeleteorupdatefiles(nameOld, name, kidopreation);
      await ClassUpdataNmaeinArchive(ArchivesID, name, idsub, kidopreation);
      // console.log("okkkk");
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    }
  } catch (error) {
    console.log(error);
    res.send({ success: "خطاء في تنفيذ العملية" }).status(401);
  }
};

// وظيفة تعديل اوحذف من جوجل كلاود
const Switchbetweendeleteorupdatefiles = async (nameOld, name, type) => {
  // const filesToDelete = [
  //   'path/to/file1.txt',
  //   'path/to/file2.txt',
  //   'path/to/file3.txt',
  // ];

  // storage.bucket(bucketName).deleteFiles(filesToDelete)

  try {
    const file = bucket.file(nameOld);
    switch (type) {
      case "update":
        await file
          .rename(name)
          .then(() => {
            // console.log(`File renamed to ${name}`);
          })
          .catch((err) => {
            console.error(`Error renaming file: ${err}`);
          });
      case "delete":
        await file
          .delete()
          .then(() => {
            // console.log(`File ${nameOld} deleted from bucket`);
          })
          .catch((err) => {
            console.error(`Error deleting file: ${err}`);
          });
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
const ExpenseUpdate = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
    const Expenseid = req.body.Expenseid;
    const Amount = req.body.Amount;
    const Data = req.body.Data;
    const ClassificationName = req.body.ClassificationName;
    const Imageolddelete = req.body.Imageolddelete;
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
      const imagesToDelete = Imageolddelete ? [Imageolddelete] : [];
      await Promise.all(
        imagesToDelete.map(async (pic) => {
          arrayImage = arrayImage.filter((item) => item !== pic); // Remove the image from arrayImage
          try {
            await bucket.file(pic).delete();
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
            arrayImage.push(element.filename);
          } catch (error) {
            console.error(`Failed to upload image ${element.filename}:`, error);
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
    await Financeinsertnotification(
      0,
      "مصروفات",
      "تعديل",
      userSession.userName,
      Expenseid
    );
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(401);
  }
};

// ادخال بييانات العهد
const RevenuesUpdate = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
    const RevenueId = req.body.RevenueId;
    const Amount = req.body.Amount;
    const Data = req.body.Data;
    const Bank = req.body.Bank;

    const Imageolddelete = req.body.Imageolddelete;
    const elementUpdate = await SELECTTablecompanySubProjectREVENUEObjectOne(
      RevenueId
    );
    // console.log(elementUpdate);

    const Imageoldindatabese =
      elementUpdate.Image !== null ? JSON.parse(elementUpdate.Image) : [];
    let arrayImage = [...Imageoldindatabese];
    // console.log(req.files, Imageoldindatabese, "kkkkkkk");
    if (Imageoldindatabese.length > 0 && String(Imageolddelete).length > 0) {
      // console.log(Imageolddelete, "arrays");
      const imageDelete = Imageolddelete ? [Imageolddelete] : [];
      await Promise.all(
        imageDelete.map(async (pic) => {
          arrayImage = arrayImage.filter((item) => item !== pic);
          try {
            await bucket.file(pic).delete();
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
            arrayImage.push(element.filename);
          } catch (error) {
            console.error(`Failed to upload image ${element.filename}:`, error);
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
    await Financeinsertnotification(
      0,
      "عهد",
      "تعديل",
      userSession.userName,
      RevenueId
    );
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل في تنفيذ العملية" }).status(401);
  }
};

// ادخال بيانات المرتجع
const ReturnsUpdate = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
    const ReturnsId = req.body.ReturnsId;
    const Amount = req.body.Amount;
    const Data = req.body.Data;
    const Imageolddelete = req.body.Imageolddelete;
    const elementUpdate = await SELECTTablecompanySubProjectReturnedObjectOne(
      ReturnsId
    );
    // console.log(elementUpdate);
    const Imageoldindatabese =
      elementUpdate.Image !== null ? JSON.parse(elementUpdate.Image) : [];
    let arrayImage = [...Imageoldindatabese];

    if (Imageoldindatabese.length > 0 && String(Imageolddelete).length > 0) {
      // console.log(Imageolddelete, "arrays");

      const ImageDelete = Imageolddelete ? [Imageolddelete] : [];
      await Promise.all(
        ImageDelete.map(async (pic) => {
          arrayImage = arrayImage.filter((item) => item !== pic);
          try {
            await bucket.file(pic).delete();
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
            arrayImage.push(element.filename);
          } catch (error) {
            console.error(`Failed to upload image ${element.filename}:`, error);
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
    await Financeinsertnotification(
      0,
      "مرتجعات",
      "تعديل",
      userSession.userName,
      ReturnsId
    );
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل في تنفيذ العملية" }).status(401);
  }
};

// *******************************************************************
// ****************** تعديل بيانات الطلبيات ************************

// تعديل بيانات الطلبيات الرئيسية
const UPDATEdataRequests = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
  }
    const Type = req.body.Type;
    const Data = req.body.Data;
    const RequestsID = req.body.RequestsID;
    const user = req.body.user;
    const Imageolddelete = req.body.Imageolddelete;

    const elementUpdate = await SELECTDataAndTaketDonefromTableRequests(
      RequestsID
    );

    const Imageoldindatabese =
      elementUpdate.Image !== null ? JSON.parse(elementUpdate.Image) : [];
    let arrayImage = [...Imageoldindatabese];
    if (Imageoldindatabese.length > 0 && String(Imageolddelete).length > 0) {
      const imageDelete = Imageolddelete ? [Imageolddelete] : [];
      await Promise.all(
        imageDelete.map(async (pic) => {
          arrayImage = arrayImage.filter((item) => item !== pic);
          try {
            await bucket.file(pic).delete();
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
            arrayImage.push(element.filename);
          } catch (error) {
            console.error(`Failed to upload image ${element.filename}:`, error);
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
// تنفيذ الطلبيه او الغاء التنفيذ
const UPDATEImplementRquestsORCansle = async (req, res) => {
  try {
    const user = req.body.user;
    const RequestsID = req.body.RequestsID;
    const DoneOrgin = await SELECTDataAndTaketDonefromTableRequests(RequestsID);
    let Done;
    Done = DoneOrgin.Done === "true" ? "false" : "true";

    await UPDATETableinRequestsDone([Done, user, RequestsID]);
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل في تنفيذ  العملية" }).status(401);
  }
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
};
