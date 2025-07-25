const {
  insertTablecompanySubProject,
  insertTablecompanySubProjectStagetemplet,
  insertTablecompanySubProjectStageSubtemplet,
  insertTablecompanySubProjectStageCUST,
  insertTablecompanySubProjectStagesSub,
  insertTablecompanySubProjectStageNotes,
  insertTablecompanySubProjectexpense,
  insertTablecompanySubProjectREVENUE,
  insertTablecompanySubProjectReturned,
  insertTablecompanySubProjectarchivesFolder,
  insertTablecompanySubProjectarchivesFolderforcreatproject,
  insertTablecompanySubProjectRequestsForcreatOrder,
  insertTablecompanySubProjectv2,
} = require("../../sql/INsertteble");
const {
  SELECTTablecompanySubProjectarchivesotherroad,
  SELECTTablecompanySubProjectLast_id,
  SELECTTablecompanySubProjectStageCUSTAccordingEndDateandStageIDandStartDate,
  SELECTTablecompanySubProjectStageCUST,
  SELECTTablecompanySubProjectStagesSub,
  SELECTTablecompanySubProjectStagesSubSingl,
  SELECTTablecompanySubProjectStageCUSTONe,
  SELECTTablecompanySubProjectexpenseObjectOne,
} = require("../../sql/selected/selected");
const { uploaddata, bucket } = require("../../bucketClooud");

const {
  UPDATETablecompanySubProjectStagesSub,
  UPDATEStopeProjectStageCUST,
  UPDATETablecompanySubProjectarchivesFolderinChildern,
} = require("../../sql/update");

