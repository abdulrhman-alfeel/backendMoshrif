const { Addusertraffic } = require("../../middleware/Aid");
const {
  DeletTableuserComppanyCorssUpdateActivationtoFalse,
  DeleteuserBransh,
} = require("../../sql/delete");
const {
  insertTableusersBransh,
  insertTableusersProject,
  insertTableusersBranshAcceptingcovenant,
} = require("../../sql/INsertteble");
const {
  SelectVerifycompanyexistencePhonenumber,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyVerificationID,
  SELECTTableLoginActivatActivaty,
  SELECTTableusersCompanyVerificationIDUpdate,
  SELECTTableusersCompanyVerification,
  SELECTTableusersBransh,
} = require("../../sql/selected/selectuser");
const {
  UpdateTableuserComppany,
  UpdateTableLoginActivatytoken,
  UpdateTableuserComppanyValidity,
  UpdateTableusersBransh,
  UpdateTableusersProject,
} = require("../../sql/update");
const { UpdaterateCost } = require("./UpdateProject");
// const { AddOrUpdatuser } = require("../notifcation/NotifcationProject");

const userCompanyUpdatdashbord = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
      }

      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "userCompanyUpdatdashbord"
      );
      // console.log(req.body);
      const {
        IDCompany,
        userName,
        IDNumber,
        PhoneNumber,
        jobdiscrption,
        job,
        id,
      } = req.body;
      let number = String(PhoneNumber);

      if (number.startsWith(0)) {
        number = number.slice(1);
      }
      const verificationFinduser =
        await SELECTTableusersCompanyVerificationIDUpdate(number, id);
      const findRegistrioncompany =
        await SelectVerifycompanyexistencePhonenumber(number);

      if (
        verificationFinduser.length <= 0 &&
        findRegistrioncompany === undefined
      ) {
        await UpdateTableuserComppany(
          [IDCompany, userName, IDNumber, number, job, jobdiscrption, id],
          "job=?,jobdiscrption=?"
        );
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
                : "الرقم الذي اضفته لمستخدم موجود",
          })
          .status(200);
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
const userCompanyUpdat = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
      }

      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "userCompanyUpdat"
      );
      // console.log(req.body);
      const { userName, IDNumber, PhoneNumber, jobdiscrption, job, id } =
        req.body;
      let number = String(PhoneNumber);

      if (number.startsWith(0)) {
        number = number.slice(1);
      }
      const verificationFinduser =
        await SELECTTableusersCompanyVerificationIDUpdate(number, id);
      const findRegistrioncompany =
        await SelectVerifycompanyexistencePhonenumber(number);

      if (
        verificationFinduser.length <= 0 &&
        findRegistrioncompany === undefined
      ) {
        await UpdateTableuserComppany(
          [
            userSession?.IDCompany,
            userName,
            IDNumber,
            number,
            job,
            jobdiscrption,
            id,
          ],
          "job=?,jobdiscrption=?"
        );
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
                : "الرقم الذي اضفته لمستخدم موجود",
          })
          .status(200);
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

const UpdatUserCompanyinBrinsh = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "UpdatUserCompanyinBrinsh"
      );
      // console.log(req.body);
      const { idBrinsh, type, checkGloblenew, checkGlobleold, kind } = req.body;

      // const result = await SELECTTableusersCompany(IDCompany);
      if (kind === "Acceptingcovenant" || kind === "user") {
        await Updatchackglobluserinbrinsh(
          idBrinsh,
          kind === "user" ? type : kind,
          checkGloblenew,
          checkGlobleold,
          userSession.userName
        );
      } else {
        await UpdatchackAdmininbrinsh(
          idBrinsh,
          type,
          checkGloblenew,
          checkGlobleold,
          userSession.userName
        );
      }
      // console.log(result,'updatusercompanyinbrinsh')
      // }
      res.send({ success: "successfuly" }).status(200);
    } catch (err) {
      console.log(err);
    }
  };
};
const UpdatUserCompanyinBrinshV2 = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "UpdatUserCompanyinBrinshV2"
      );
      // console.log(req.body);
      const { idBrinsh, type, checkGloblenew, checkGlobleold, kind } = req.body;
      // const result = await SELECTTableusersCompany(IDCompany);
      let arraykind = ["Acceptingcovenant", "user", "justuser"];
      if (arraykind.includes(kind)) {
        await Updatchackglobluserinbrinshv2(
          idBrinsh,
          type,
          checkGloblenew,
          checkGlobleold,
          userSession.userName
        );
      } else {
        await UpdatchackAdmininbrinshv2(
          idBrinsh,
          type,
          checkGloblenew,
          checkGlobleold,
          userSession.userName
        );
      }
      // console.log(result,'updatusercompanyinbrinsh')
      // }
      res.send({ success: "successfuly" }).status(200);
    } catch (err) {
      console.log(err);
    }
  };
};

