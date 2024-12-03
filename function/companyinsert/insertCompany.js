const {
  insertTablecompany,
  insertTablecompanySub,
  insertTableLinkevaluation,
  insertTableFinancialCustody,
} = require("../../sql/INsertteble");
const {
  SELECTTablecompanySubID,
  SELECTTablecompanySubCount,
  SelectVerifycompanyexistence,
  SELECTTablecompanyName,
  SELECTTablecompanySubLinkevaluation,
  SELECTTablecompany,
  SELECTTableMaxFinancialCustody,
} = require("../../sql/selected/selected");
const {
  UpdateTableinnuberOfcurrentBranchescompany,
  UpdateTableLinkevaluation,
} = require("../../sql/update");
const { CheckAdmin, CheckGlobal } = require("./insertuserCompany");


// اضافة شركة جديدة
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

//  اضافة فرع جديد
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
          await insertTablecompanySub([
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

// اضافة رابط تقييم الجودة
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

// اغلاق عمليات المالية يدوياً
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



//  طلبات العهد
const insertRequestFinancialCustody = async (req,res) => {
  try{
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    
    const IDCompanySub = req.body.IDCompanySub;
    const Requestby = userSession.PhoneNumber;
    const IDCompany = userSession.IDCompany;
    const Amount = req.body.Amount;
    const Statement = req.body.Statement;
    console.log(userSession.PhoneNumber , Amount,Statement);
    if ( IDCompanySub > 0 && String(Statement).length > 0){
      const maxOrder = await SELECTTableMaxFinancialCustody(IDCompanySub);
      console.log(maxOrder?.last_id);
      const idOrder = maxOrder?.last_id === null ? 1 : maxOrder.last_id + 1;
      console.log(idOrder);
      await insertTableFinancialCustody([idOrder,IDCompany,IDCompanySub,Requestby,String(Amount) > 0 ? Amount : 0 ,Statement]);
      res.send({success:'تمت العملية بنجاح'}).status(200)
    }else{
      res.send({success:'فشل تنفيذ العملية'}).status(201)
    }
  }catch(error){
    console.log(error);
    res.send({success:'فشل تنفيذ العملية'}).status(501)

  }
}
module.exports = {
  insertDataCompany,
  inseertCompanybrinsh,
  InsertLinkevaluation,
  OpenOrCloseopreationStopfinance,
  insertRequestFinancialCustody
};
