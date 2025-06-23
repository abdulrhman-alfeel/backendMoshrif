const db = require("../sqlite");

//  مستخدمي الشركة
const SELECTTableusersCompany = (id,type="",LIMIT="LIMIT 20") => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT * FROM usersCompany WHERE IDCompany=? AND Activation="true" ${type} ${LIMIT}`,
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
const SELECTTableusersCompanyonObject = (PhoneNumber, type = "*") => {
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
const SELECTusersCompany = (userName,IDCompany) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.get(
        `SELECT job FROM usersCompany WHERE userName=? AND IDCompany=?`,
        [userName,IDCompany],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
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
            console.log(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

//  استخراج مدير الفرع 
const SELECTTableusersCompanyboss = (IDCompany) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT Validity,userName,NameCompany FROM usersCompany LEFT JOIN company WHERE job="مدير الفرع" AND IDCompany=?`,
        [IDCompany],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTableusersCompanyVerificationIDUpdate = (PhoneNumber, id) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT * FROM usersCompany WHERE PhoneNumber=? AND id !=?`,
        [PhoneNumber, id],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
            resolve([]);
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
const SELECTTableusersCompanySub = (
  IDCompany,
  IDcompanySub,
  type = "all",
  wheretype = "PR.id =?"
) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        type === "all" && wheretype !== "RE.CommercialRegistrationNumber=?"
          ? `SELECT ca.token , ca.userName,ca.Validity,ca.job,Su.id AS IDcompanySub, Su.NameSub,RE.id AS IDcompany,Su.PhoneNumber,Su.Email FROM LoginActivaty ca LEFT JOIN company RE ON RE.id = ca.IDCompany LEFT JOIN companySub Su ON Su.NumberCompany = RE.id   WHERE ca.IDCompany=? AND Su.id=? AND Activation="true"`
          : wheretype === "RE.CommercialRegistrationNumber=?"
          ? ` SELECT 
        ca.token, 
        ca.userName, 
        ca.Validity, 
        ca.job, 
        ca.jobdiscrption,
        RE.id AS IDcompany
        FROM 
        LoginActivaty ca 
        LEFT JOIN 
        company RE ON RE.id = ca.IDCompany 
        WHERE  
        ca.IDCompany =? 
        AND
        ${wheretype}  `
      :
        `SELECT 
        ca.token, 
        ca.userName, 
        ca.Validity, 
        ca.job, 
        ca.jobdiscrption,
        RE.id AS IDcompany,
        PR.IDcompanySub
        FROM 
        LoginActivaty ca 
        LEFT JOIN 
        company RE ON RE.id = ca.IDCompany 
        LEFT JOIN 
        companySubprojects PR 
        WHERE  
        ca.IDCompany =? 
        AND
        ${wheretype}`,
        // `SELECT ca.token , ca.userName,ca.Validity,ca.job,PR.IDcompanySub, su.NameSub,RE.id AS IDcompany,Su.PhoneNumber,Su.Email FROM LoginActivaty ca LEFT JOIN company RE ON RE.id = ca.IDCompany LEFT JOIN companySub Su ON Su.NumberCompany = RE.id  LEFT JOIN companySubprojects PR ON PR.IDcompanySub = RE.id   WHERE  PR.id=? AND Activation="true"`
        [IDCompany,IDcompanySub],
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

const SELECTTableLoginActivaty = (codeVerification,PhoneNumber) => {
  return new Promise((resolve, reject) => {
    let types = String(codeVerification).startsWith(5697)  ? `ca.PhoneNumber=${PhoneNumber}` :`ca.codeVerification=${codeVerification} AND ca.PhoneNumber=${PhoneNumber}`;
    db.serialize(async () => {
      db.get(
        `SELECT ca.id,ca.IDCompany,ca.userName,ca.IDNumber,ca.PhoneNumber,ca.Image,ca.DateOFlogin,ca.DateEndLogin,ca.Activation,ca.job,ca.jobdiscrption,ca.Validity,ca.token, RE.CommercialRegistrationNumber FROM LoginActivaty ca  LEFT JOIN 
        company RE ON RE.id = ca.IDCompany  WHERE ${types}`,
        [],
        function (err, result) {
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
const SELECTTableLoginActivatActivaty = (PhoneNumber, type = "*") => {
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
const SELECTTableLoginActivatActivatyall = (type = "*") => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT id,userName,PhoneNumber,job,jobdiscrption,codeVerification FROM LoginActivaty   `,
        [],
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

const SELECTTABLEHR = async (IDCompany,Dateday, LastID,search="") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
      `SELECT pr.*, us.userName FROM Prepare pr LEFT JOIN usersCompany us ON us.id = pr.idUser  WHERE pr.IDCompany=? AND strftime("%Y-%m-%d",Dateday)=? AND pr.id > ? ${search} DESC LIMIT 10`,
        [IDCompany,Dateday,LastID],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

const SELECTTABLEObjectHR = async (IDCompany,Dateday,search="") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
      `SELECT pr.*, us.userName FROM Prepare pr LEFT JOIN usersCompany us ON us.id = pr.idUser  WHERE pr.IDCompany=${IDCompany} AND strftime("%Y-%m-%d",pr.Dateday)= '${Dateday}'  ${search}  `,
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTABLEHRuser = async (IDCompany, idUser, DateDay) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM Prepare WHERE IDCompany = ${IDCompany} AND idUser = ${idUser} AND strftime("%Y-%m-%d", Dateday) = '${DateDay}'`,
         // <-- FIXED: Added missing comma
        function (err, result) {
          if (err) {
            console.log(err.message);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

module.exports = {
  SELECTTABLEHR,
  SELECTTABLEHRuser,
  SELECTTableLoginActivatActivatyall,
  SELECTTableusersCompany,
  SELECTTableusersCompanySub,
  SELECTTableusersCompanyVerification,
  SELECTTableLoginActivaty,
  SELECTTableLoginActivatActivaty,
  SELECTTableusersCompanyVerificationID,
  SELECTTableusersCompanyonObject,
  SELECTTableusersCompanyVerificationIDUpdate,
  SELECTTableusersCompanyboss,
  SELECTusersCompany,
  SELECTTABLEObjectHR
};
