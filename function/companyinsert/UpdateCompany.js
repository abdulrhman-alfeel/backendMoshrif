const { DeleteTableFinancialCustody } = require("../../sql/delete");
const {  SELECTTablecompanyName } = require("../../sql/selected/selected");

const {
  UpdateTablecompanySub,
  UpdateTablecompany,
  UPDATETableFinancialCustody,
  UpdateTableinnuberOfcurrentBranchescompany,
} = require("../../sql/update");
const { CovenantNotfication } = require("../notifcation/NotifcationProject");
const bcrypt = require('bcrypt');

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
    await UpdateTablecompany([
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

const UpdateApiCompany = async (req,res) => {
  const id = req.query.id;
  const chackfromCompany = await SELECTTablecompanyName(id);
  if (Boolean(chackfromCompany)) {
    bcrypt.hash(`${chackfromCompany?.CommercialRegistrationNumber}`, 10, async function(err, hash) {
      await UpdateTableinnuberOfcurrentBranchescompany([hash,id],"Api");
      res.send({success:'تمت العملية بنجاح',data:`${hash}`}).status(200);
  });
}else{
  res.send({success:'لاتوجد الشركه المطلوبه'}).status(402);

}
}

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






// const OperationMoveingdataProjectfromBranshtoBransh = async (fromId,toId,IDCompany) => {
//   // const {fromId,toId,IDCompany} = req.query;
//   await UpdateMoveingDataBranshtoBrinsh(fromId,toId,'companySubprojects');
//   await UpdateMoveingDataBranshtoBrinsh(fromId,toId,'FinancialCustody',"IDCompanySub");
//   const resultuser = await SELECTTableusersCompany(IDCompany);
//   for(const user of resultuser){
//     const data = JSON.parse(user.Validity);
//     const resultValidity = await moveProjectsAndDelete(data, 2, 1);
//     await UpdateTableuserComppanyValidity([JSON.stringify(resultValidity),user.id])
//   }
//   await DeleteTablecompanySubProjectall("companySub",'id',fromId);

// }


// OperationMoveingdataProjectfromBranshtoBransh(2,1,1);

// Function to move projects from idBrinsh 2 to idBrinsh 1 and delete idBrinsh 2
// function moveProjectsAndDelete(data, fromId, toId) {
//   const fromBrinshIndex = data.findIndex(item => parseInt(item.idBrinsh) === fromId);
//   const toBrinsh = data.find(item => parseInt(item.idBrinsh) === toId);

//   if (fromBrinshIndex !== -1 && toBrinsh) {
//     // Move projects
//     toBrinsh.project.push(...data[fromBrinshIndex].project);
    
//     // Remove the fromId brinsh
//     data.splice(fromBrinshIndex, 1);
    
//     // Return the modified data
//     return data;
//   } else if(fromBrinshIndex !== -1 ) {
//     let datanew = [...data, { 
//       idBrinsh: 1,
//       job: 'عضو',
//       project:data[fromBrinshIndex].project ,
//       Acceptingcovenant: false}]
//     return datanew; // Return the original data if not found
//   }else{
//     console.log('One of the idBrinsh not found');
//     return data; // Return the original data if not found

//   }
// }


// Move projects from idBrinsh 2 to idBrinsh 1 and delete idBrinsh 2

// Output the modified data

module.exports = {
  UpdateCompanybrinsh,
  UpdateDataCompany,
  Acceptandrejectrequests,
  Updatecovenantrequests,
  Deletecovenantrequests,
  UpdateApiCompany
};
