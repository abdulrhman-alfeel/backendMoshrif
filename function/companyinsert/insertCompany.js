const {
  insertTablecompany,
  insertTablecompanySub,
  insertTableLinkevaluation,
} = require("../../sql/INsertteble");
const {
  SELECTTablecompanySubID,
  SELECTTablecompanySubCount,
  SelectVerifycompanyexistence,
  SELECTTablecompanyName,
  SELECTTablecompanySubLinkevaluation,
  SELECTTablecompany,
} = require("../../sql/selected/selected");
const db = require("../../sql/sqlite");
const {
  UpdateTableinnuberOfcurrentBranchescompany,
  UpdateTableLinkevaluation,
} = require("../../sql/update");
const { CheckAdmin, CheckGlobal } = require("./insertuserCompany");

const insertDataCompany = async (req, res) => {
  try {
    const CommercialRegistrationNumber = req.body.CommercialRegistrationNumber;
    const NameCompany = req.body.NameCompany;
    const BuildingNumber = req.body.BuildingNumber;
    const StreetName = req.body.StreetName;
    const NeighborhoodName = req.body.NeighborhoodName;
    const PostalCode = req.body.PostalCode;
    const City = req.body.City;
    const Country = req.body.Country;
    const TaxNumber = req.body.TaxNumber;
    const NumberOFbranchesAllowed = req.body.NumberOFbranchesAllowed;
    const NumberOFcurrentBranches = req.body.NumberOFcurrentBranches;
    // console.log(req.body);
    const checkVerifction = await SelectVerifycompanyexistence(
      CommercialRegistrationNumber
    );
    if (checkVerifction !== undefined) {
      res
        .send({
          success: "الشركة موجودة بالفعل",
        })
        .status(200);
    } else {
      const tableCompany = await insertTablecompany([
        CommercialRegistrationNumber,
        NameCompany,
        BuildingNumber,
        StreetName,
        NeighborhoodName,
        PostalCode,
        City,
        Country,
        TaxNumber,
        NumberOFbranchesAllowed,
        NumberOFcurrentBranches,
      ]);
      // console.log(tableCompany);
      res
        .send({
          success: true,
        })
        .status(200);
    }
  } catch (error) {
    console.log(error);
  }
};

const inseertCompanybrinsh = async (req, res) => {
  try {
    const NumberCompany = req.body.NumberCompany;
    const NameSub = req.body.NameSub;
    const BranchAddress = req.body.BranchAddress;
    const Email = req.body.Email;
    const PhoneNumber = req.body.PhoneNumber;
    const check = req.body.check;
    const checkGloble = req.body.checkGloble;

    if (Boolean(NameSub) && Boolean(BranchAddress)) {
      const chackfromCompany = await SELECTTablecompanyName(NumberCompany);
      if (chackfromCompany !== undefined) {
        const checkVerifction = await SELECTTablecompanySubID(
          NameSub,
          NumberCompany
        );
        if (checkVerifction !== undefined) {
          res
            .send({
              success: "الفرع موجود مسبقاً",
            })
            .status(400);
        } else {
          const operation = await insertTablecompanySub([
            NumberCompany,
            NameSub,
            BranchAddress,
            Email,
            PhoneNumber,
          ]);

          const IDcompanySub = await SELECTTablecompanySubID(
            NameSub,
            NumberCompany
          );
          // console.log(check,checkGloble)
          if (check > 0) {
            await CheckAdmin(check, IDcompanySub.id, NumberCompany);
          }
          const Globaluser =
            checkGloble !== undefined ? Object.entries(checkGloble) : [];
          if (Globaluser.length > 0) {
            await CheckGlobal(checkGloble, IDcompanySub.id, NumberCompany);
          }

          res
            .send({
              success: "تمت العملية بنجاح",
              IDcompanySub: IDcompanySub.id,
            })
            .status(200);
          const countBransh = await SELECTTablecompanySubCount(NumberCompany);
          await UpdateTableinnuberOfcurrentBranchescompany([
            countBransh[0]["COUNT(*)"],
            NumberCompany,
          ]);
        }
      } else {
        res
          .send({
            success: "يرجى انشاء حساب شركة قبل البدء بالفروع",
          })
          .status(200);
      }
    } else {
      res
        .send({
          success: "يرجى ادخال البيانات اولاً",
        })
        .status(200);
    }
  } catch (error) {
    console.log(error);
    res
      .send({
        success: "يوجد خطاء في العملية التي قمت بها ",
      })
      .status(400);
  }
};

const InsertLinkevaluation = async (req, res) => {
  try {
    const IDcompanySub = req.body.IDcompanySub;
    const Linkevaluation = req.body.Linkevaluation;

    const result = await SELECTTablecompanySubLinkevaluation(IDcompanySub);
    if (Boolean(result)) {
      await UpdateTableLinkevaluation([Linkevaluation, IDcompanySub]);
    } else {
      await insertTableLinkevaluation([IDcompanySub, Linkevaluation]);
    }
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(500);
  }
};

const OpenOrCloseopreationStopfinance = async (req, res) => {
  try {
    const id = req.query.idCompany;
    let DisabledFinance;
    const data = await SELECTTablecompany(id);
    if (data.DisabledFinance === "true") {
      DisabledFinance = "false";
    } else {
      DisabledFinance = "true";
    }
    await UpdateTableinnuberOfcurrentBranchescompany(
      [DisabledFinance, id],
      "DisabledFinance"
    );
    res.send({ success: "تمت العملية بنجاح",DisabledFinance:DisabledFinance }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(400);
  }
};

module.exports = {
  insertDataCompany,
  inseertCompanybrinsh,
  InsertLinkevaluation,
  OpenOrCloseopreationStopfinance,
};
