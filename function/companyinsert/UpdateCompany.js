const { DeleteTableFinancialCustody } = require("../../sql/delete");
const {
  insertTablecompany,
  insertTablecompanySub,
} = require("../../sql/INsertteble");
const {
  SELECTTablecompanySub,
  SELECTTablecompanySubID,
} = require("../../sql/selected/selected");
const db = require("../../sql/sqlite");
const {
  UpdateTablecompanySub,
  UpdateTablecompany,
  UPDATETableFinancialCustody,
} = require("../../sql/update");

const UpdateDataCompany = async (req, res) => {
  const NameCompany = req.body.NameCompany;
  const BuildingNumber = req.body.BuildingNumber;
  const StreetName = req.body.StreetName;
  const NeighborhoodName = req.body.NeighborhoodName;
  const PostalCode = req.body.PostalCode;
  const City = req.body.City;
  const Country = req.body.Country;
  const TaxNumber = req.body.TaxNumber;
  const Cost = req.body.Cost;

  // console.log(req.body);
  const id = req.body.id;
  if (
    String(NameCompany).length > 0 &&
    String(BuildingNumber).length > 0 &&
    String(StreetName).length > 0 &&
    String(NeighborhoodName).length > 0 &&
    String(PostalCode).length > 0 &&
    String(City).length > 0 &&
    String(Country).length > 0 &&
    String(TaxNumber).length > 0 &&
    String(id)
  ) {
    const tableCompany = await UpdateTablecompany([
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
    ]);
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

  // console.log(tableCompany);
};

const UpdateCompanybrinsh = async (req, res) => {
  const NumberCompany = req.body.NumberCompany;
  const NameSub = req.body.NameSub;
  const BranchAddress = req.body.BranchAddress;
  const Email = req.body.Email;
  const PhoneNumber = req.body.PhoneNumber;
  const id = req.body.id;
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

// قبول ورفض الطلبات
const Acceptandrejectrequests = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const id = req.body.id;
    const kindORreason = req.body.kindORreason;
    if (String(kindORreason).length > 0) {
      if (kindORreason === "قبول") {
        console.log(userSession.userName);
        await UPDATETableFinancialCustody(
          `Approvingperson="${userSession.userName}",ApprovalDate=CURRENT_TIMESTAMP,OrderStatus="true"`,
          id
        );
      } else {
        await UPDATETableFinancialCustody(
          `Approvingperson="${userSession.userName}",RejectionStatus="true",Reasonforrejection="${kindORreason}",Dateofrejection=CURRENT_TIMESTAMP`,
          id
        );
      }
    }
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(200);
  }
};

// تعديل بيانات الطلب
const Updatecovenantrequests = async (req, res) => {
  try {
    const typedata = req.body.typedata;
    const Statement = req.body.title;
    const id = req.body.id;
    if (typedata === "معلقة") {
      const Amount = req.body.Amount;
      await UPDATETableFinancialCustody(
        `Statement="${Statement}",Amount=${Amount}`,
        id
      );
    } else {
      await UPDATETableFinancialCustody(
        `Reasonforrejection="${Statement}"`,
        id
      );
    }
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  }
};

const Deletecovenantrequests = async (req, res) => {
  try {
    const id = req.query.id;
    await DeleteTableFinancialCustody([id]);
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(500);
  }
};

module.exports = {
  UpdateCompanybrinsh,
  UpdateDataCompany,
  Acceptandrejectrequests,
  Updatecovenantrequests,
  Deletecovenantrequests
};