//  عمليات تعديل صلاحية الادمن
const UpdatchackAdmininbrinsh = async (
  idBrinsh,
  type,
  checkGloblenew,
  checkGlobleold,
  userName
) => {
  //  المضاف الجديد
  //  عملية الغاء صلاحية مدير فرع من الفرع الذي كان مسؤل عليه حيث
  //  تقوم العملية بالاستعلام عن بيانات المدير السابق وفلترة مصفوفة صلاحيات
  //  ثم حذف صلاحيت الفرع من ضمن صلاحيات
  //  ثم يتم الاستعلام إذا كان لديه صلاحية مدير فرع في فروع اخرى
  // إذا لايوجد يتم تغيير وظيفته إلى عضو وإلا يبقى كما هيا

  if (checkGlobleold > 0) {
    //  عملية حذف صلاحية من شخص ما
    await DeleteuserBransh(checkGlobleold, idBrinsh);
    const result = await SELECTTableusersCompanyVerificationID(
      parseInt(checkGlobleold)
    );
    await UpdateTableuserComppanyValidity(
      [result[0].jobHOM, checkGlobleold],
      "job"
    );
  }

  // تقوم هذه العملية  بجلب بيانات صلاحيات المدير الجديد ثم فلترتها وحذف الفرع من قائمة صلاحياته
  //  ثم يتم ادخال الفرع نفسه باسم صلاحية جديدة
  // ثم يتم تغيير الوظيفة الخاصة فيه إلى مدير فرع
  if (checkGloblenew > 0) {
    await DeleteuserBransh(checkGlobleold, idBrinsh);
    await DeleteuserBransh(
      checkGlobleold,
      idBrinsh,
      "user_id",
      "idBransh",
      "usersProject"
    );
    await insertTableusersBransh([checkGloblenew, idBrinsh, "مدير الفرع"]);
  }

  // عملية اضافة صلاحيات مدير جديد
};

//  عمليات تعديل صلاحيات المستخدمين الاعضاء
const Updatchackglobluserinbrinsh = async (
  idBrinsh,
  type,
  checkGloblenew,
  checkGlobleold,
  userName
) => {
  // console.log(checkGloblenew, checkGlobleold, "mmmmmmmm");

  const deletedkeys = Object.keys(checkGlobleold);
  //   المحذوف من الاوبجكت القديم
  // console.log(deletedkeys, "deletedkeys");

  // const newvalidy = Object.keys(checkGloblenew).filter(
  //   (key) => !Object.keys(checkGlobleold).includes(key)
  // );
  const newvalidy = Object.values(checkGloblenew);
  //  المضاف الجديد

  if (deletedkeys.length > 0) {
    //  عملية حذف صلاحية من شخص ما
    for (let index = 0; index < deletedkeys.length; index++) {
      const element = deletedkeys[index];
      if (Number(type)) {
        await DeleteuserBransh(
          element,
          element,
          "user_id",
          "ProjectID",
          "usersProject"
        );
      } else {
        await DeleteuserBransh(
          element,
          idBrinsh,
          "user_id",
          "idBransh",
          "usersBransh"
        );
      }
    }
  }
  for (let index = 0; index < newvalidy.length; index++) {
    const element = newvalidy[index];

    await opreationAddvalidityuserBrinshorCovenant(type, idBrinsh, element);
  }
};

