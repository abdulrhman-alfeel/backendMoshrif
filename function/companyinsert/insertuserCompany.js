const {
  insertTableuserComppany,
  insertTableusersBransh,
} = require("../../sql/INsertteble");
const {
  SelectVerifycompanyexistencePhonenumber,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyVerification,
  SELECTTableusersCompany,
} = require("../../sql/selected/selectuser");
const { UpdateTableuserComppany } = require("../../sql/update");

const userCompany = () => {
  return async (req, res) => {
    try {
      const {
        IDCompany,
        userName,
        IDNumber,
        PhoneNumber,
        jobdiscrption,
        job,
        Validity,
      } = req.body;
      let number = String(PhoneNumber);
      if (number.startsWith(0)) {
        number = number.slice(1);
      }
      const verificationFinduser = await SELECTTableusersCompanyVerification(
        number
      );
      const findRegistrioncompany =
        await SelectVerifycompanyexistencePhonenumber(number);
      if (
        verificationFinduser.length <= 0 &&
        findRegistrioncompany === undefined
      ) {
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
            success:
              findRegistrioncompany !== undefined
                ? "الرقم موجود في قائمة انتظار تسجيل حساب شركات"
                : "المستخدم موجود بالفعل",
          })
          .status(400);
      }
    } catch (err) {
      console.log(err);
      res
        .send({
          success: "فشل في تنفيذ العملية",
        })
        .status(400);
    }
  };
};

// اخراج معلومات مدير الفرع
const CheckAdmin = async (check, resultSend) => {
  await insertTableusersBransh([resultSend, check, "مدير الفرع"]);
};

// اخراج بيانات الاعضاء
const CheckGlobal = async (checkGloble, resultSend) => {
  for (let index = 0; index < Object.values(checkGloble).length; index++) {
    const element = Object.values(checkGloble)[index];
    await insertTableusersBransh([resultSend, element?.id, "عضو"]);
  }
};

module.exports = { userCompany, CheckAdmin, CheckGlobal };
