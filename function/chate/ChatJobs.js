const { DeleteTableProjectdataforchat } = require("../../sql/delete");
const { insertTableProjectdataforchat } = require("../../sql/INsertteble");
const {
  SELECTTablecompanySubProject,
  SELECTTablecompanySubProjectLast_id,
  SELECTTableProjectdataforchat,
  SELECTTablecompanySubProjectStageCUST,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyonObject,
} = require("../../sql/selected/selectuser");
const { UPDATETableProjectdataforchat } = require("../../sql/update");
const { ClassChatOpration, ClassChatOprationView } = require("./ChatJobsClass");
const time = require("./TIME.JS");

//   عمليات استقبال وارسال ومشاهدة شات المراحل

// عملية ارسال واستقبال لشات المراحل
const ChatOpration = async (Socket, io) => {
  ClassChatOpration(Socket, io);
};
// عملية مشاهدة لرسائل شات المراحل
const ChatOprationView = async (Socket, io) => {
  Socket.on("view_message", async (data) => {
    const result = await ClassChatOprationView(data);
  });
};


// عمليات جلب بيانات المشاريع والمراحل

const BringDataprojectAndStages = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const PhoneNumber = userSession.PhoneNumber;
    const numberData = req.query.numberData;

    if (parseInt(numberData) === 0) {
      // حذف جميع بيانات من داخل جدول جلب قائمة الدردشة
      await DeleteTableProjectdataforchat(PhoneNumber);
      // فلترة المشاريع واستخراجها
      const arrayData = await filterProjectforaddinsertArray(PhoneNumber);
      // ادخال بيانات قائمة الدردشة
      // console.log(arrayData);
      if (arrayData?.length > 0) {
        arrayData?.forEach(async (pic) => {
          await insertTableProjectdataforchat([
            pic?.ProjectID,
            pic.Nameproject,
            PhoneNumber,
          ]);
        });
      }
    }
    // طلب بيانات المشاريع والمراحل
    const ListData = await BringStageforfilterProject(PhoneNumber, numberData);
    // console.log(ListData);
    res.send({ success: "تمت العملية بنجاح", data: ListData }).status(200);
    // جلب بيانات المشاريع
    // جلب بيانات المراحل الخاص بكل مشروع
    // ادخال المراحل في مصفوفة داخل المشروع
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(201);
  }
};
// فلترة بيانات المشاريع حسب المستخدم وضمها داخل مصفوفة
const filterProjectforaddinsertArray = (PhoneNumber) => {
  try {
    return new Promise(async (resolve, reject) => {
      const Datausere = await SELECTTableusersCompanyonObject(PhoneNumber);

      let validity =
        Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];
      let arrayData = [];
      if (Datausere.job !== "Admin") {
        for (let index = 0; index < validity?.length; index++) {
          const element = validity[index];
          if (element.job === "مدير الفرع") {
            const result = await SELECTTablecompanySubProject(
              element.idBrinsh,
              0,
              "forchat"
            );
            result?.map((pic) =>arrayData.push(pic));
          } else {
            for (let index = 0; index < element.project.length; index++) {
              // console.log(validity);
              const elementProject = element.project[index];
              const result = await SELECTTablecompanySubProjectLast_id(
                elementProject.idProject,
                "forchat"
              );
              arrayData.push(result);
            }
          }
        }
        resolve(arrayData);
      } else {
        const result = await SELECTTablecompanySubProject(
          Datausere?.IDCompany,
          0,
          "forchatAdmin"
        );

        resolve(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//  جلب بيانات المراحل حسب المشروع المطلوب للدردشة
const BringStageforfilterProject = (PhoneNumber, numberData) => {
  let ListData = [];

  return new Promise(async (resolve, reject) => {
    const dataPorject = await SELECTTableProjectdataforchat(
      PhoneNumber,
      numberData
    );

    await Promise.all(
      dataPorject?.map(async (pic) => {
        const dataStage = await SELECTTablecompanySubProjectStageCUST(
          pic.ProjectID,
          "all",
          "StageID,StageName"
        );

        ListData.push({
          id:pic.id,
          ProjectID: pic.ProjectID,
          Nameproject: pic.Nameproject,
          arrayStage: dataStage,
        });

        await UPDATETableProjectdataforchat([pic.ProjectID]);
      })
    );

    resolve(ListData);
  });
};
module.exports = {
  ChatOpration,
  ChatOprationView,
  BringDataprojectAndStages,
};
