const {
  insertTableuserComppany,
  insertTableuserComppanySub,
} = require("../../sql/INsertteble");

const userCompany = async (req, res) => {
  try {
    const IDCompany = req.body.IDCompany;
    const userName = req.body.userName;
    const IDNumber = req.body.IDNumber;
    const PhoneNumber = req.body.PhoneNumber;
    const image = req.file.filename;
    const job = req.body.job;
    // console.log(IDCompany, userName, image);
    const operation = await insertTableuserComppany([
      IDCompany,
      userName,
      IDNumber,
      PhoneNumber,
      image,
      job,
    ]);
    res
      .send({
        success: operation,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res
      .send({
        success: false,
      })
      .status(400);
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

module.exports = { userCompany, userCompanySub };
