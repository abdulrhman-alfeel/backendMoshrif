const { createTokens } = require("../../middleware/jwt");
const { insertTableLoginActivaty } = require("../../sql/INsertteble");
const {
  SELECTTablecompany,
  SELECTTablecompanySub,
  SELECTTablecompanySubAnotherway,
  SELECTTablecompanySubProjectindividual,
  SELECTTablecompanySubProject,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyVerification,
  SELECTTableusersCompanySub,
  SELECTTableLoginActivaty,
} = require("../../sql/selected/selectuser");

const Loginuser = async (req, res) => {
  const PhoneNumber = req.body.PhoneNumber;
  //    bring data from table user origin
  const result = await SELECTTableusersCompanyVerification(PhoneNumber);
  // console.log(result);

  // bring validity users from table user table
  const users = await SELECTTableusersCompanySub(result[0]?.id);

  let Validity = [];

  if (users && typeof users !== undefined) {
    for (let index = 0; index < users.length; index++) {
      const element = users[index]?.IDproject;
      const responsibility = JSON.parse(users[index]?.Validity);
      Validity.push({
        IDproject: element,
        IDcompanySub: users[index]?.IDcompanySub,
        Validity: responsibility,
      });
    }
  }

  //   send operation login to table loginActivaty
  if (Validity.length > 0) {
    const output = Math.floor(1000 + Math.random() * 9000);
    const data = [
      result[0]?.IDCompany,
      result[0]?.userName,
      result[0]?.IDNumber,
      result[0].PhoneNumber,
      result[0]?.image,
      new Date().toLocaleDateString(),
      new Date().getDay() + 5,
      result[0]?.job,
      JSON.stringify(Validity),
      output,
    ];
    await insertTableLoginActivaty(data);

    res.send({ success: true }).status(200);
  }
};

const LoginVerification = async (req, res) => {
  const output = req.body.output;
  const result = SELECTTableLoginActivaty(output);
  if (result?.length > 0) {
    // create accessToken from data users
    const user = {
      IDCompany: result[0]?.IDCompany,
      userName: result[0]?.userName,
      PhoneNumber: result[0].PhoneNumber,
      job: job[0].job,
    };
    const accessToken = createTokens(user);
    // bring data usres according to validity
    const ObjectData = await verificationfromValidity(result);
    res
      .send({
        success: true,
        accessToken: accessToken,
        Validity: JSON.parse(result[0].Validity),
        data: ObjectData,
      })
      .status(200);
  }
};

// التحقق من دخول المستخدم ومعرفة صلاحياته وارسال بيانات حسب الصلاحيات

const verificationfromValidity = async (result) => {
  let ObjectData;

  let arrayBrinsh = [];
  const dataCompany = await SELECTTablecompany(result[0]?.IDCompany);
  const dataValidity = JSON.parse(result[0]?.Validity);

  switch (result[0]?.job) {
    case "AdminCompany":
      const dataBrinshCompany = await SELECTTablecompanySub(
        result[0]?.IDCompany
      );
      ObjectData = {
        dataCompany: dataCompany,
        dataBrinshCompany: dataBrinshCompany,
        dataBrinshCompanyProject: null,
        type: "AdminCompany",
      };
      return ObjectData;
    case "AdminBrinsh":
      for (let index = 0; index < dataValidity.length; index++) {
        const element = dataValidity[index]?.IDcompanySub;
        const data = await SELECTTablecompanySubAnotherway(element);
        arrayBrinsh.push(data);
      }

      if (arrayBrinsh.length > 1) {
        ObjectData = {
          dataCompany: dataCompany,
          dataBrinshCompany: arrayBrinsh,
          dataBrinshCompanyProject: null,
          type: "AdminBrinsh",
        };
      } else {
        const data = await SELECTTablecompanySubProject(
          dataValidity[index]?.IDcompanySub
        );
        ObjectData = {
          dataCompany: dataCompany,
          dataBrinshCompany: arrayBrinsh,
          dataBrinshCompanyProject: data,
          type: "AdminBrinsh",
        };
      }
      return ObjectData;
    case "RegularUser":
      const arrayProject = [];
      for (let index = 0; index < dataValidity.length; index++) {
        const element = dataValidity[index];
        const data = await SELECTTablecompanySubProjectindividual(
          element?.IDproject,
          element?.IDcompanySub
        );
        arrayProject.push(data);
      }
      ObjectData = {
        dataCompany: dataCompany,
        dataBrinshCompanyProject: arrayProject,
        type: "RegularUser",
      };
      return ObjectData;
  }
};

module.exports = { Loginuser, LoginVerification };