const UpdatchackAdmininbrinshv2 = async (
  idBrinsh,
  type,
  checkGloblenew,
  checkGlobleold,
  userName
) => {
  //  المضاف الجديد
  //  عملية الغاء صلاحية مدير فرع من الفرع الذي كان مسؤل عليه حيث
  //  تقوم العملية بالاستعلام عن بيانات المدير السابق وفلترة مصفوفة صلاحيات
  //  ثم حذف صلاحيت الفرع من ضمن صلاحيات
  //  ثم يتم الاستعلام إذا كان لديه صلاحية مدير فرع في فروع اخرى
  // إذا لايوجد يتم تغيير وظيفته إلى عضو وإلا يبقى كما هيا
  console.log(checkGlobleold, checkGloblenew);
  //  عملية حذف صلاحية من شخص ما
  await DeleteuserBransh(checkGlobleold, idBrinsh);

  const result = await SELECTTableusersCompanyVerificationID(
    parseInt(checkGlobleold)
  );
  if (result) {
    await UpdateTableuserComppanyValidity(
      [result[0]?.jobHOM, checkGlobleold],
      "job"
    );
  }
  if (checkGloblenew === null) return;
  // if(checkGloblenew) return ;
  // تقوم هذه العملية  بجلب بيانات صلاحيات المدير الجديد ثم فلترتها وحذف الفرع من قائمة صلاحياته
  //  ثم يتم ادخال الفرع نفسه باسم صلاحية جديدة
  // ثم يتم تغيير الوظيفة الخاصة فيه إلى مدير فرع
  if (checkGloblenew > 0) {
    await DeleteuserBransh(checkGlobleold, idBrinsh);
    await DeleteuserBransh(
      checkGlobleold,
      idBrinsh,
      "user_id",
      "idBransh",
      "usersProject"
    );
    await insertTableusersBransh([idBrinsh, checkGloblenew, "مدير الفرع"]);
    await UpdateTableuserComppanyValidity(
      ["مدير الفرع", checkGloblenew],
      "job"
    );
  }
};

//  عمليات تعديل صلاحيات المستخدمين الاعضاء
const Updatchackglobluserinbrinshv2 = async (
  idBrinsh,
  type,
  checkGloblenew,
  checkGlobleold,
  userName
) => {
  // console.log(checkGloblenew, checkGlobleold, "mmmmmmmm");

  const deletedkeys = Object.keys(checkGlobleold);
  //   المحذوف من الاوبجكت القديم
  // console.log(deletedkeys, "deletedkeys");

  // const newvalidy = Object.keys(checkGloblenew).filter(
  //   (key) => !Object.keys(checkGlobleold).includes(key)
  // );
  const newvalidy = Object.values(checkGloblenew);
  //  المضاف الجديد

  if (deletedkeys.length > 0) {
    //  عملية حذف صلاحية من شخص ما
    for (let index = 0; index < deletedkeys.length; index++) {
      const element = deletedkeys[index];
      if (Number(type)) {
        await DeleteuserBransh(
          element,
          type,
          "user_id",
          "ProjectID",
          "usersProject"
        );
      } else if (type === "Acceptingcovenant") {
        await UpdateTableusersBransh(
          ["false", element, idBrinsh],
          "Acceptingcovenant=?"
        );
      } else {
        await DeleteuserBransh(
          element,
          idBrinsh,
          "user_id",
          "idBransh",
          "usersBransh",
          "job != 'مدير الفرع' AND"
        );
      }
    }
  }

  for (let index = 0; index < newvalidy.length; index++) {
    const element = newvalidy[index];
    await opreationAddvalidityuserBrinshorCovenant(type, idBrinsh, element);
  }
};

