const { createTokens } = require("../../middleware/jwt");
const { DELETETableLoginActivaty } = require("../../sql/delete");
const { insertTableLoginActivaty } = require("../../sql/INsertteble");
const {
  SELECTTableUsernameBrinsh,
  SELECTTablecompany,
} = require("../../sql/selected/selected");

const {
  SELECTTableusersCompanyVerification,
  SELECTTableusersCompany,
  SELECTTableLoginActivaty,
  SELECTTableLoginActivatActivatyall,
  SELECTTablevalidityuserinBransh,
} = require("../../sql/selected/selectuser");

const Loginuser = () => {
  return async (req, res) => {
    const { PhoneNumber, token, code } = req.query;
    // bring data from table user origin

    const result = await SELECTTableusersCompanyVerification(PhoneNumber);
    await DELETETableLoginActivaty([PhoneNumber]);
    // bring validity users from table user table
    //   send operation login to table loginActivaty
    if (result?.length > 0) {
      const output = Math.floor(1000 + Math.random() * 9000);
      let PhoneNumbers = code ? `${code}${PhoneNumber}` : PhoneNumber;
      verificationSend(PhoneNumbers, output);

      const currentDate = new Date();
      const futureDate = new Date(currentDate);
      futureDate.setDate(currentDate.getDate() + 5);
      const data = [
        result[0]?.IDCompany,
        result[0]?.userName,
        result[0]?.IDNumber,
        result[0].PhoneNumber,
        result[0]?.image,
        new Date().toDateString(),
        futureDate.toDateString(),
        result[0]?.job,
        result[0]?.jobdiscrption,
        output,
        token,
      ];
      await insertTableLoginActivaty(data);

      res.send({ success: true, masseg: "اهلاً وسهلا بك" }).status(200);
    } else {
      res
        .send({
          success: false,
          masseg:
            "الرقم غير موجوود تأكد من الرقم المدخل او تواصل بالمسؤول لاضافتك كمستخدم جديد",
        })
        .status(201);
    }
  };
};

const axios = require("axios");

