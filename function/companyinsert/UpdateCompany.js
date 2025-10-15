const {
  DeleteTableFinancialCustody,
  DeleteTablecompanySubProjectall,
} = require("../../sql/delete");
const {
  insertTableuserComppany,
  insertTablecompany,
  insertTableBranchdeletionRequests,
} = require("../../sql/INsertteble");
const {
  SELECTTablecompanyName,
  SELECTTablecompanyRegistration,
  SelectVerifycompanyexistencePhonenumber,
  SelectVerifycompanyexistence,
  SELECTTableBranchdeletionRequests,
  SELECTTABLEcompanyProjectall,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyVerification,
} = require("../../sql/selected/selectuser");

const {
  UpdateTablecompanySub,
  UpdateTablecompany,
  UPDATETableFinancialCustody,
  UpdateTableinnuberOfcurrentBranchescompany,
  UpdateTablecompanyRegistration,
} = require("../../sql/update");
const { CovenantNotfication } = require("../notifcation/NotifcationProject");
const bcrypt = require("bcrypt");
const { opreationDeletProject } = require("./UpdateProject");
const { verificationSend } = require("../companyselect/userCompanyselect");
const {
  convertArabicToEnglish,
  verificationfromdata,
  Addusertraffic,
} = require("../../middleware/Aid");

const UpdateDataCompany = () => {
  return async (req, res) => {
    const {
      NameCompany,
      BuildingNumber,
      StreetName,
      NeighborhoodName,
      PostalCode,
      City,
      Country,
      TaxNumber,
      Cost,
      id,
    } = req.body;
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
    }
    Addusertraffic(userSession.userName, userSession?.PhoneNumber, "UpdateDataCompany");
    // console.log(req.body);
    if (
      await verificationfromdata([
        NameCompany,
        BuildingNumber,
        StreetName,
        NeighborhoodName,
        PostalCode,
        City,
        Country,
        TaxNumber,
      ])
    ) {
      let CommercialRegistrationNumber = req.body?.CommercialRegistrationNumber;
      if (
        CommercialRegistrationNumber === undefined ||
        CommercialRegistrationNumber === null
      ) {
        await UpdateTablecompany([
          NameCompany,
          convertArabicToEnglish(BuildingNumber),
          StreetName,
          NeighborhoodName,
          convertArabicToEnglish(PostalCode),
          City,
          Country,
          convertArabicToEnglish(TaxNumber),
          convertArabicToEnglish(Cost),
          id,
        ]);
      } else {
        await UpdateTablecompany(
          [
            NameCompany,
            convertArabicToEnglish(BuildingNumber),
            StreetName,
            NeighborhoodName,
            convertArabicToEnglish(PostalCode),
            City,
            Country,
            convertArabicToEnglish(TaxNumber),
            convertArabicToEnglish(Cost),
            convertArabicToEnglish(CommercialRegistrationNumber),
            id,
          ],
          ",CommercialRegistrationNumber=?"
        );
      }
      res
        .send({
          success: "تمت العملية بنجاح",
        })
        .status(200);
    } else {
      res
        .send({
          success: "هناك نقص في البيانات المدخلة",
        })
        .status(400);
    }
  };
  // console.log(tableCompany);
};

const UpdateApiCompany = () => {
  return async (req, res) => {
    const id = req.query.id;
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
    }
    Addusertraffic(userSession.userName, userSession?.PhoneNumber, "UpdateApiCompany");
    const chackfromCompany = await SELECTTablecompanyName(id);
    if (Boolean(chackfromCompany)) {
      bcrypt.hash(
        `${chackfromCompany?.CommercialRegistrationNumber}`,
        10,
        async function (err, hash) {
          await UpdateTableinnuberOfcurrentBranchescompany([hash, id], "Api");
          res
            .send({ success: "تمت العملية بنجاح", data: `${hash}` })
            .status(200);
        }
      );
    } else {
      res.send({ success: "لاتوجد الشركه المطلوبه" }).status(402);
    }
  };
};
// قبول تسجيل الشركة
const AgreedRegistrationCompany = () => {
  return async (req, res) => {
    try {
      const id = req.query.id;
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
      }
      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "AgreedRegistrationCompany"
      );
      const dataCompany = await SELECTTablecompanyRegistration(parseInt(id));
      if (Boolean(dataCompany)) {
        await bcrypt.hash(
          `${dataCompany?.CommercialRegistrationNumber}`,
          10,
          async function (err, hash) {
            await insertTablecompany([
              dataCompany?.CommercialRegistrationNumber,
              dataCompany?.NameCompany,
              dataCompany?.BuildingNumber,
              dataCompany?.StreetName,
              dataCompany?.NeighborhoodName,
              dataCompany?.PostalCode,
              dataCompany?.City,
              dataCompany?.Country,
              dataCompany?.TaxNumber,
              hash,
            ]);
            const checkCompany = await SelectVerifycompanyexistence(
              dataCompany?.CommercialRegistrationNumber
            );
            if (Boolean(checkCompany)) {
              await insertTableuserComppany([
                checkCompany?.id,
                dataCompany?.userName,
                0,
                dataCompany?.PhoneNumber,
                "Admin",
                "موظف",
                "Admin",
                JSON.stringify([]),
              ]);
              await DeleteTablecompanySubProjectall(
                "companyRegistration",
                "id",
                id
              );
              await verificationSend(
                dataCompany?.PhoneNumber,
                null,
                `تم قبول طلب تسجيل شركتك في منصة مشرف`
              );

              res
                .send({ success: "تمت العملية بنجاح", data: `${hash}` })
                .status(200);
            }
          }
        );
      }
    } catch (error) {
      res.send({ success: "فشل تنفيذ العملية" }).status(402);
    }
  };
};

