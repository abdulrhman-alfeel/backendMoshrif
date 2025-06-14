const {
  insertTablecompany,
  insertTablecompanySub,
  insertTableLinkevaluation,
  insertTableFinancialCustody,
  insertTablecompanycompanyRegistration,
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
const { SELECTTableusersCompanyVerification } = require("../../sql/selected/selectuser");
const {
  UpdateTableinnuberOfcurrentBranchescompany,
  UpdateTableLinkevaluation,
} = require("../../sql/update");
const { verificationSend } = require("../companyselect/userCompanyselect");
const { CovenantNotfication } = require("../notifcation/NotifcationProject");
const { CheckAdmin, CheckGlobal } = require("./insertuserCompany");


// اضافة شركة جديدة
const insertDataCompany =  () => {
  return async (req,res) => {
  try {
    const {CommercialRegistrationNumber,NameCompany,BuildingNumber,StreetName,NeighborhoodName,PostalCode,City,Country,TaxNumber,Api,PhoneNumber,userName} = req.body;
    const checkVerifction = await SelectVerifycompanyexistence(
      CommercialRegistrationNumber,"companyRegistration"
    );
    let number = String(PhoneNumber);
    if (number.startsWith(0)) {
      number = number.slice(1);
    }
    if(Boolean(CommercialRegistrationNumber),Boolean(NameCompany),Boolean(BuildingNumber),Boolean(StreetName),Boolean(NeighborhoodName),Boolean(PostalCode),Boolean(City),Boolean(Country),Boolean(TaxNumber),Boolean(Api),Boolean(PhoneNumber),Boolean(userName)){

      const verificationFinduser = await SELECTTableusersCompanyVerification(
        number
      );
      if (checkVerifction !== undefined) {
        return res
          .send({
            success: "الشركة موجودة بالفعل",
          })
          .status(200);
      } else  if (verificationFinduser.length > 0){
        res.send({success:'الرقم مستخدم بالفعل في حساب باحدى الشركات '}).status(200);
  
      }else{
        await insertTablecompanycompanyRegistration([
          CommercialRegistrationNumber,
          NameCompany,
          BuildingNumber,
          StreetName,
          NeighborhoodName,
          PostalCode,
          City,
          Country,
          TaxNumber,
          String(Api),
          number,
          userName
        ]);
        res
          .send({
            success: "نرحب بك في منصة مشرف سيتم مراجعة بياناتك وفتح الحساب فور التحقق من صحت البيانات",
          })
          .status(200);
      
      };
    await sendNotificationCompany(NameCompany);
    }else{
      res
      .send({
        success: "يجب اكمال البيانات ",
      })
      .status(200);
    }

  } catch (error) {
    // console.log(error);
    res
    .send({
      success: "فشل تنفيذ العملية",
    })
    .status(402);

  }
}
};





const sendNotificationCompany = async (name) =>{
  try{
    let array = ['582405952','502464530',"567256943","564565001","570635004"]
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      await verificationSend(element,null, `طلب انشاء حساب جديد من ${name}`)
    }
  }catch
  (error){
    console.log(error);
  }
}

//  اضافة فرع جديد
const inseertCompanybrinsh =  () => {
  return async (req, res) => {
  try {
    const {NumberCompany,NameSub,BranchAddress,Email,PhoneNumber,check,checkGloble} = req.body;
    console.log(Boolean(NameSub) && Boolean(BranchAddress),req.body);
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
}
};

// اضافة رابط تقييم الجودة
const InsertLinkevaluation =  () => {
  return async (req, res) => {
  try {
    const {IDcompanySub,Linkevaluation } = req.body;

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
}
};

// اغلاق عمليات المالية يدوياً
const OpenOrCloseopreationStopfinance =  () => {
  return async (req, res) => {
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
}
};


//  طلبات العهد
const insertRequestFinancialCustody =  () => {
  return async (req, res) => {
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
    // console.log(userSession.PhoneNumber , Amount,Statement);
    if ( IDCompanySub > 0 && String(Statement).length > 0){
      const maxOrder = await SELECTTableMaxFinancialCustody(IDCompanySub);
      // console.log(maxOrder?.last_id);
      const idOrder = maxOrder?.last_id === null ? 1 : maxOrder.last_id + 1;
      // console.log(idOrder);
      await insertTableFinancialCustody([idOrder,IDCompany,IDCompanySub,Requestby,String(Amount) > 0 ? Amount : 0 ,Statement]);
      await CovenantNotfication(IDCompanySub,Requestby);
      res.send({success:'تمت العملية بنجاح'}).status(200);
    }else{
      res.send({success:'فشل تنفيذ العملية'}).status(201)
    }
  }catch(error){
    console.log(error);
    res.send({success:'فشل تنفيذ العملية'}).status(501)
  }
}
}
module.exports = {
  insertDataCompany,
  inseertCompanybrinsh,
  InsertLinkevaluation,
  OpenOrCloseopreationStopfinance,
  insertRequestFinancialCustody
};