const verificationSend = (number, chack = null, title = null) => {
  try {
    let title1 = Boolean(chack)
      ? `للدخول لمنصة مشرف استخدم رمز التحقق : ${chack}`
      : title;
    const url = "https://el.cloud.unifonic.com/rest/Messages/SendBulk";
    const params = {
      AppSid: "ll3noHmCZwsFLD7B6ysdm2Vmhh3U0p",
      SenderID: "Mushrf.com",
      Body: title1,
      // Recipient: `966567256943`,
      Recipient: switchNumber(number),
    };
    const headers = {
      accept: "application/json",
    };

    axios
      .post(url, null, { params, headers })
      .then((response) => {})
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

const switchNumber = (number) => {
  if (number.startsWith("+")) {
    return number.replace("+", "");
  }

  if (number.startsWith("5") || number.startsWith("0")) {
    return `966${number}`;
  }
  return number;
};

const LoginVerification = () => {
  return async (req, res) => {
    try {
      const { output, PhoneNumber } = req.query;

      const result = await SELECTTableLoginActivaty(
        output,
        parseInt(PhoneNumber)
      );
      if (result !== undefined) {
        // create accessToken from data users
        const user = {
          id: result?.id,
          IDCompany: result?.IDCompany,
          CommercialRegistrationNumber: result.CommercialRegistrationNumber,
          userName: result?.userName,
          PhoneNumber: result?.PhoneNumber,
          IDNumber: result?.IDNumber,
          image: result?.image,
          job: result.job,
          jobdiscrption: result.jobdiscrption,
          token: result.token,
          DateOFlogin: result.DateOFlogin,
          DateEndLogin: result.DateEndLogin,
        };

        const data = await SELECTTablecompany(result?.IDCompany);
        const accessToken = createTokens(user);
        // console.log(accessToken);
        // bring data usres according to validity
        // const ObjectData = await verificationfromValidity(result);
        res
          .send({
            success: true,
            accessToken: accessToken,
            data: user,
            DisabledFinance: data.DisabledFinance,
          })
          .status(200);
      } else {
        res
          .send({ success: false, masseg: "رمز التأكيد خاطاً تأكد من الرمز" })
          .status(201);
      }
    } catch (error) {
      console.log(error);
      res
        .send({ success: false, masseg: "رمز التأكيد خاطاً تأكد من الرمز" })
        .status(201);
    }
  };
};
const LoginVerificationv2 = () => {
  return async (req, res) => {
    try {
      const output = req.query.output;
      const PhoneNumber = req.query.PhoneNumber;
      const result = await SELECTTableLoginActivaty(
        output,
        parseInt(PhoneNumber)
      );
      if (result !== undefined) {
        // create accessToken from data users
        const user = {
          IDCompany: result?.IDCompany,
          CommercialRegistrationNumber: result.CommercialRegistrationNumber,
          userName: result?.userName,
          PhoneNumber: result?.PhoneNumber,
          IDNumber: result?.IDNumber,
          image: result?.image,
          job: result.job,
          jobdiscrption: result.jobdiscrption,
          token: result.token,
          DateOFlogin: result.DateOFlogin,
          DateEndLogin: result.DateEndLogin,
        };

        const data = await SELECTTablecompany(result?.IDCompany);
        const accessToken = createTokens(user);
        // console.log(accessToken);
        // bring data usres according to validity
        // const ObjectData = await verificationfromValidity(result);
        res
          .send({
            success: true,
            accessToken: accessToken,
            data: user,
            DisabledFinance: data.DisabledFinance,
          })
          .status(200);
      } else {
        res
          .send({ success: false, masseg: "رمز التأكيد خاطاً تأكد من الرمز" })
          .status(201);
      }
    } catch (error) {
      console.log(error);
      res
        .send({ success: false, masseg: "رمز التأكيد خاطاً تأكد من الرمز" })
        .status(201);
    }
  };
};

const loginOut = () => {
  return async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    await DELETETableLoginActivaty([userSession.PhoneNumber]);
    res.send({ success: "تمت العملية بنجاح" }).status(200);
  };
};
// التحقق من دخول المستخدم ومعرفة صلاحياته وارسال بيانات حسب الصلاحيات

const BringUserCompany = () => {
  return async (req, res) => {
    try {
      const { IDCompany, number, kind_request = "all" } = req.query;
      let count = number || 0;
      let kindrequest =
        kind_request === "all"
          ? `AND us.id > ${count}`
          : `AND us.userName LIKE '%${kind_request}%'`;
      const result = await SELECTTableusersCompany(IDCompany, kindrequest);

      res.send({ success: "successfuly", data: result }).status(200);
    } catch (err) {
      console.log(err);
    }
  };
};

// جلب بيانات الاعضاء داخل الفرع

const BringUserCompanyinv2 = () => {
  return async (req, res) => {
    try {
      // 1. استلام المتغيرات من الطلب
      const {
        IDCompany,
        idBrinsh,
        type,
        number = 0,
        kind_request = "all",
        selectuser = "none",
      } = req.query;
      // 3. بناء فلتر الفرع أو المشروع حسب نوع الطلب
      let branchFilter = "";

      if (selectuser === "bransh") {
        branchFilter = `AND ub.idBransh = ${idBrinsh}`;
      } else if (selectuser === "project") {
        branchFilter = `AND ub.idBransh = ${idBrinsh} AND up.ProjectID = ${type}`;
      }

      // 4. تحديد الأعمدة الإضافية المطلوبة حسب نوع الطلب
      let additionalFields = ",";

      switch (type) {
        case "AdminSub":
          additionalFields += `
            (SELECT sh.user_id FROM usersBransh sh WHERE sh.idBransh=${idBrinsh}  AND sh.job = 'مدير الفرع') AS idAdmin,
            CASE 
              WHEN ub.job = 'مدير الفرع' THEN 'true'
              ELSE 'false'
            END AS Adminbransh,
            CASE 
              WHEN ub.job = 'مدير الفرع' THEN 'true'
              ELSE 'false'
            END AS original_is_in
          `;
          break;

        case "user":
          additionalFields += `
            (SELECT sh.user_id FROM usersBransh sh WHERE idBransh = ub.idBransh AND sh.job = 'مدير الفرع') AS idAdmin,
            CASE 
              WHEN ub.idBransh IS NOT NULL THEN 'true'
              ELSE 'false'
            END AS is_in_branch,
            CASE 
              WHEN ub.idBransh IS NOT NULL THEN 'true'
              ELSE 'false'
            END AS original_is_in,
            CASE
                WHEN ub.ValidityBransh IS NOT NULL AND json_valid(ub.ValidityBransh) 
          THEN json_extract(ub.ValidityBransh, "$") 
        ELSE NULL
      END AS ValidityBransh
          `;

          break;

        case "Acceptingcovenant":
          additionalFields += `
            CASE
              WHEN ub.Acceptingcovenant = 'true'  AND ub.idBransh = ${idBrinsh} THEN 'true'
              ELSE 'false'
            END AS is_in_Acceptingcovenant,
            CASE
              WHEN ub.Acceptingcovenant = 'true'  AND ub.idBransh = ${idBrinsh} THEN 'true'
              ELSE 'false'
            END AS original_is_in
          `;

          break;

        default:
          additionalFields += `
          (SELECT sh.user_id FROM usersBransh sh WHERE idBransh = ub.idBransh AND sh.job = 'مدير الفرع') AS idAdmin,
            CASE 
              WHEN up.ProjectID IS NOT NULL THEN 'true'
              ELSE 'false'
            END AS is_in_ProjectID,
            CASE 
              WHEN up.ProjectID IS NOT NULL THEN 'true'
              ELSE 'false'
            END AS original_is_in,
              CASE
        WHEN up.ValidityProject IS NOT NULL AND json_valid(up.ValidityProject) 
          THEN json_extract(up.ValidityProject, "$") 
        ELSE NULL
      END AS ValidityProject

          `;
          break;
      }

      // 5. تحديد نوع الفلترة حسب البحث أو الكل
      const whereCondition =
        kind_request === "all"
          ? `AND us.id > ${parseInt(
              number
            )} AND us.job != 'Admin' ${branchFilter}`
          : `AND us.userName LIKE '%${kind_request}%' AND us.job != 'Admin' ${branchFilter}`;
      // 6. استدعاء الدالة لجلب البيانات
      const result = await SELECTTableusersCompany(
        IDCompany,
        whereCondition,
        "ORDER BY id ASC LIMIT 10 ",
        `AND ub.idBransh=${idBrinsh}`,
        additionalFields,
        Number(type) ? `AND up.ProjectID = ${type}` : ""
      );
      res.status(200).json({
        success: "successfuly",
        data: result,
      });
    } catch (err) {
      console.error("Error in BringUserCompanyinv2:", err);
      res.status(200).json({
        success: "error",
        data: [],
        message: "Internal Server Error",
      });
    }
  };
};

const BringAllLoginActvity = () => {
  return async (req, res) => {
    const resultall = await SELECTTableLoginActivatActivatyall();
    res.send({ success: "تمت العملية بنجاح", data: resultall }).status(200);
  };
};

// حلب صلاحيات المستخدم داخل الفرع
const BringvalidityuserinBransh = () => {
  return async (req, res) => {
    try {
      const { PhoneNumber, idBrinsh,number= 0 } = req.query;
      const resultuser = await SELECTTablevalidityuserinBransh(
        PhoneNumber,
        idBrinsh,
        number
      );

      res.send({ success: "تمت العملية بنجاح", data: resultuser }).status(200);
    } catch (error) {
      console.log(error);
    }
  };
};

// فحص وجود المستخدم من عدم وجودة
const CheckUserispresentornot = () => {
  return async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const PhoneNumber = userSession.PhoneNumber;
    const verificationFinduser = await SELECTTableusersCompanyVerification(
      PhoneNumber
    );
    if (verificationFinduser.length <= 0) {
      res.status(200).send({ success: false });
    } else {
      res.status(200).send({ success: true });
    }
  };
};
module.exports = {
  BringAllLoginActvity,
  Loginuser,
  LoginVerification,
  BringUserCompany,

  CheckUserispresentornot,
  LoginVerificationv2,
  BringvalidityuserinBransh,
  verificationSend,
  BringUserCompanyinv2,
  loginOut,
};
