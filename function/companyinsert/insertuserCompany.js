const {
  insertTableuserComppany,
  insertTableuserComppanySub,
} = require("../../sql/INsertteble");
const { SELECTTablecompanySub } = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyVerification,
  SELECTTableusersCompany,
} = require("../../sql/selected/selectuser");
const { UpdateTableuserComppany } = require("../../sql/update");

const userCompany = async (req, res) => {
  try {
    // console.log(req.body);
    const IDCompany = req.body.IDCompany;
    const userName = req.body.userName;
    const IDNumber = req.body.IDNumber;
    const PhoneNumber = req.body.PhoneNumber;
    // const image = req.file.filename;
    const job = req.body.job;
    const Validity = req.body.Validity;
    let number = String(PhoneNumber);
    if (number.startsWith(0)) {
      number = number.slice(1);
    }
    const verificationFinduser = await SELECTTableusersCompanyVerification(
      number
    );
    console.log(verificationFinduser);
    if (verificationFinduser.length <= 0) {
      const operation = await insertTableuserComppany([
        IDCompany,
        userName,
        IDNumber,
        number,
        job,
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
          success: "المستخدم موجود بالفعل",
        })
        .status(400);
    }
  } catch (err) {
    console.log(err);
    res
      .send({
        success: false,
      })
      .status(400);
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

  //  استقبال الصلاحيات
  arraValidity = JSON.parse(findUser.Validity);
  const findValidity = arraValidity.find(
    (item) => item.idBrinsh === resultSend
  );
  if (!findValidity) {
    arraValidity.push({
      idBrinsh: resultSend,
      job: type,
      project: [],
    });
    const operation = await UpdateTableuserComppany([
      findUser?.IDCompany,
      findUser.userName,
      findUser.IDNumber,
      findUser.PhoneNumber,
      type,
      JSON.stringify(arraValidity),
      findUser.id,
    ]);
  }
};

const userCompanySub = async (req, res) => {
  try {
    const IDuser = req.body.IDuser;
    const IDcompanySub = req.body.IDcompanySub;
    const IDproject = req.body.IDproject;
    const job = req.body.job;
    const Validity = req.body.Validity;
    await insertTableuserComppanySub([
      IDuser,
      IDcompanySub,
      IDproject,
      job,
      Validity,
    ]);
    res.send({ success: true }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(200);
  }
  //  مدير الشركة
  // مدير الفرع

  /*
 مدير شركة 
 جميع الصلاحيات 
 مدير فرع 
 مالك المشروع
 مدير المشاريع 
 الاستشاري 
 مهندس موقع 
 موظف 
 مدخل بيانات 
 مسئول طلبات ثقيله 
 مسئول طلبات خفيفة
 مندوب توصيل 
 مقاول 
 زائر 



 اضافة مستخدمين للشركة
فتح فروع 
تعيين مدراء فروع 
تعديل فرع 
8 حذف فرع 


اضافة مشاريع جديدة 
حذف مشاريع
تعيين مستخدمين للمشاريع 
اضافة مراحل رئيسية 
تعديل على مراحل رئيسية 
حذف مراحل رئيسية 8
اضافة مراحل فرعية 
تعديل على مراحل فرعية 
حذف مراحل فرعية 
اقفال مراحل رئيسية 
الغاء قفل مراحل رئيسية 
اقفال مراحل فرعية 
الغا قفل مراحل فرعيه
اضافة تاخيرات
حذف تاخير 
اضافة طلبات 
حذف طلبات 
تعديل طلبات 
استعراض طلبات
دردشة مالية 
دردشة طلبات 
دردشة مراحل 


 





*/
};

module.exports = { userCompany, userCompanySub, CheckAdmin, CheckGlobal };
