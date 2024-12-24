const {
  DeletTableuserComppanyCorssUpdateActivationtoFalse,
} = require("../../sql/delete");
const {
  SELECTTableusersCompanyVerificationID,
  SELECTTableLoginActivatActivaty,
  SELECTTableusersCompanyVerificationIDUpdate,
  SELECTTableusersCompany,
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
      const operation = await UpdateTableuserComppany(
        [
          IDCompany,
          userName,
          IDNumber,
          number,
          job,
          jobdiscrption,
          JSON.stringify(Validity),
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
    // console.log(req.body);
    const idBrinsh = req.body.idBrinsh;
    const type = req.body.type;
    const checkGloblenew = req.body.checkGloblenew;
    const checkGlobleold = req.body.checkGlobleold;
    const kind = req.body.kind;
    // const result = await SELECTTableusersCompany(IDCompany);
    if (kind === "Acceptingcovenant") {
      await Updatchackglobluserinbrinsh(
        idBrinsh,
        kind,
        checkGloblenew,
        checkGlobleold,
        userSession.userName
      );
    } else {
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
        const find = validity.find(
          (item) => parseInt(item.idBrinsh) === parseInt(idBrinsh) && item.job === type
        );
        if(find){
          const deletevalidity = validity.filter(
            (item) => parseInt(item.idBrinsh) !== parseInt(idBrinsh) 
          );
          const chackfromJob = deletevalidity.find(
            (item) => item.job === "مدير الفرع" 
          );
          let job = pic.job;
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
      if (pic?.Validity) {
        const validity = JSON.parse(pic?.Validity);
        const deletevalidity = validity.filter(
          (item) => item.idBrinsh !== idBrinsh
        );
        deletevalidity.push({
          idBrinsh: idBrinsh,
          job: type,
          project: [],
          Acceptingcovenant: false,
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
          // إزالة المستخدم من المشروع
          if (type !== "Acceptingcovenant") {
            deletevalidity = await DeleteUserFromProject(validity, idBrinsh,type);
          } else {
            const { arrayBrinsh } = await AddUserInBrinsh(
              validity,
              idBrinsh,
              false
            );
            deletevalidity = arrayBrinsh;
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
  let newObject = Object.values(
    newvalidy > 0 ? newvalidy : checkGloblenew
  ).filter((key) => key);
  // console.log(newObject, "newvalidyssss");

  for (let index = 0; index < newObject.length; index++) {
    const element = newObject[index];

    // Get result for the current element
    const result = await SELECTTableusersCompanyVerificationID(
      !Number(type) ? element : parseInt(element.id)
    );

    // Iterate through the result array (pic)
    for (const pic of result) {
      let validity = pic?.Validity?.length > 0 ? JSON.parse(pic?.Validity) : [];
      let Booleans = false;
      let arrayBrinshs;
      // console.log(type);

      try {
        if (Number(type)) {
          // If the type is a number, call AddUserInProject
          const { arrayBrinsh, Boolen } = await AddUserInProject(
            validity,
            idBrinsh,
            type,
            element.Validity
          );
          validity = arrayBrinsh;
          Booleans = Boolen;

          // Update user with new permissions
          await AddOrUpdatuser(
            pic.PhoneNumber,
            validity,
            "اضاف لك صلاحيات جديدة",
            userName
          );
        } else {
          // If type is not a number, check if it's not Acceptingcovenant
          if (type !== "Acceptingcovenant") {
            const { arrayBrinsh, Boolen } = await AddUserInBrinsh(
              validity,
              idBrinsh
            );
            arrayBrinshs = arrayBrinsh;
            Booleans = Boolen;
            validity?.push(arrayBrinshs);
          } else {
            // Handle the Acceptingcovenant case
            const { arrayBrinsh, Boolen } = await AddUserInBrinsh(
              validity,
              idBrinsh,
              true
            );
            validity = arrayBrinsh;
            Booleans = Boolen;
          }

          // Push new arrayBrinshs to validity

          // Update user with new branch info
          await AddOrUpdatuser(
            pic.PhoneNumber,
            validity,
            "اضافتك إلى فرع جديد",
            userName
          );
        }

        // If Booleans is true, update the table
        if (Booleans) {
          await UpdateTableuserComppany([
            pic.IDCompany,
            pic.userName,
            pic.IDNumber,
            pic.PhoneNumber,
            pic.job,
            JSON.stringify(validity),
            pic.id,
          ]);
        }
      } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error processing pic:", pic.id, error);
      }
    }
  }
};
// إضافة مستخدم للفرع او تعديل صلاحيته في العهد
const AddUserInBrinsh = (validity, idBrinsh, type = "brinshuser") => {
  let arrayBrinsh = type !== "brinshuser" ? validity : {};
  let Boolen = false;
  try {
    const findValidity = validity.find(
      (item) => parseInt(item.idBrinsh) === parseInt(idBrinsh)
    );
    if (!findValidity) {
      arrayBrinsh = {
        idBrinsh: idBrinsh,
        job: "عضو",
        project: [],
        Acceptingcovenant: false,
      };
      Boolen = true;
    } else if (findValidity && type !== "brinshuser") {
      const Validity = validity.findIndex(
        (item) => parseInt(item.idBrinsh) === parseInt(idBrinsh)
      );

      arrayBrinsh[Validity] = {
        idBrinsh: findValidity.idBrinsh,
        job: findValidity.job,
        project: findValidity.project,
        Acceptingcovenant: type,
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
        Acceptingcovenant: false,
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

// إزالة المستخدم من المشروع
const DeleteUserFromProject = (validity, idBrinsh,type) => {
  let deletevalidity;
  if (Number(type)) {
    let Brinsh = validity.find((item) => item.idBrinsh === idBrinsh);
    Brinsh.project = Brinsh.project.filter((pic) => pic.idProject !== type);

    deletevalidity = validity.filter((item) => item.idBrinsh === idBrinsh);
    deletevalidity.push(Brinsh);
  } else {
    deletevalidity = validity.filter((item) => item.idBrinsh !== idBrinsh);
  }
  return deletevalidity
};

const BringUpdateuser = async () =>{
  try{
   const result = await SELECTTableusersCompany(1);
   result.forEach(async(pic) =>{
    let validity = pic?.Validity?.length > 0 ? JSON.parse(pic?.Validity) : [];
    let arrayValidity=[]
    for (let index = 0; index < validity.length; index++) {
      let element = validity[index];
      element ={
        ...element,
        Acceptingcovenant: false,
      }
      arrayValidity.push(element)
    }
    await UpdateTableuserComppany([
      pic.IDCompany,
      pic.userName,
      pic.IDNumber,
      pic.PhoneNumber,
      pic.job,
      JSON.stringify(arrayValidity),
      pic.id,
    ]);
  })
  }catch(error){console.log(error)}
}

// BringUpdateuser();

module.exports = {
  userCompanyUpdat,
  UpdatUserCompanyinBrinsh,
  DeletUser,
  UpdateToken,
};







