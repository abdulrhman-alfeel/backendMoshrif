const {
  DeletTableuserComppanyCorssUpdateActivationtoFalse,
} = require("../../sql/delete");
const {
  SELECTTableusersCompanyVerificationID,
  SELECTTableLoginActivatActivaty,
  SELECTTableusersCompanyVerification,
  SELECTTableusersCompanyVerificationIDUpdate,
} = require("../../sql/selected/selectuser");
const {
  UpdateTableuserComppany,
  UpdateTableLoginActivatytoken,
} = require("../../sql/update");
const { AddOrUpdatuser } = require("../notifcation/NotifcationProject");

const userCompanyUpdat = async (req, res) => {
  try {
    // console.log(req.body);
    const IDCompany = req.body.IDCompany;
    const userName = req.body.userName;
    const IDNumber = req.body.IDNumber;
    const PhoneNumber = req.body.PhoneNumber;
    const jobdiscrption = req.body.jobdiscrption;
    // const image = req.file.filename;
    const job = req.body.job;
    const Validity = req.body.Validity;
    const id = req.body.id;
    let number = String(PhoneNumber);

    if (number.startsWith(0)) {
      number = number.slice(1);
    }
    const verificationFinduser =
      await SELECTTableusersCompanyVerificationIDUpdate(number, id);
    if (verificationFinduser.length <= 0) {
      const operation = await UpdateTableuserComppany([
        IDCompany,
        userName,
        IDNumber,
        number,
        job,
        jobdiscrption,
        JSON.stringify(Validity),
        id,
      ],"job=?,jobdiscrption=?");
      res
        .send({
          success: "تمت العملية بنجاح",
        })
        .status(200);
    } else {
      res
        .send({
          success: "الرقم الذي اضفته لمستخدم موجود",
        })
        .status(200);
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

const UpdatUserCompanyinBrinsh = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const idBrinsh = req.body.idBrinsh;
    const type = req.body.type;
    const checkGloblenew = req.body.checkGloblenew;
    const checkGlobleold = req.body.checkGlobleold;
    const kind = req.body.kind;
    // console.log(kind)
    // const result = await SELECTTableusersCompany(IDCompany);

    if (kind === "user") {
      await Updatchackglobluserinbrinsh(
        idBrinsh,
        type,
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
    const result = await SELECTTableusersCompanyVerificationID(
      parseInt(checkGlobleold)
    );
    result.forEach(async (pic) => {
      if (pic?.Validity.length > 0) {
        const validity = JSON.parse(pic?.Validity);
        const deletevalidity = validity.filter(
          (item) => item.idBrinsh !== idBrinsh
        );
        const chackfromJob = deletevalidity.find(
          (item) => item.job === "مدير الفرع"
        );
        let job = pic.job;
        // console.log(chackfromJob,'chakfromjob')
        if (!chackfromJob) {
          job = pic.jobHOM;
          await AddOrUpdatuser(
            pic.PhoneNumber,
            deletevalidity,
            " الغاء وظيفتك كمدير للفرع",
            userName
          );
        }

        const operation = await UpdateTableuserComppany([
          pic.IDCompany,
          pic.userName,
          pic.IDNumber,
          pic.PhoneNumber,
          job,
          JSON.stringify(deletevalidity),
          pic.id,
        ]);
      }
    });
  }

  // تقوم هذه العملية  بجلب بيانات صلاحيات المدير الجديد ثم فلترتها وحذف الفرع من قائمة صلاحياته
  //  ثم يتم ادخال الفرع نفسه باسم صلاحية جديدة
  // ثم يتم تغيير الوظيفة الخاصة فيه إلى مدير فرع
  if (checkGloblenew > 0) {
    //  عملية حذف صلاحية من شخص ما
    const result = await SELECTTableusersCompanyVerificationID(
      parseInt(checkGloblenew)
    );
    result.forEach(async (pic) => {
      if (pic?.Validity.length > 0) {
        const validity = JSON.parse(pic?.Validity);
        const deletevalidity = validity.filter(
          (item) => item.idBrinsh !== idBrinsh
        );
        deletevalidity.push({
          idBrinsh: idBrinsh,
          job: type,
          project: [],
        });
        const operation = await UpdateTableuserComppany([
          pic.IDCompany,
          pic.userName,
          pic.IDNumber,
          pic.PhoneNumber,
          type,
          JSON.stringify(deletevalidity),
          pic.id,
        ]);
        await AddOrUpdatuser(
          pic.PhoneNumber,
          deletevalidity,
          "توكيل لك مهمة مدير فرع",
          userName
        );

        // console.log(deletevalidity, "deletevalidity");
      }
    });
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

  const deletedkeys = Object.keys(checkGlobleold).filter(
    (key) => !Object.keys(checkGloblenew).includes(key)
  );
  //   المحذوف من الاوبجكت القديم
  // console.log(deletedkeys, "deletedkeys");

  // const newvalidy = Object.keys(checkGloblenew).filter(
  //   (key) => !Object.keys(checkGlobleold).includes(key)
  // );
  const newvalidy = Object.keys(checkGloblenew)
    .filter((key) => !Object.keys(checkGlobleold).includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: checkGloblenew[key] }), {});
  //  المضاف الجديد

  // const arraglobleold =  Object.entries(checkGlobleold);

  if (deletedkeys.length > 0) {
    //  عملية حذف صلاحية من شخص ما
    for (let index = 0; index < deletedkeys.length; index++) {
      const element = deletedkeys[index];
      const result = await SELECTTableusersCompanyVerificationID(
        parseInt(element)
      );
      result.forEach(async (pic) => {
        if (pic?.Validity.length > 0) {
          const validity = JSON.parse(pic?.Validity);
          let deletevalidity;
          if (Number(type)) {
            let Brinsh = validity.find((item) => item.idBrinsh === idBrinsh);
            Brinsh.project = Brinsh.project.filter(
              (pic) => pic.idProject !== type
            );

            deletevalidity = validity.filter(
              (item) => item.idBrinsh !== idBrinsh
            );
            deletevalidity.push(Brinsh);
          } else {
            deletevalidity = validity.filter(
              (item) => item.idBrinsh !== idBrinsh
            );
          }
          await AddOrUpdatuser(
            pic.PhoneNumber,
            deletevalidity,
            "ازالة احدى صلاحياتك",
            userName
          );

          const operation = await UpdateTableuserComppany([
            pic.IDCompany,
            pic.userName,
            pic.IDNumber,
            pic.PhoneNumber,
            pic.job,
            JSON.stringify(deletevalidity),
            pic.id,
          ]);
          // console.log(deletevalidity, "deletevalidity");
        }
      });
    }
  }
  let newObject;
  if (newvalidy > 0) {
    newObject = Object.values(newvalidy).filter((key) => key);
  } else {
    newObject = Object.values(checkGloblenew).filter((key) => key);
  }
  // console.log(newObject, "newvalidyssss");

  // عملية اضافة صلاحيات فروع
  for (let index = 0; index < newObject.length; index++) {
    const element = newObject[index];
    const result = await SELECTTableusersCompanyVerificationID(
      parseInt(element.id)
    );
    // console.log(element, "elementtttddddd");
    result.forEach(async (pic) => {
      // if (pic?.Validity?.length > 0) {
      let validity = pic?.Validity?.length > 0 ? JSON.parse(pic?.Validity) : [];
      // console.log(element.Validity, "validityllll");
      let Booleans = false;
      if (Number(type)) {
        const { arrayBrinsh, Boolen } = await AddUserInProject(
          validity,
          idBrinsh,
          type,
          element.Validity
        );
        // console.log(arrayBrinsh[0].project, element.Validity,"hhhhhhhhhhhhhhhhhhows");
        validity = arrayBrinsh;
        Booleans = Boolen;
        await AddOrUpdatuser(
          pic.PhoneNumber,
          validity,
          "اضاف لك صلاحيات جديدة",
          userName
        );
      } else {
        const { arrayBrinsh, Boolen } = await AddUserInBrinsh(
          validity,
          idBrinsh
        );
        // console.log(arrayBrinsh);

        validity?.push(arrayBrinsh);
        Booleans = Boolen;
        await AddOrUpdatuser(
          pic.PhoneNumber,
          validity,
          "اضافتك إلى فرع جديد",
          userName
        );
      }

      if (Booleans) {
        // console.log(validity, "hhhhhhhhhhhhhhh");
        const operation = await UpdateTableuserComppany([
          pic.IDCompany,
          pic.userName,
          pic.IDNumber,
          pic.PhoneNumber,
          pic.job,
          JSON.stringify(validity),
          pic.id,
        ]);
      }
      // }
      // console.log(deletevalidity, "deletevalidity");
    });
  }
};

const AddUserInBrinsh = (validity, idBrinsh) => {
  let arrayBrinsh = {};
  let Boolen = false;
  try {
    const findValidity = validity.find((item) => item.idBrinsh === idBrinsh);
    if (!findValidity) {
      arrayBrinsh = {
        idBrinsh: idBrinsh,
        job: "عضو",
        project: [],
      };
      Boolen = true;
    }
    return { arrayBrinsh, Boolen };
  } catch (err) {
    console.log(err);
  }
};
const AddUserInProject = (validity, idBrinsh, type, Validitynew) => {
  let arrayBrinsh = {};
  let Boolen = false;
  // console.log(validity, "hhhhhhhhhhhhhhh");
  let projectArray = [];
  try {
    const findValidityIndex = validity.findIndex(
      (item) => parseInt(item.idBrinsh) === parseInt(idBrinsh)
    );
    const findValidity = validity.find(
      (item) => parseInt(item.idBrinsh) === parseInt(idBrinsh)
    );
    if (findValidity) {
      projectArray = findValidity.project;
      const findProject = findValidity?.project.find(
        (pic) => parseInt(pic.idProject) === parseInt(type)
      );

      if (!findProject) {
        projectArray.push({
          idProject: type,
          ValidityProject: Validitynew,
        });
      } else {
        findProject && (findProject.ValidityProject = Validitynew);

        projectArray = findValidity.project;
      }
      validity[findValidityIndex].project = projectArray;
      // console.log(findValidity, "mkkkkkkkkkkkkkkkkkkke", projectArray);
      arrayBrinsh = validity;
      Boolen = true;
    } else {
      projectArray.push({
        idProject: type,
        ValidityProject: Validitynew,
      });
      validity?.push({
        idBrinsh: idBrinsh,
        job: "عضو",
        project: projectArray,
      });
      arrayBrinsh = validity;
    }

    return { arrayBrinsh, Boolen };
  } catch (err) {
    console.log(err);
  }
};

const DeletUser = async (req, res) => {
  const id = req.body.id;
  const PhoneNumber = req.body.PhoneNumber;
  try {
    const deletuser = await DeletTableuserComppanyCorssUpdateActivationtoFalse([
      PhoneNumber,
    ]);
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

const UpdateToken = async (req, res) => {
  try {
    const tokenNew = req.body.tokenNew;
    const tokenOld = req.body.tokenOld;

    const PhoneNumber = req.session.user.PhoneNumber;
    // console.log(tokenNew,tokenOld,'hhhhhhhhhhhh');
    if (!PhoneNumber) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    // console.log(PhoneNumber) ;
    await UpdateTableLoginActivatytoken(PhoneNumber, tokenNew, tokenOld);

    const result = await SELECTTableLoginActivatActivaty(
      PhoneNumber,
      "Validity"
    );
    res
      .send({ success: "تمت العملية بنجاح", data: result.Validity })
      .status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(401);
  }
};

module.exports = {
  userCompanyUpdat,
  UpdatUserCompanyinBrinsh,
  DeletUser,
  UpdateToken,
};