const {
  PercentagecalculationforSTage,
  BringCountUserinProject,
} = require("../companyselect/bringProject");
const {
  Projectinsert,
  Delayinsert,
  Stageinsert,
  StageSubinsert,
  AchievmentStageSubNote,
  CloseOROpenStagenotifcation,
  Financeinsertnotification,
} = require("../notifcation/NotifcationProject");
const { deleteFileSingle } = require("../../middleware/Fsfile");
const { UpdaterateCost, UpdaterateStage } = require("./UpdateProject");
const { StageTempletXsl,Stage, AccountDays } = require("../../middleware/Aid");
const xlsx = require("xlsx");
const OpreationProjectInsertv2 = async (
  IDcompanySub,
  Nameproject,
  Note,
  TypeOFContract,
  GuardNumber,
  LocationProject,
  numberBuilding,
  Referencenumber,
  Contractsigningdate
) => {
  try {
    await insertTablecompanySubProjectv2([
      IDcompanySub,
      Nameproject,
      Note,
      TypeOFContract,
      GuardNumber,
      LocationProject,
      numberBuilding,
      Referencenumber,
    ]);
    console.log(TypeOFContract);
    const idProject = await SELECTTablecompanySubProjectLast_id(IDcompanySub);
    if(TypeOFContract !== "حر"){
    let dataStages = await StageTempletXsl(TypeOFContract);
    const visity = await StageTempletXsl("NULL");
    // console.log(visity);
    let table = [];
    let tablesub = [];
    dataStages = [visity[0], ...dataStages];
    for (let index = 0; index < dataStages.length; index++) {
      const element = dataStages[index];
      let Days = await AccountDays(numberBuilding, element.Days);

      table.push({
        ...element,
        Days: Math.round(Days),
        ProjectID: idProject["last_id"],
        StartDate: null,
        EndDate: null,
        CloseDate: null,
      });

      const resultSubTablet = await StageSubTempletXlsx(element.StageID);
      resultSubTablet.forEach((pic) => {
        tablesub.push({
          StageID: pic.StageID,
          ProjectID: idProject["last_id"],
          StageSubName: pic.StageSubName,
        });
      });
    }
    await Stage(table, Contractsigningdate);
    await StageSub(tablesub);
  }
    await AddFoldersStatcforprojectinsectionArchive(idProject["last_id"]);
  } catch (error) {
    console.log(error);
  }
};
const projectBrinshv2 = (uploadQueue) => {
  return async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    try {
      const {
        IDcompanySub,
        Nameproject,
        Note,
        TypeOFContract,
        GuardNumber,
        LocationProject,
        numberBuilding,
        Referencenumber,
      } = req.body;
      const Contractsigningdate = new Date();
      if (Boolean(Nameproject)) {
        const locationsstring = String(LocationProject).startsWith("https")
          ? LocationProject
          : null;
        await OpreationProjectInsertv2(
          IDcompanySub,
          Nameproject,
          Note,
          TypeOFContract,
          GuardNumber,
          locationsstring,
          numberBuilding,
          Referencenumber,
          Contractsigningdate
        );
        res
          .send({
            success: "تم انشاء مشروع بنجاح",
          })
          .status(200);
        await Projectinsert(IDcompanySub, userSession.userName);
      } else {
        res
          .send({
            success: "يجب اضافة اسم للمشروع ",
          })
          .status(200);
      }
    } catch (err) {
      console.log(err);
      res
        .send({
          success: "فشل تنفيذ العملية",
        })
        .status(401);
    }
  };
};
const OpreationProjectInsert = async (
  IDcompanySub,
  Nameproject,
  Note,
  TypeOFContract,
  GuardNumber,
  LocationProject,
  numberBuilding,
  Contractsigningdate
) => {
  try {
    await insertTablecompanySubProject([
      IDcompanySub,
      Nameproject,
      Note,
      TypeOFContract,
      GuardNumber,
      LocationProject,
      numberBuilding,
    ]);

    if(TypeOFContract !== "حر"){
      const idProject = await SELECTTablecompanySubProjectLast_id(IDcompanySub);
      let dataStages = await StageTempletXsl(TypeOFContract);
      const visity = await StageTempletXsl("NULL");
      let table = [];
      let tablesub = [];
      dataStages = [visity[0], ...dataStages];
      for (let index = 0; index < dataStages.length; index++) {
        const element = dataStages[index];
        let Days = await AccountDays(numberBuilding, element.Days);
  
        table.push({
          ...element,
          Days: Math.round(Days),
          ProjectID: idProject["last_id"],
          StartDate: null,
          EndDate: null,
          CloseDate: null,
        });
  
        const resultSubTablet = await StageSubTempletXlsx(element.StageID);
        resultSubTablet.forEach((pic) => {
          tablesub.push({
            StageID: pic.StageID,
            ProjectID: idProject["last_id"],
            StageSubName: pic.StageSubName,
          });
        });
      }
      await Stage(table, Contractsigningdate);
      await StageSub(tablesub);
    }



    await AddFoldersStatcforprojectinsectionArchive(idProject["last_id"]);
  } catch (error) {
    console.log(error);
  }
};
const projectBrinsh = (uploadQueue) => {
  //
  return async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    try {
      const {
        IDcompanySub,
        Nameproject,
        Note,
        TypeOFContract,
        GuardNumber,
        LocationProject,
        numberBuilding,
      } = req.body;
      const Contractsigningdate = new Date();
      if (Boolean(Nameproject)) {
        await OpreationProjectInsert(
          IDcompanySub,
          Nameproject,
          Note,
          TypeOFContract,
          GuardNumber,
          LocationProject,
          numberBuilding,
          Contractsigningdate
        );
        res.status(200).send({
          success: "تم انشاء مشروع بنجاح",
        });
        await Projectinsert(IDcompanySub, userSession.userName);
      } else {
        res.status(200).send({
          success: "يجب اضافة اسم للمشروع ",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({
        success: "فشل تنفيذ العملية",
      });
    }
  };
};

const StageSubTempletXlsx = async (StageID) => {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile("StagesSubTempletEXcel.xlsx");

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Get the data from the sheet
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data.filter((item) => item.StageID === StageID);
  } catch (error) {
    console.error(error);
  }
};

// وظيفة انشاء ملفات ثابته للمشروع في قسم الارشيف
const AddFoldersStatcforprojectinsectionArchive = (idproject) => {
  try {
    const arrayfolder = [
      {
        name: "العقود والضمانات",
        ActivationHome: "false",
        Activationchildren: "true",
      },
      {
        name: "الفواتير والسندات",
        ActivationHome: "false",
        Activationchildren: "false",
      },
      {
        name: "المخططات",
        ActivationHome: "false",
        Activationchildren: "true",
      },
      {
        name: "المراحل",
        ActivationHome: "false",
        Activationchildren: "false",
      },
      {
        name: "العهد",
        ActivationHome: "false",
        Activationchildren: "false",
      },
      {
        name: "المرتجعات",
        ActivationHome: "false",
        Activationchildren: "false",
      },
    ];
    arrayfolder.forEach(async (pic) => {
      await insertTablecompanySubProjectarchivesFolderforcreatproject([
        idproject,
        pic.name,
        pic.ActivationHome,
        pic.Activationchildren,
      ]);
    });
  } catch (error) {
    console.log(error);
  }
};




// وظيفة ادخال البيانات في جدوول المراحل السنبل الرئيسي
const StageTemplet = (uploadQueue) => {
  return async (req, res) => {
    try {
      // const Type = req.body.Type;
      // const StageName = req.body.StageName;
      // const OrderBy = req.body.OrderBy;
      // const Days = req.body.Days;
      // const Difference = req.body.Difference;
      const teble = req.body.teble;
      for (let index = 0; index < teble.length; index++) {
        const item = teble[index];
        // console.log(item);
        await insertTablecompanySubProjectStagetemplet([
          item.id,
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
        .status(401);
    }
  };
};

// وظيف ادخال بييانات المراحلة الفرعية السنبل
const StageSubTemplet = (uploadQueue) => {
  return async (req, res) => {
    try {
      const teble = req.body.teble;
      for (let index = 0; index < teble.length; index++) {
        const item = teble[index];
        // console.log(item);
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
        .status(401);
    }
  };
};

// وظيفة ادخال البيانات في جدوول المراحل  الرئيسي


// وظيف ادخال بييانات المراحلة الفرعية
const StageSub = async (teble) => {
  try {
    for (let index = 0; index < teble.length; index++) {
      const item = teble[index];

      await insertTablecompanySubProjectStagesSub([
        item.StageID,
        item.ProjectID,
        item.StageSubName,
      ]);
    }
  } catch (err) {
    console.log(err);
  }
};
//

// إضافة مرحلة جديدة إلى المشروع
const InsertStage = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const StageName = req.body.StageName;
      const ProjectID = req.body.ProjectID;
      const TypeOFContract = req.body.TypeOFContract;
      const Days = req.body.Days;
      if (ProjectID > 0 && Boolean(StageName)) {
        const findName = await SELECTTablecompanySubProjectStageCUST(
          ProjectID,
          StageName
        );
        let Daye = Boolean(Days) ? Days : 0;
        // console.log(findName);
        if (findName.length <= 0) {
          const result =
            await SELECTTablecompanySubProjectStageCUSTAccordingEndDateandStageIDandStartDate(
              ProjectID
            );
          // console.log(result);

          let StartDate;
          let EndDate;
          let OrderBy;
          Time = new Date(result.EndDate);
          StartDate = Time.toDateString();
          const dataend = new Date(Time.setDate(Time.getDate() + Daye));
          EndDate = dataend.toDateString();
          OrderBy = result.OrderBy === null ? 1 : parseInt(result.OrderBy) + 1;
          // console.log(result);

          await insertTablecompanySubProjectStageCUST([
            result.StageID + 1,
            ProjectID,
            TypeOFContract,
            `${StageName} ${OrderBy}`,
            Daye,
            StartDate,
            EndDate,
            OrderBy,
          ]);

          res.send({ success: "تمت العملية بنجاح" }).status(200);
          await UpdaterateCost(ProjectID);
          await Stageinsert(ProjectID, 0, userSession.userName);
        } else {
          res.send({ success: "اسم المرحلة موجود بالفعل" }).status(200);
        }
      } else {
        res.send({ success: "يجب ادخال اسم للمرحلة الجديدة" }).status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: " فشل العملية" }).status(401);
    }
  };
};

//  إضافة مرحلة فرعية جديدة

const insertStageSub = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const StageID = req.body.StageID;
      const ProjectID = req.body.ProjectID;
      const StageSubName = req.body.StageSubName;
      if (Boolean(StageSubName)) {
        const VerifyName = await SELECTTablecompanySubProjectStagesSub(
          ProjectID,
          StageID,
          StageSubName
        );
        // console.log(VerifyName);
        if (VerifyName.length <= 0) {
          await insertTablecompanySubProjectStagesSub([
            StageID,
            ProjectID,
            StageSubName,
          ]);
          res.send({ success: "تمت العملية بنجاح" }).status(200);
          await UpdaterateCost(ProjectID);
          await UpdaterateStage(ProjectID, StageID)
          await StageSubinsert(ProjectID, StageID, userSession.userName);
        } else {
          res.send({ success: "اسم الخطوة موجود بالفعل" }).status(200);
        }
      } else {
        res.send({ success: "يرجى ادخال اسم الخطوة" }).status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: false }).status(401);
    }
  };
};
// وظيفة ادخال ملاحظات المرحلة الرئيسية
const NotesStage = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      if (req.file) {
        await uploaddata(req.file);
        deleteFileSingle(req.file.filename, "upload");
      }
      const StagHOMID = req.body.StagHOMID;
      const ProjectID = req.body.ProjectID;
      const Type = req.body.Type;
      const Note = req.body.Note;
      const RecordedBy = req.body.RecordedBy;
      const countdayDelay = req.body.countdayDelay;
      const ImageAttachment = req.file ? req.file?.filename : null;
      if (Boolean(Type) && Boolean(Note)) {
        await insertTablecompanySubProjectStageNotes([
          StagHOMID,
          ProjectID,
          Type,
          Note,
          RecordedBy,
          countdayDelay,
          ImageAttachment,
        ]);

        res.send({ success: "تمت العملية بنجاح" }).status(200);
        await Delayinsert(ProjectID, StagHOMID, userSession.userName);
      } else {
        res.send({ success: "يرجى اكمال البيانات" }).status(200);
      }
    } catch (err) {
      console.log(err);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

// وظيفة تجمع بين اضافة وتعديل ملاحظات فرعية
const NotesStageSub = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const StageSubID = req.body.StageSubID;
      const Note = req.body.Note;
      const userName = userSession.userName;
      const PhoneNumber = userSession.PhoneNumber;
      const type = req.body.type;
      let NoteArry;
      let kind;
      if (
        (Note !== "null" && type === "AddNote") ||
        type === "DeletNote" ||
        type === "EditNote"
      ) {
        const bringData = await SELECTTablecompanySubProjectStagesSubSingl(
          StageSubID
        );

        if (type === "AddNote") {
          NoteArry = await AddNote(
            Note,
            userName,
            PhoneNumber,
            bringData,
            req.files
          );
          kind = "Note";
        } else if (type === "EditNote") {
          const idNote = req.body.idNote;
          const Imageolddelete = req.body.Imageolddelete;
          NoteArry = await EditNote(
            idNote,
            Note,
            userName,
            PhoneNumber,
            bringData,
            Imageolddelete,
            req.files
          );
          kind = "Note";
        } else if (type === "DeletNote") {
          const idNote = req.body.idNote;
          const dataNote = JSON.parse(bringData.Note);
          NoteArry = dataNote.filter(
            (item) => parseInt(item.id) !== parseInt(idNote)
          );
          kind = "Note";
        }
        if (NoteArry !== undefined) {
          await UPDATETablecompanySubProjectStagesSub(
            [JSON.stringify(NoteArry), StageSubID],
            kind
          );
        }
        res.send({ success: "تمت العملية بنجاح" }).status(200);

        // await StageSubNote(
        //   bringData.ProjectID,
        //   bringData.StagHOMID,
        //   StageSubID,
        //   Note,
        //   userSession.userName,
        //   type === "AddNote" ? "اضاف" : "تعديل"
        // );
      } else {
        res.send({ success: "يجب اكمال البيانات" }).status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(401);
    }
  };
};

