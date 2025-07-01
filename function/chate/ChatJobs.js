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

//   عمليات استقبال وارسال ومشاهدة شات المراحل

// عملية ارسال واستقبال لشات المراحل
const ChatOpration = async (Socket, io) => {
  ClassChatOpration(Socket, io);
};
// عملية مشاهدة لرسائل شات المراحل
const ChatOprationView = async (Socket, io) => {
  Socket.on("view_message", async (data) => {
    await ClassChatOprationView(data);
  });
};

// عمليات جلب بيانات المشاريع والمراحل

const BringDataprojectAndStages = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const PhoneNumber = userSession.PhoneNumber;
      const numberData = req.query.numberData;

      const arrayData = await filterProjectforaddinsertArray(
        PhoneNumber,
        parseInt(numberData)
      );
      // طلب بيانات المشاريع والمراحل
      const ListData = await BringStageforfilterProject(arrayData);
      res.send({ success: "تمت العملية بنجاح", data: ListData }).status(200);
      // جلب بيانات المشاريع
      // جلب بيانات المراحل الخاص بكل مشروع
      // ادخال المراحل في مصفوفة داخل المشروع
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(201);
    }
  };
};
// فلترة بيانات المشاريع حسب المستخدم وضمها داخل مصفوفة
const filterProjectforaddinsertArray = (PhoneNumber, IDfinlty = 0) => {
  try {
    return new Promise(async (resolve, reject) => {
      const Datausere = await SELECTTableusersCompanyonObject(PhoneNumber);
      let result = [];

      let validity =
        Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];
      if (Datausere.job !== "Admin") {
        await Promise.all(
          validity.map(async (element) => {
            const where = element.project
              .map((items) => items.idProject)
              .reduce((item, r) => `${String(item) + " , " + r}`);
            const typeproject = `AND ca.id IN (${where})`;
            result = await SELECTTablecompanySubProject(
              element.idBrinsh,
              IDfinlty,
              "forchatAdmin",
              "true",
              typeproject,
              "LIMIT 10"
            );
          })
        );
      } else {
        result = await SELECTTablecompanySubProject(
          Datausere?.IDCompany,
          IDfinlty,
          "forchatAdmin",
          "true",
          "",
          "LIMIT 10"
        );
      }
      resolve(result);
    });
  } catch (error) {
    console.log(error);
  }
};

//  جلب بيانات المراحل حسب المشروع المطلوب للدردشة
const BringStageforfilterProject = (dataPorject) => {
  let ListData = [];

  return new Promise(async (resolve, reject) => {
    await Promise.all(
      dataPorject?.map(async (pic) => {
        const dataStage = await SELECTTablecompanySubProjectStageCUST(
          pic.ProjectID,
          "all",
          "StageID,StageName"
        );

        ListData.push({
          id: pic.ProjectID,
          ProjectID: pic.ProjectID,
          Nameproject: pic.Nameproject,
          arrayStage: dataStage,
        });
        // await DeleteTableProjectdataforchat(pic.id ,"id=?");
      })
    );

    resolve(ListData);
  });
};

module.exports = {
  ChatOpration,
  ChatOprationView,
  BringDataprojectAndStages,
  filterProjectforaddinsertArray,
  BringStageforfilterProject,
};
