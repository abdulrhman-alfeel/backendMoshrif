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
} = require("../../sql/selected/selectuser");

const Loginuser =  () => {
  return async (req, res) => {
  const {PhoneNumber,token,code} = req.query;
  // bring data from table user origin
  const result = await SELECTTableusersCompanyVerification(PhoneNumber);
  await DELETETableLoginActivaty([PhoneNumber]);
  // bring validity users from table user table
  //   send operation login to table loginActivaty
  if (result?.length > 0) {
    const output = Math.floor(1000 + Math.random() * 9000);
    let PhoneNumbers = code  ?  `${code}${PhoneNumber}` : PhoneNumber;
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
      result[0]?.Validity,
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
}
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
  if( number.startsWith("+")) {
    return number.replace("+", "");
  }

  if (number.startsWith("5") || number.startsWith("0")) { 
    return `966${number}`
  }
    return number; 
  }

const LoginVerification =  () => {
  return async (req, res) => {
  try {
    const {output,PhoneNumber} = req.query;
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
          Validity: JSON.parse(result.Validity),
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
}
};
const LoginVerificationv2 =  () => {
  return async (req, res) => {
  try {
    const output = req.query.output;
    const PhoneNumber = req.query.PhoneNumber;
    const result = await SELECTTableLoginActivaty(
      output,
      parseInt(PhoneNumber)
    );
    // console.log(result, "user", output);
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
}
};

// التحقق من دخول المستخدم ومعرفة صلاحياته وارسال بيانات حسب الصلاحيات

const BringUserCompany =  () => {
  return async (req, res) => {
  try {
    const {IDCompany,number,kind_request} = req.query;
    let count = number || 0;
    let kindrequest = kind_request === 'all' ? `AND id > ${count}` : `AND userName LIKE '%${kind_request}%'`;
    const result = await SELECTTableusersCompany(IDCompany,kindrequest);
    let array = [];
    for (const pic of result) {
      const validity = JSON.parse(pic.Validity) ?? [];

      const validityextrct = await extractdataValidity(validity);
      array.push({
        id: pic.id,
        userName: pic.userName,
        job: pic.job,
        jobHOM: pic.jobHOM,
        jobdiscrption:pic.jobdiscrption,
        PhoneNumber: pic.PhoneNumber,
        IDNumber: pic.IDNumber,
        image: pic.image,
        Validity: validityextrct,
      });
    }

    res.send({ success: "successfuly", data: array }).status(200);
  } catch (err) {
    console.log(err);
  }
}
};


// جلب بيانات الاعضاء داخل الفرع
const BringUserCompanyinBrinsh =  () => {
  return async (req, res) => {
  try {
    const { IDCompany, idBrinsh, type } = req.query;

    const result = await SELECTTableusersCompany(IDCompany);
    const arrayvalidityuser = [];
    let CountID = 0;

    for (const element of result) {
      const validity = JSON.parse(element.Validity) || [];

      if (validity.length > 0) {
        if (Number(type)) {
          const datanew = await BringUserinProject(
            validity,
            idBrinsh,
            type,
            element
          );
          if (Object.entries(datanew).length > 0) {
            arrayvalidityuser.push(datanew);
          }
        } else {
          const resultdata = validity.find((item) => {
            const isMatchingBranch =
              parseInt(item.idBrinsh) === parseInt(idBrinsh);
            return type === "justuser" || type === "Acceptingcovenant"
              ? isMatchingBranch
              : isMatchingBranch && item.job === type;
          });

          if (resultdata) {
            arrayvalidityuser.push(element);
          }

          if (type !== "مدير الفرع") {
            const Admin = validity.find(
              (item) =>
                parseInt(item.idBrinsh) === parseInt(idBrinsh) &&
                item.job === "مدير الفرع"
            );

            if (Admin) {
              CountID = element.id;
            }
          }
        }
      }
    }

    const responseStatus = arrayvalidityuser.length > 0 ? 200 : 400;
    const responseMessage =
      arrayvalidityuser.length > 0 ? "successfuly" : "notsuccessfuly";

    res.status(responseStatus).send({
      success: responseMessage,
      data: arrayvalidityuser,
      idAdmin: CountID,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: "error", message: "Internal Server Error" });
  }
}
};

// بعد التعديل لعملية جلب بيانات الاعضاء
const BringUserCompanyinv2 =  () => {
  return async (req, res) => {
  try {
    const { IDCompany, idBrinsh, type,number ,kind_request} = req.query;
    let checkGloble = {};
    let arrayvalidityuser = [];
    let bosss;
    let kindrequest = kind_request === 'all' ? `AND id > ${number}` : `AND userName LIKE '%${kind_request}%'`;
    const LIMIT = Number(type) ? "LIMIT 50" : "LIMIT 20";
    const result = await SELECTTableusersCompany(IDCompany,kindrequest,LIMIT);
    let CountID = 0;
    for (const element of result) {
      const validity = JSON.parse(element.Validity) || [];
      if (Number(type)) {
        const { checkGlobleuser, arrayvalidity } = await select_user_project(
          result,
          idBrinsh,
          type
        );
        checkGloble = checkGlobleuser;
        arrayvalidityuser = arrayvalidity;
      } else {
        const { checkGlobleuser, arrayvalidity, boss } =
          await AcceptingcovenantAndbransh(type, result, idBrinsh);
        checkGloble = checkGlobleuser;
        arrayvalidityuser = arrayvalidity;
        bosss = boss;

        if (type !== "مدير الفرع") {
          const Admin = validity.find(
            (item) =>
              parseInt(item.idBrinsh) === parseInt(idBrinsh) &&
              item.job === "مدير الفرع"
          );

          if (Admin) {
            CountID = element.id;
          }
        }
      }
    }
    // const responseStatus = arrayvalidityuser.length > 0 ? 200 : 400;
    const responseMessage =
      arrayvalidityuser.length > 0 ? "successfuly" : "notsuccessfuly";

    res.status(200).send({
      success: responseMessage,
      data: arrayvalidityuser,
      checkGloble: checkGloble,
      idAdmin: CountID,
      boss: bosss,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: "error", message: "Internal Server Error" });
  }
}
};




const select_user_project = async (result, idBrinsh, type) => {
  let checkGlobleuser = {};
  let arrayvalidity = [];

  for (const pic of result) {
    const ValidityHom = JSON.parse(pic?.Validity) || [];

    const findBrinsh = ValidityHom.find(
      (item) => parseInt(item.idBrinsh) === parseInt(idBrinsh)
    );

    if (findBrinsh) {
      const findProject = findBrinsh.project.find(
        (items) => parseInt(items.idProject) === parseInt(type)
      );
      if (findProject) {
        checkGlobleuser[pic.id] = {
          id: pic.id,
          Validity: findProject?.ValidityProject || [],
        };
      }
      const validityextrct = await extractdataValidity(
        JSON.parse(pic?.Validity)
      );

      arrayvalidity.push({
        id: pic.id,
        userName: pic.userName,
        job: pic.job,
        jobHOM: pic.jobHOM,
        jobdiscrption:pic.jobdiscrption,
        PhoneNumber: pic.PhoneNumber,
        IDNumber: pic.IDNumber,
        image: pic.image,
        Validity: validityextrct,
      });
    }
  }

  return { checkGlobleuser, arrayvalidity };
};

const AcceptingcovenantAndbransh = async (kind, result, idBrinsh) => {
  let checkGlobleuser = {};
  let arrayvalidity = [];
  let boss;
  for (const pic of result) {
    let validity = JSON.parse(pic?.Validity) || [];
    const findBrinsh = validity.find((i) => {
      const verfiyBransh = parseInt(i.idBrinsh) === parseInt(idBrinsh);
      return kind === "Acceptingcovenant"
        ? verfiyBransh && i.Acceptingcovenant === true
        : kind === "AdminSub"
        ? verfiyBransh && i.job === "مدير الفرع"
        : verfiyBransh;
    });
    if (findBrinsh) {
      if (
        findBrinsh.job === "مدير الفرع" &&
        parseInt(findBrinsh.idBrinsh) === parseInt(idBrinsh)
      ) {
        boss = pic.id;
      }
      checkGlobleuser = {
        ...checkGlobleuser,
        [pic.id]: {
          id: pic.id,
        },
      };
    }
    const validityextrct = await extractdataValidity(validity);
    arrayvalidity.push({
      id: pic.id,
      userName: pic.userName,
      job: pic.job,
      jobHOM: pic.jobHOM,
      jobdiscrption:pic.jobdiscrption,
      PhoneNumber: pic.PhoneNumber,
      IDNumber: pic.IDNumber,
      image: pic.image,
      Validity: validityextrct,
    });
  }

  return { checkGlobleuser, arrayvalidity, boss };
};

const extractdataValidity = async (validity) => {
  try {
    let array = [];
    for (const pic of validity) {
      const result = await SELECTTableUsernameBrinsh(pic.idBrinsh);
      array.push({
        NameBransh: result?.NameSub,
        job: pic?.job,
        idBrinsh: pic?.idBrinsh,
      });
    }
    return array;
  } catch (error) {
    console.log(error);
  }
};
// استيراد المستخدمين حسب المشروع

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

// لاستخراج مستخدمين المشروع
const BringUserinProject = (Validity, idBrinsh, idProject, element) => {
  let arrayUser = {};
  //      لاخراج  البيانات من داخل حاوية الصلاحيات
  Validity.forEach((pic) => {
    //  للتحقق من وجود المستخدم بداخل الفرع
    if (parseInt(pic.idBrinsh) === parseInt(idBrinsh)) {
      //  للتحقق من وجود تحديد عدد المشاريع
      if (pic?.project.length > 0) {
        const findUserinProject = pic?.project?.find(
          (items) => parseInt(items.idProject) === parseInt(idProject)
        );
        //  للتحقق من وجود ان للمستخدم صلاحية لدخول المشروع
        if (findUserinProject) {
          arrayUser = element;
        }
      } else {
        arrayUser = element;
      }
    }
  });
  return arrayUser;
};

const BringAllLoginActvity =  () => {
  return async (req, res) => {
  const resultall = await SELECTTableLoginActivatActivatyall();
  res.send({ success: "تمت العملية بنجاح", data: resultall }).status(200);
  }
};

// حلب صلاحيات المستخدم داخل الفرع
const BringvalidityuserinBransh =  () => {
  return async (req, res) => {
  try {
    const { PhoneNumber, idBrinsh } = req.query;

    const resultuser = await SELECTTableusersCompanyVerification(PhoneNumber);
    let arrayid = [];

    if (resultuser.length > 0) {
      const validity = JSON.parse(resultuser[0].Validity);

      validity.forEach((pic) => {
        //  للتحقق من وجود المستخدم بداخل الفرع
        if (parseInt(pic.idBrinsh) === parseInt(idBrinsh)) {
          //  للتحقق من وجود تحديد عدد المشاريع
          if (pic?.project.length > 0) {
            arrayid = pic?.project.map((item) => item?.idProject);
          }
        }
      });
    }
    res.send({ success: "تمت العملية بنجاح", data: arrayid }).status(200);
  } catch (error) {
    console.log(error);
  }
}
};

// فحص وجود المستخدم من عدم وجودة
const CheckUserispresentornot =  () => {
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
}
};
module.exports = {
  BringAllLoginActvity,
  Loginuser,
  LoginVerification,
  BringUserCompany,
  BringUserCompanyinBrinsh,
  CheckUserispresentornot,
  LoginVerificationv2,
  BringvalidityuserinBransh,
  verificationSend,
  BringUserCompanyinv2,
};