// وظيفة ادخال ملاحظات المرحلة الفرعية
const AddNote = async (Note, userName, PhoneNumber, bringData, files) => {
  try {
    let arrayImage = [];
    if (files && files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        await uploaddata(element);
        deleteFileSingle(element.filename, "upload");

        arrayImage.push(element.filename);
      }
    } else {
      arrayImage = null;
    }

    let NoteArry;
    const data = {
      id: Math.floor(1000 + Math.random() * 9000),
      Note: Note,
      userName: userName,
      PhoneNumber: PhoneNumber,
      Date: new Date().toDateString(),
      File: arrayImage,
    };

    if (bringData.Note !== null) {
      NoteArry = JSON.parse(bringData.Note);
      NoteArry?.push(data);
    } else {
      NoteArry = [data];
    }
    return NoteArry;
  } catch (error) {
    console.log(error);
  }
};
// وظيفة تعديل ملاحظات المرحلة الفرعية
const EditNote = async (
  id,
  Note,
  userName,
  PhoneNumber,
  bringData,
  Imageolddelete,
  files
) => {
  try {
    const dataNote = JSON.parse(bringData.Note) || [];
    let newDtat = [...dataNote];
    // console.log(dataNote);
    const findNote = newDtat.find((item) => parseInt(item.id) === parseInt(id));
    if (findNote) {
      let arrayImage = findNote?.File !== null ? [...findNote?.File] : [];

      if (arrayImage.length > 0 && String(Imageolddelete).length > 0) {
        const imageDelete = Imageolddelete ? Imageolddelete.split(",") : [];

        await Promise.all(
          imageDelete.map(async (pic) => {
            arrayImage = arrayImage.filter((items) => items !== pic);
            try {
              const findimat = await bucket.file(pic).exists();
              if (findimat[0]) {
                await bucket.file(pic).delete();
              }
            } catch (error) {
              console.log(error);
            }
          })
        );
      }
      if (files && files.length > 0) {
        for (let index = 0; index < files.length; index++) {
          const element = files[index];
          await uploaddata(element);
          deleteFileSingle(element.filename, "upload");

          arrayImage.push(element.filename);
        }
      }

      // console.log(findNote, "arrays", Imageolddelete);

      const data = {
        id: id,
        Note: Note,
        userName: userName,
        PhoneNumber: PhoneNumber,
        Date: new Date().toDateString(),
        File: arrayImage,
      };

      const findIndex = newDtat.findIndex(
        (item) => parseInt(item.id) === parseInt(id)
      );

      if (findIndex > -1) {
        newDtat[findIndex] = data;
      }
    }

    return newDtat;
  } catch (error) {
    console.log(error);
  }
};
// AddORCanselAchievmentarrayall

