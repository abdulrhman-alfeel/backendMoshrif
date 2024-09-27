const db = require("../sqlite");

//  مستخدمي الشركة
const SELECTTableusersCompany = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT * FROM usersCompany WHERE IDCompany=? AND Activation="true"`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};




//  مستخدم الشركة
const SELECTTableusersCompanyonObject = (PhoneNumber,type="*") => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.get(
        `SELECT ${type} FROM usersCompany WHERE PhoneNumber=? AND Activation="true"`,
        [PhoneNumber],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
//  التحقق من دخول المستخدم
const SELECTTableusersCompanyVerification = (PhoneNumber) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT * FROM usersCompany WHERE PhoneNumber=? AND Activation="true"`,
        [PhoneNumber],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTableusersCompanyVerificationID = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT * FROM usersCompany WHERE id=? AND Activation="true"`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};



//  التحقق من صلاحيات المستخدم
const SELECTTableusersCompanySub = (IDcompanySub,type ="all") => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(type === 'all' ? `SELECT ca.token , ca.userName,ca.Validity,ca.job,Su.id AS IDcompanySub, su.NameSub,RE.id AS IDcompany,Su.PhoneNumber,Su.Email FROM LoginActivaty ca LEFT JOIN company RE ON RE.id = ca.IDCompany LEFT JOIN companySub Su ON Su.NumberCompany = RE.id   WHERE  Su.id=? AND Activation="true"`:
        `SELECT ca.token , ca.userName,ca.Validity,ca.job,PR.IDcompanySub, su.NameSub,RE.id AS IDcompany,Su.PhoneNumber,Su.Email FROM LoginActivaty ca LEFT JOIN company RE ON RE.id = ca.IDCompany LEFT JOIN companySub Su ON Su.NumberCompany = RE.id  LEFT JOIN companySubprojects PR ON PR.IDcompanySub = RE.id   WHERE  PR.id=? AND Activation="true"`
        ,[IDcompanySub],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

// التحقق من كود الدخول

const SELECTTableLoginActivaty = (codeVerification) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.get(
        `SELECT * FROM LoginActivaty WHERE codeVerification=${codeVerification} `,
        [],
        function (err, result) {
          // console.log(result);
          if (err) {
            reject(err);
            console.error(err.message);
            resolve(null);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
//  التحقق من انتهاء صلاحية دخول المستخدم
const SELECTTableLoginActivatActivaty = (PhoneNumber,type="*") => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.get(
        `SELECT ${type} FROM LoginActivaty WHERE PhoneNumber=? AND Activation="true"`,
        [PhoneNumber],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

module.exports = {
  SELECTTableusersCompany,
  SELECTTableusersCompanySub,
  SELECTTableusersCompanyVerification,
  SELECTTableLoginActivaty,
  SELECTTableLoginActivatActivaty,
  SELECTTableusersCompanyVerificationID,
  SELECTTableusersCompanyonObject
};