const sendNotificationRegistration = async (name) => {
  try {
    let array = [
      "571309090",
      "559233392",
      "557711177",
      "555785065",
      "550033173",
      "555285149",
      "533540335",
      "599667724",
      "505942034",
      "550555702",
      "571506060",
      "532171179",
      "567890370",
      "543259000",
      "534672874",
      "563449128",
      "509430463",
      "544666255",
      "500088197",
      "502464530",
    ];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      await verificationSend(
        element,
        null,
        `تم قبول طلب تسجيل شركتك في منصة مشرف`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// sendNotificationRegistration()

// حذف بيانات الشركة قيد التسجيل
const DeleteCompanyRegistration = () => {
  return async (req, res) => {
    try {
      console.log('hello world')
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
      }
      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "DeleteCompanyRegistration"
      );
      const id = req.query.id;
      await DeleteTablecompanySubProjectall("companyRegistration", "id", id);
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      res.send({ success: "فشل تنفيذ العملية" }).status(400);
      console.log(error);
    }
  };
};

const UpdatedataRegistration = () => {
  return async (req, res) => {
    try {
      const {
        CommercialRegistrationNumber,
        NameCompany,
        BuildingNumber,
        StreetName,
        NeighborhoodName,
        PostalCode,
        City,
        Country,
        TaxNumber,
        Api,
        PhoneNumber,
        userName,
        id,
      } = req.body;

      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
      }
      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "UpdatedataRegistration"
      );

      let number = String(PhoneNumber);
      if (number.startsWith(0)) {
        number = number.slice(1);
      }

      const checkVerifction = await SelectVerifycompanyexistence(
        CommercialRegistrationNumber,
        "companyRegistration"
      );
      const checkVerifctioncomany = await SelectVerifycompanyexistence(
        CommercialRegistrationNumber
      );
      const verificationFinduser = await SELECTTableusersCompanyVerification(
        number
      );

      const findRegistrioncompany =
        await SelectVerifycompanyexistencePhonenumber(number);
      if (verificationFinduser.length <= 0) {
        if (!Boolean(checkVerifctioncomany)) {
          if (
            !Boolean(findRegistrioncompany) ||
            (Boolean(findRegistrioncompany) &&
              findRegistrioncompany.CommercialRegistrationNumber ===
                CommercialRegistrationNumber) ||
            (Boolean(findRegistrioncompany) &&
              findRegistrioncompany.CommercialRegistrationNumber !==
                CommercialRegistrationNumber &&
              !Boolean(checkVerifction))
          ) {
            await UpdateTablecompanyRegistration([
              convertArabicToEnglish(CommercialRegistrationNumber),
              NameCompany,
              convertArabicToEnglish(BuildingNumber),
              StreetName,
              NeighborhoodName,
              convertArabicToEnglish(PostalCode),
              City,
              Country,
              convertArabicToEnglish(TaxNumber),
              convertArabicToEnglish(number),
              userName,
              String(Api),
              id,
            ]);

            res.send({ success: "تمت العملية بنجاح" }).status(200);
          } else {
            res
              .send({ success: "الرقم مستخدم لاضافة حساب شركة اخرى " })
              .status(200);
          }
        } else {
          res.send({ success: "السجل التجاري متواجد لشركة اخرى" }).status(200);
        }
      } else {
        res
          .send({ success: "الرقم مستخدم بالفعل في حساب باحدى الشركات " })
          .status(200);
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const UpdateCompanybrinsh = () => {
  return async (req, res) => {
    const { NumberCompany, NameSub, BranchAddress, Email, PhoneNumber, id } =
      req.body;
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
    }
    Addusertraffic(userSession.userName, userSession?.PhoneNumber, "UpdateCompanybrinsh");
    const operation = await UpdateTablecompanySub([
      NumberCompany,
      NameSub,
      BranchAddress,
      Email,
      PhoneNumber,
      id,
    ]);
    if (operation) {
      res
        .send({
          success: "تمت العملية بنجاح",
        })
        .status(200);
    } else {
      res
        .send({
          success: "هناك خطاء في تنفيذ العملية",
        })
        .status(400);
    }
  };
};

// قبول ورفض الطلبات
const Acceptandrejectrequests = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "Acceptandrejectrequests"
      );

      const id = req.body.id;
      const kindORreason = req.body.kindORreason;
      if (String(kindORreason).length > 0) {
        if (kindORreason === "قبول") {
          await UPDATETableFinancialCustody(
            `Approvingperson="${userSession.userName}",ApprovalDate=CURRENT_TIMESTAMP,OrderStatus="true"`,
            id
          );
          await CovenantNotfication(0, userSession.userName, "acceptance", id);
        } else {
          await UPDATETableFinancialCustody(
            `Approvingperson="${userSession.userName}",RejectionStatus="true",Reasonforrejection="${kindORreason}",Dateofrejection=CURRENT_TIMESTAMP`,
            id
          );
          await CovenantNotfication(0, userSession.userName, "reject", id);
        }
      }
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(200);
    }
  };
};