// وظيفة تقوم باضافة الانجازات او إلغائها



// استيراد النسبئة المئوية للمشروع

const AddORCanselAchievment = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const StageSubID = req.body.StageSubID;
      const userName = userSession.userName;
      const PhoneNumber = userSession.PhoneNumber;
      const bringData = await SELECTTablecompanySubProjectStagesSubSingl(
        StageSubID
      );
      await opreationAddAchivevment(
        StageSubID,
        userName,
        PhoneNumber,
        bringData
      );
      res.send({ success: "تمت العملية بنجاح" }).status(200);
      await UpdaterateCost(bringData?.ProjectID);
      await UpdaterateStage(bringData?.ProjectID,bringData?.StagHOMID)
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
      return;
    }
  };
};

// const cansles = [1,2,3,4];
// const arrays =[1,4,5,3];
// console.log(cansles.filter(item => !arrays.includes(item)))
const AddORCanselAchievmentarrayall = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const selectAllarray = req.body.selectAllarray;
      const selectAllarraycansle = req.body.selectAllarraycansle;

      const userName = userSession.userName;
      const PhoneNumber = userSession.PhoneNumber;
      const arraycansle = selectAllarraycansle?.filter(
        (item) => !selectAllarray.includes(item)
      );
      for (const element of arraycansle) {
        const bringData = await SELECTTablecompanySubProjectStagesSubSingl(
          element
        );
        await opreationAddAchivevment(
          element,
          userName,
          PhoneNumber,
          bringData
        );
      }
      for (const element of selectAllarray) {
        const bringData = await SELECTTablecompanySubProjectStagesSubSingl(
          element
        );
        await opreationAddAchivevment(
          element,
          userName,
          PhoneNumber,
          bringData,
          "alladd"
        );
      }
      res.send({ success: "تمت العملية بنجاح" }).status(200);
      const bringData = await SELECTTablecompanySubProjectStagesSubSingl(
        selectAllarray[0]
      );
      await UpdaterateCost(bringData?.ProjectID);
      await UpdaterateStage(bringData?.ProjectID,bringData?.StagHOMID);
    } catch (error) {
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

const opreationAddAchivevment = async (
  StageSubID,
  userName,
  PhoneNumber,
  bringData,
  type = "single"
) => {
  try {
    let data = {
      id: Math.floor(1000 + Math.random() * 9000),
      userName: userName,
      PhoneNumber: PhoneNumber,
      Date: new Date().toDateString(),
    };

    if (type === "single") {
      await opreationpartoneAchivement(data, bringData, StageSubID, userName);
    } else {
      if (type === "alladd" && bringData.Done === "true") return;
      await opreationpartoneAchivement(data, bringData, StageSubID, userName);
    }
  } catch (error) {
    console.log(error);
  }
};

const opreationpartoneAchivement = async (
  data,
  bringData,
  StageSubID,
  userName
) => {
  let Done;
  let CloseDate;
  let Operations = [];
  let types;
  if (bringData?.Done === "true") {
    types = "إلغاء الانجاز";
    data = {
      ...data,
      type: types,
    };
    Done = "false";
    CloseDate = null;
  } else {
    (types = "تم الانجاز"),
      (data = {
        ...data,
        type: types,
      });
    Done = "true";
    CloseDate = new Date().toDateString();
  }

  Operations =
    bringData.closingoperations !== null
      ? JSON.parse(bringData.closingoperations)
      : [];
  Operations.push(data);
  await UPDATETablecompanySubProjectStagesSub(
    [JSON.stringify(Operations), CloseDate, Done, StageSubID],
    "Closingoperations"
  );
  await AchievmentStageSubNote(
    StageSubID,
    userName,
    types === "تم الانجاز" ? "إنجاز" : types
  );
};

//  إغلاق او التراجع عن اغلاق  المراحل
const ClassCloaseOROpenStage = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const StageID = req.body.StageID;
      const ProjectID = req.body.ProjectID;
      const Note = req.body.Note;
      const RecordedBy = req.body.RecordedBy;
      const bringData = await SELECTTablecompanySubProjectStageCUSTONe(
        ProjectID,
        StageID
      );
      let masseges = "تمت العملية بنجاح";
      if (bringData.Done === "false") {
        const result = await CloaseOROpenStage(
          Note,
          RecordedBy,
          StageID,
          ProjectID
        );
        if (result !== "true") {
          masseges = result;
        }
      } else {
        // console.log(bringData.Done, "hhhh");
        await UPDATEStopeProjectStageCUST(
          [null, null, "false", Note, RecordedBy, StageID, ProjectID],
          "Opean"
        );
      }
      await CloseOROpenStagenotifcation(
        ProjectID,
        StageID,
        userSession.userName,
        bringData.Done === "false" ? "اغلاق" : "فتح"
      );
      res.send({ success: masseges }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};
//  حساب فارق الايام والتاخيرات
const CloaseOROpenStage = async (Note, RecordedBy, StageID, ProjectID) => {
  try {
    const rate = await PercentagecalculationforSTage(StageID, ProjectID);
    // console.log(rate, "rate", StageID, ProjectID);

    if (rate === 100) {
      const dataStage = await SELECTTablecompanySubProjectStageCUSTONe(
        ProjectID,
        StageID
      );

      const date1 = new Date();
      const date2 = new Date(dataStage.EndDate);

      const diffInMs = date2.getTime() - date1.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 3600 * 24));
      await UPDATEStopeProjectStageCUST([
        date1.toDateString(),
        diffInDays,
        "true",
        Note,
        RecordedBy,
        StageID,
        ProjectID,
      ]);
      return "true";
    } else {
      return "لايمكن اغلاق المشروع قبل انهاء الانجاز";
    }
  } catch (error) {
    console.log(error);
  }
};
// ادخال بيانات المصروفات
const ExpenseInsert = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const projectID = req.body.projectID;
      const Amount = req.body.Amount;
      const Data = req.body.Data;
      const ClassificationName = req.body.ClassificationName;
      const Taxable = 15;

      if (Boolean(Amount) && Boolean(Data)) {
        const totaldataproject =
          await SELECTTablecompanySubProjectexpenseObjectOne(
            projectID,
            "count"
          );
        const InvoiceNo = totaldataproject?.InvoiceNo + 1;
        console.log(InvoiceNo, "InvoiceNo");
        let arrayImage = [];
        if (req.files && req.files.length > 0) {
          for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            await uploaddata(element);
            deleteFileSingle(element.filename, "upload");

            arrayImage.push(element.filename);
          }
        } else {
          arrayImage = null;
        }
        // console.log(arrayImage);
        await insertTablecompanySubProjectexpense([
          projectID,
          Amount,
          Data,
          ClassificationName,
          arrayImage !== null ? JSON.stringify(arrayImage) : null,
          InvoiceNo,
          Taxable,
        ]);
        res.send({ success: "تمت العملية بنجاح" }).status(200);
        await Financeinsertnotification(
          projectID,
          "مصروفات",
          "إضافة",
          userSession.userName
        );
      } else {
        res.send({ success: "يجب اكمال البيانات" }).status(200);
      }
      await UpdaterateCost(projectID, "cost");
    } catch (err) {
      console.log(err);
      res.send({ success: "فشل تنفيذ العملية" }).status(401);
    }
  };
};

