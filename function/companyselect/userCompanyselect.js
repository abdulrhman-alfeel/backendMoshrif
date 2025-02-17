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

const Loginuser = async (req, res) => {
  const PhoneNumber = req.query.PhoneNumber;
  const token = req.query.token;
  //    bring data from table user origin
  // console.log(PhoneNumber, token);
  const result = await SELECTTableusersCompanyVerification(PhoneNumber);
  // console.log(result);
  await DELETETableLoginActivaty([PhoneNumber]);

  // bring validity users from table user table

  //   send operation login to table loginActivaty
  if (result?.length > 0) {
    const output = Math.floor(1000 + Math.random() * 9000);
    // const output = 1234;
    verificationSend(PhoneNumber, output);
    // console.log(output);
    // const currentDate = new Date();
    // const futureDate = new Date(currentDate + 5 * 24 * 60 * 60 * 1000);
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
};
const axios = require("axios");

const verificationSend = (number, chack) => {
  try {
    const url = "https://el.cloud.unifonic.com/rest/Messages/SendBulk";
    const params = {
      AppSid: "ll3noHmCZwsFLD7B6ysdm2Vmhh3U0p",
      SenderID: "Mushrf.com",
      Body: `للدخول لمنصة مشرف استخدم رمز التحقق : ${chack}`,
      // Recipient: `966567256943`,
      Recipient: `966${number}`,
    };

    const headers = {
      accept: "application/json",
    };

    axios
      .post(url, null, { params, headers })
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

const LoginVerification = async (req, res) => {
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
};
const LoginVerificationv2 = async (req, res) => {
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
};

// التحقق من دخول المستخدم ومعرفة صلاحياته وارسال بيانات حسب الصلاحيات

const BringUserCompany = async (req, res) => {
  try {
    const IDCompany = req.query.IDCompany;
    const result = await SELECTTableusersCompany(IDCompany);
    res.send({ success: "successfuly", data: result }).status(200);
  } catch (err) {
    console.log(err);
  }
};
const BringNameCompany = async (req, res) => {
  try {
    const IDCompany = req.query.IDCompany;
    const result = await SELECTTableUsernameBrinsh(IDCompany);
    res.send({ success: "successfuly", data: result }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// جلب بيانات الاعضاء داخل الفرع
const BringUserCompanyinBrinsh = async (req, res) => {
  try {
    const IDCompany = req.query.IDCompany;
    const idBrinsh = req.query.idBrinsh;
    const type = req.query.type;
    let CountID = 0;
    const result = await SELECTTableusersCompany(IDCompany);

    const arrayvalidityuser = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      // console.log(element.Validity)
      const validity = JSON.parse(element.Validity) || [];
      if (validity.length > 0) {
        // console.log(type, "mmmmmmmm");
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
          let resultdata;
          if (type === "justuser" || type === "Acceptingcovenant") {
            resultdata = validity?.find(
              (item) => parseInt(item.idBrinsh) === parseInt(idBrinsh)
            );
          } else {
            resultdata = validity?.find(
              (item) =>
                parseInt(item.idBrinsh) === parseInt(idBrinsh) &&
                item.job === type
            );
          }
          // console.log(resultdata, "hhhhhhhhhhhhhhhhhhhhh");
          if (resultdata) {
            arrayvalidityuser.push(element);
          }

          if (type !== "مدير الفرع") {
            const Admin = validity?.find(
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

  
    if (arrayvalidityuser.length > 0) {
      res
        .send({
          success: "successfuly",
          data: arrayvalidityuser,
          idAdmin: CountID,
        })
        .status(200);
    } else {
      res
        .send({
          success: "notsuccessfuly",
          data: arrayvalidityuser,
          idAdmin: CountID,
        })
        .status(400);
    }
  } catch (err) {
    console.log(err);
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

const BringAllLoginActvity = async (req, res) => {
  const resultall = await SELECTTableLoginActivatActivatyall();
  res.send({ success: "تمت العملية بنجاح", data: resultall }).status(200);
};


// حلب صلاحيات المستخدم داخل الفرع 
const BringvalidityuserinBransh = async(req,res) => {
try{
  const {PhoneNumber,idBrinsh} = req.query;

  const resultuser = await SELECTTableusersCompanyVerification(
    PhoneNumber
  );
  let arrayid= [];

  if(resultuser.length > 0){
    const validity = JSON.parse(resultuser[0].Validity);

    validity.forEach((pic) => {
      //  للتحقق من وجود المستخدم بداخل الفرع
      if (parseInt(pic.idBrinsh) === parseInt(idBrinsh)) {
        //  للتحقق من وجود تحديد عدد المشاريع
        if (pic?.project.length > 0) {
          arrayid = pic?.project.map(item => item?.idProject)
        } 
      }
    });
  }
  res.send({ success: "تمت العملية بنجاح", data: arrayid }).status(200);

}catch(error){
  console.log(error)
}
}


// فحص وجود المستخدم من عدم وجودة 
const CheckUserispresentornot=async(req,res) =>{
  const userSession = req.session.user;
  if (!userSession) {
    res.status(401).send("Invalid session");
    console.log("Invalid session");
  }
  const PhoneNumber = userSession.PhoneNumber;
  const verificationFinduser = await SELECTTableusersCompanyVerification(
    PhoneNumber
  );
  if(verificationFinduser.length <= 0){
    res.status(200).send({success:false})
  }else{
    res.status(200).send({success:true})

  }
}
module.exports = {
  BringAllLoginActvity,
  Loginuser,
  LoginVerification,
  BringUserCompany,
  BringUserCompanyinBrinsh,
  BringNameCompany,
  CheckUserispresentornot,
  LoginVerificationv2,
  BringvalidityuserinBransh
};