// تعديل بيانات الطلب
const Updatecovenantrequests = () => {
  return async (req, res) => {
    try {
      const { typedata, title, id } = req.body;
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
      }
      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "Updatecovenantrequests"
      );
      if (typedata === "معلقة") {
        const Amount = req.body.Amount;
        await UPDATETableFinancialCustody(
          `Statement="${title}",Amount=${Amount}`,
          id
        );
      } else {
        await UPDATETableFinancialCustody(`Reasonforrejection="${title}"`, id);
      }
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    }
  };
};

const Deletecovenantrequests = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "Deletecovenantrequests"
      );
      const PhoneNumber = userSession.PhoneNumber;
      if (PhoneNumber !== "502464530") {
        const id = req.query.id;
        await DeleteTableFinancialCustody([id]);
        res.send({ success: "تمت العملية بنجاح" }).status(200);
      } else {
        res.send({ success: "لايمكنك  القيام بالحذف" }).status(200);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(500);
    }
  };
};

const Branchdeletionprocedures = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "Branchdeletionprocedures"
      );
      const { IDBrach } = req.query;
      const check = Math.floor(1000 + Math.random() * 9000);
      await insertTableBranchdeletionRequests([
        IDBrach,
        userSession?.IDCompany,
        check,
        userSession?.PhoneNumber,
      ]);
      await verificationSend(
        userSession?.PhoneNumber,
        check,
        `كود حذف الفرع تأكد ان لا يصل هذا الرمز لاي شخص`
      );
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "قشل تنفيذ العملية" }).status(400);
    }
  };
};

const Implementedbyopreation = () => {
  return async (req, res) => {
    try {
      const { check } = req.query;

      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "Implementedbyopreation"
      );
      const result = await SELECTTableBranchdeletionRequests(
        userSession?.IDCompany,
        check,
        userSession.PhoneNumber
      );
      if (result.length > 0) {
        const project = await SELECTTABLEcompanyProjectall(result[0].IDBranch);
        for (const pic of project) {
          await opreationDeletProject(pic?.id);
        }
        await DeleteTablecompanySubProjectall(
          "companySub",
          "id",
          result[0].IDBranch
        );
        await DeleteTablecompanySubProjectall(
          "BranchdeletionRequests",
          "id",
          result[0].id
        );
      }
      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "قشل تنفيذ العملية" }).status(400);
    }
  };
};


// Move projects from idBrinsh 2 to idBrinsh 1 and delete idBrinsh 2

// Output the modified data

module.exports = {
  UpdateCompanybrinsh,
  UpdateDataCompany,
  Acceptandrejectrequests,
  Updatecovenantrequests,
  Deletecovenantrequests,
  UpdateApiCompany,
  AgreedRegistrationCompany,
  UpdatedataRegistration,
  DeleteCompanyRegistration,
  Branchdeletionprocedures,
  Implementedbyopreation,
};