const DeletUser = () => {
  return async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }

    Addusertraffic(userSession.userName, userSession?.PhoneNumber, "DeletUser");
    const PhoneNumber = req.body.PhoneNumber;
    try {
      const deletuser =
        await DeletTableuserComppanyCorssUpdateActivationtoFalse([PhoneNumber]);
      const deletloginuser =
        await DeletTableuserComppanyCorssUpdateActivationtoFalse(
          [PhoneNumber],
          "LoginActivaty"
        );
      if (deletuser) {
        res
          .send({
            success: "تمت العملية بنجاح",
          })
          .status(200);
      } else {
        res
          .send({
            success: "العملية غير ناجحة",
          })
          .status(200);
      }
    } catch (error) {
      console.log(error);
      res
        .send({
          success: "العملية غير ناجحة",
        })
        .status(400);
    }
  };
};

//  عمليات اضافة صلاحيات للمستخدم

const opreationAddvalidityuserBrinshorCovenant = async (
  type,
  idBrinsh,
  element
) => {
  try {
    if (Number(type)) {
      const resultuser = await SELECTTableusersBransh(
        [element.id, type],
        "usersProject",
        "user_id",
        "ProjectID"
      );
      if (resultuser) {
        await UpdateTableusersProject([
          JSON.stringify(element.Validity),
          element.id,
          type,
        ]);
      } else {
        await insertTableusersProject([
          idBrinsh,
          type,
          element.id,
          element.Validity,
        ]);
      }
      // If the type is a number, call AddUserInProject
    } else {
      // If type is not a number, check if it's not Acceptingcovenant
      const resultuser = await SELECTTableusersBransh([element.id, idBrinsh]);
      if (type !== "Acceptingcovenant") {
        if (resultuser) {
          await UpdateTableusersBransh(
            [JSON.stringify(element.Validity), element.id, idBrinsh],
            "ValidityBransh=?"
          );
        } else {
          await insertTableusersBransh([idBrinsh, element.id, "عضو"]);
        }
      } else {
        if (resultuser) {
          const Acceptingcovenant =
            resultuser && resultuser?.Acceptingcovenant === "true"
              ? "false"
              : "true";
          await UpdateTableusersBransh(
            [Acceptingcovenant, element.id, idBrinsh],
            "Acceptingcovenant=?"
          );
        } else {
          await insertTableusersBranshAcceptingcovenant([
            idBrinsh,
            element.id,
            "عضو",
            "true",
          ]);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const UpdateToken = () => {
  return async (req, res) => {
    try {
      const { tokenNew, tokenOld } = req.body;

      const PhoneNumber = req.session.user.PhoneNumber;
      // console.log(tokenNew,tokenOld,'hhhhhhhhhhhh');
      if (!PhoneNumber) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      // console.log(PhoneNumber) ;
      await UpdateTableLoginActivatytoken(PhoneNumber, tokenNew, tokenOld);

      res.send({ success: "تمت العملية بنجاح" }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(401);
    }
  };
};

// إدخال مشاريع متعددة في صلاحية المستخدم
const InsertmultipleProjecsinvalidity = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      Addusertraffic(
        userSession.userName,
        userSession?.PhoneNumber,
        "InsertmultipleProjecsinvalidity"
      );
      const { ProjectesNew, Validitynew, idBrinsh, PhoneNumber } = req.body;

      const resultusernew = await SELECTTableusersCompanyVerification(
        PhoneNumber
      );
      await DeleteuserBransh(
        resultusernew[0].id,
        idBrinsh,
        "user_id",
        "idBransh",
        "usersProject"
      );
      for (const item of ProjectesNew) {
        await insertTableusersProject([
          idBrinsh,
          item,
          resultusernew[0].id,
          JSON.stringify(Validitynew),
        ]);
      }

      res.status(200).send({ success: "تمت العملية بنجاح" });
    } catch (error) {
      console.error(error);
      res.status(402).send({ success: "فشل تنفيذ العملية" });
    }
  };
};

// BringUpdateuser();

module.exports = {
  userCompanyUpdat,
  UpdatUserCompanyinBrinsh,
  UpdatUserCompanyinBrinshV2,
  DeletUser,
  UpdateToken,
  InsertmultipleProjecsinvalidity,
  userCompanyUpdatdashbord,
};