// ادخال بييانات العهد
const RevenuesInsert = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const projectID = req.body.projectID;
      const Amount = req.body.Amount;
      const Data = req.body.Data;
      const Bank = req.body.Bank;
      let arrayImage = [];
      if (Boolean(Amount) && Boolean(Data)) {
        if (req.files && req.files.length > 0) {
          for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            await uploaddata(element);
            deleteFileSingle(element.filename, "upload");

            arrayImage.push(element.filename);
          }
        } else {
          arrayImage = null;
        }
        await insertTablecompanySubProjectREVENUE([
          projectID,
          Amount,
          Data,
          Bank,
          arrayImage !== null ? JSON.stringify(arrayImage) : null,
        ]);
        res.send({ success: "تمت العملية بنجاح" }).status(200);
        await Financeinsertnotification(
          projectID,
          "عهد",
          "إضافة",
          userSession.userName
        );
      } else {
        res.send({ success: "يحب اكمال البيانات" }).status(200);
      }
      await UpdaterateCost(projectID, "cost");
    } catch (err) {
      console.log(err);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

// ادخال بيانات المرتجع
const ReturnsInsert = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const projectID = req.body.projectID;
      const Amount = req.body.Amount;
      const Data = req.body.Data;
      let arrayImage = [];
      if (Boolean(Amount) && Boolean(Data)) {
        if (req.files && req.files.length > 0) {
          for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            await uploaddata(element);
            deleteFileSingle(element.filename, "upload");

            arrayImage.push(element.filename);
          }
        } else {
          arrayImage = null;
        }
        await insertTablecompanySubProjectReturned([
          projectID,
          Amount,
          Data,
          arrayImage !== null ? JSON.stringify(arrayImage) : null,
        ]);

        res.send({ success: "تمت العملية بنجاح" }).status(200);
        await Financeinsertnotification(
          projectID,
          "مرتجعات",
          "إضافة",
          userSession.userName
        );
      } else {
        res.send({ success: "يجب اكمال البيانات" }).status(200);
      }
      await UpdaterateCost(projectID, "cost");
    } catch (err) {
      console.log(err);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

// ************************************************************************************************
// *********************************                  *********************************************
// ********************************* وظـــائف الإرشيف *********************************************

// اضافة مجلد جديد في ارشيف ملف المشروع

const AddFolderArchivesnew = (uploadQueue) => {
  return async (req, res) => {
    try {
      const ProjectID = req.body.ProjectID;
      const FolderName = req.body.FolderName;
      if (Boolean(FolderName)) {
        await insertTablecompanySubProjectarchivesFolder([
          ProjectID,
          FolderName,
        ]);
        res.send({ success: "تمت العملية بنجاح" }).status(200);
      } else {
        res.send({ success: "يجب ادخال اسم المجلد" }).status(200);
      }
    } catch (err) {
      console.log(err);
      res.send({ success: "فشل في تنفيذ العملية " }).status(400);
    }
  };
};

//  إضافة ملف فرعي داخل الملف الرئيسي
const AddfileinFolderHomeinArchive = (uploadQueue) => {
  return async (req, res) => {
    try {
      const ArchivesID = req.body.ArchivesID;
      const idsub = req.body.id;
      let type = req.body.type;
      let name;
      let size = 0;
      if (type === "folder") {
        name = req.body.name;
      } else {
        await uploaddata(req.file);
        name = req.file?.filename;
        type = req.file?.mimetype;
        size = req.file?.size;
      }
      if (Boolean(name)) {
        const children = await SELECTTablecompanySubProjectarchivesotherroad(
          ArchivesID
        );
        let Children =
          children.children !== null ? JSON.parse(children.children) : [];

        const childrenNew = await handlerOpreation(
          name,
          type,
          size,
          Children,
          idsub,
          ArchivesID
        );
        await UPDATETablecompanySubProjectarchivesFolderinChildern([
          JSON.stringify(childrenNew),
          ArchivesID,
        ]);
        res.send({ success: "تمت العملية بنجاح" }).status(200);
      } else {
        res.send({ success: "يجب ادخال اسم الملف" }).status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(401);
    }
  };
};

const handlerOpreation = async (
  name,
  type,
  size,
  children,
  idsub,
  ArchivesID
) => {
  try {
    return new Promise(async (resolve, reject) => {
      let value;
      if (type === "folder") {
        value = {
          id: Math.floor(100000 + Math.random() * 900000),
          name: name,
          type: type,
          children: [],
        };
      } else {
        value = {
          id: Math.floor(100000 + Math.random() * 900000),
          Date: new Date().toISOString(),
          name: name,
          type: type,
          size: size,
        };
      }

      if (idsub === ArchivesID) {
        children.push(value);
        resolve(children);
      } else {
        if (children.length > 0) {
          let childrenNew;
          childrenNew = await CreatChild(value, children, idsub);
          if (!childrenNew) {
            children.forEach(async (pic) => {
              if (pic.children) {
                childrenNew = await CreatChild(value, pic.children, idsub);
              }
            });
          }
          if (childrenNew) {
            // console.log(childrenNew);
            resolve(childrenNew);
          } else {
            // children.push(value);
            resolve(children);
          }
        } else {
          children.push(value);
          resolve(children);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const CreatChild = (updates, children, idsub) => {
  return new Promise(async (resolve, reject) => {
    try {
      const folder = children?.find(
        (folder) => parseInt(folder.id) === parseInt(idsub)
      );
      if (folder) {
        folder?.children?.push(updates);
        resolve(children);
      } else {
        const promises = [];
        children.forEach((child) => {
          if (child.children) {
            promises.push(CreatChild(updates, child.children, idsub));
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
    } catch (error) {
      console.log(error);
    }
  });
};

// ******************************************************************
// ********************* الطلبيات **********************************

const InsertDatainTableRequests = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const ProjectID = req.body.ProjectID;
      const Type = req.body.Type;
      const Data = req.body.Data;
      const user = req.body.user;
      let arrayImage = [];
      if (Type !== "تصنيف الإضافة" && Boolean(Type) && Boolean(Data)) {
        if (req.files && req.files.length > 0) {
          for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            await uploaddata(element);
            arrayImage.push(element.filename);
          }
        } else {
          arrayImage = null;
        }
        await insertTablecompanySubProjectRequestsForcreatOrder([
          ProjectID,
          Type,
          Data,
          user,
          arrayImage !== null ? JSON.stringify(arrayImage) : null,
          `${new Date()}`,
        ]);
        res.send({ success: "تمت العملية بنجاح" }).status(200);
        await Financeinsertnotification(
          ProjectID,
          "طلب",
          "إضافة",
          userSession.userName
        );
      } else {
        res.send({ success: "يجب ادخال التصنيف" }).status(401);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل في تنفيذ العملية" }).status(401);
    }
  };
};

//  updatechild folder
module.exports = {
  projectBrinsh,
  StageTemplet,
  StageSubTemplet,
  StageSub,
  NotesStage,
  NotesStageSub,
  ExpenseInsert,
  RevenuesInsert,
  ReturnsInsert,
  AddFolderArchivesnew,
  AddfileinFolderHomeinArchive,
  InsertStage,
  insertStageSub,
  AddORCanselAchievment,
  ClassCloaseOROpenStage,
  InsertDatainTableRequests,

  OpreationProjectInsert,
  OpreationProjectInsertv2,
  projectBrinshv2,
  AddORCanselAchievmentarrayall,
};
