const {
  insertTableuserComppany,
} = require("../../sql/INsertteble");
const { SelectVerifycompanyexistencePhonenumber } = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyVerification,
  SELECTTableusersCompany,
} = require("../../sql/selected/selectuser");
const { UpdateTableuserComppany } = require("../../sql/update");

const userCompany =  () => {
  return async (req, res) => {
  try {
    // console.log(req.body);
    const {IDCompany,userName,IDNumber,PhoneNumber,jobdiscrption,job,Validity} = req.body;
   
    let number = String(PhoneNumber);
    if (number.startsWith(0)) {
      number = number.slice(1);
    }
    const verificationFinduser = await SELECTTableusersCompanyVerification(
      number
    );
    const findRegistrioncompany = await SelectVerifycompanyexistencePhonenumber(number)
    if (verificationFinduser.length <= 0 && findRegistrioncompany === undefined) {
      await insertTableuserComppany([
        IDCompany,
        userName,
        IDNumber,
        number,
        job,
        jobdiscrption,
        job,
        JSON.stringify(Validity),
      ]);
      res
        .send({
          success: "تمت العملية بنجاح",
        })
        .status(200);
    } else {
      res
        .send({
          success: findRegistrioncompany !== undefined ?  "الرقم موجود في قائمة انتظار تسجيل حساب شركات" :"المستخدم موجود بالفعل",
        })
        .status(400);
    }
  } catch (err) {
    console.log(err);
    res
      .send({
        success: 'فشل في تنفيذ العملية',
      })
      .status(400);
  }
}
};
// const Validity = [
//   {
//     idBrinsh :1,
//     project:[
//       {
//         idProject:1,
//         ValidityProject:[],
//       }
//     ]
//   }
// ];

// اخراج معلومات مدير الفرع
const CheckAdmin = async (check, resultSend, IDCompany) => {
  await UpdatDtatuser(check, resultSend, "مدير الفرع", IDCompany);
  // console.log(check,resultSend,'adminsub')
  
};

// اخراج بيانات الاعضاء
const CheckGlobal = async (checkGloble, resultSend, IDCompany) => {
  let sortingUser = [];
  const result = await SELECTTableusersCompany(IDCompany);

  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    if (checkGloble[element.id]) {
      sortingUser.push(element);
    }
  }
  for (let index = 0; index < sortingUser.length; index++) {
    const element = sortingUser[index];
    await UpdatDtatuser(element?.id, resultSend, "عضو", IDCompany);
  }
  return sortingUser;
};

const UpdatDtatuser = async (check, resultSend, type, IDCompany) => {
  let arraValidity = [];

  const result = await SELECTTableusersCompany(IDCompany);
  const findUser = result?.find((item) => item.id === check);
  // console.log(check, findUser.Validity, type);
  if(findUser === undefined){
    return;
  }
  //  استقبال الصلاحيات
  arraValidity = JSON.parse(findUser.Validity) || [];
  const findValidity = arraValidity.find(
    (item) => item.idBrinsh === resultSend
  );
  if (!findValidity) {
    arraValidity.push({
      idBrinsh: resultSend,
      job: type,
      project: [],
      Acceptingcovenant:false
    });
    await UpdateTableuserComppany([
      findUser?.IDCompany,
      findUser.userName,
      findUser.IDNumber,
      findUser.PhoneNumber,
      findUser?.job,
      JSON.stringify(arraValidity),
      findUser.id,
    ],"job=?,Validity=?");
  }
};



module.exports = { userCompany, CheckAdmin, CheckGlobal };
