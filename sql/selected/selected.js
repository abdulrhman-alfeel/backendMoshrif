const client = require("../../middleware/redis");
const db = require("../sqlite");
// الشركة
const SELECTTablecompany = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(`SELECT * FROM company WHERE id=?`, [id], function (err, result) {
        if (err) {
          reject(err);
          console.error(err.message);
        } else {
          resolve(result);
        }
      });
    });
  });
};

// فروع الشركة
const SELECTTablecompanySub = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM companySub WHERE NumberCompany=?`,
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
// طريقة اخرى لجلب الفروع
const SELECTTablecompanySubAnotherway = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM companySub WHERE id=?`,
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

// مشاريع الفرع
const SELECTTablecompanySubProject = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM companySubprojects WHERE IDcompanySub=?`,
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
// طلب المشاريع حسب صلاحية المستخدم
const SELECTTablecompanySubProjectindividual = (id, IDcompanySub) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM companySubprojects WHERE id=?  AND IDcompanySub=?`,
        [id, IDcompanySub],
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

//  سنبل المراحل والفروع

// المراحل
const SELECTFROMTablecompanysubprojectStageTemplet = (Type) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM StagesTemplet WHERE trim(Type)=trim(?)`,
        [Type],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

// الفروع
const SELECTFROMTablecompanysubprojectStagesubTeplet = (StageID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM StagesSubTemplet WHERE StageID=?`,
        [StageID],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

//
// مراحل المشروع
const SELECTTablecompanySubProjectStageCUST = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM StagesCUST WHERE ProjectID=?`,
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
//  ملاحظات مراحل المشروع
const SELECTTablecompanySubProjectStageNotes = (ProjectID, StageID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM StageNotes WHERE StagHOMID=? AND ProjectID=?`,
        [StageID, ProjectID],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            // console.log(result);
            resolve(result);
          }
        }
      );
    });
  });
};

//  المراحل الفرعية للمراحل الرئيسية في المشروع
const SELECTTablecompanySubProjectStagesSub = (ProjectID, StageID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM StagesSub WHERE StagHOMID=? AND ProjectID=?`,
        [StageID, ProjectID],
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

//  الملاحظات للمراحل الفرعية للمراحل الرئيسية في المشروع
const SELECTTablecompanySubProjectStageSubNotes = (
  ProjectID,
  StageID,
  StagSubHOMID
) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM StageSubNotes WHERE StagSubHOMID=? AND StagHOMID=? AND ProjectID=?`,
        [StagSubHOMID, StageID, ProjectID],
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

//  المصروفات
const SELECTTablecompanySubProjectexpense = (idproject) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Expense WHERE CustID=?`,
        [idproject],
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

//

// المقبوضات
const SELECTTablecompanySubProjectREVENUE = (idproject) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Revenue  WHERE CustID=?`,
        [idproject],
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

//

// المرتجعات
const SELECTTablecompanySubProjectReturned = (idproject) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Returns WHERE CustID=?`,
        [idproject],
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
//

// الارشيف
const SELECTTablecompanySubProjectarchives = (idproject) => {
  // console.log(idproject);
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT ArchivesID,CustID,FolderName,Date FROM Archives WHERE CustID=?`,
        [idproject],
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

//  الارشيف الجلب حسب معرف الجدول
const SELECTTablecompanySubProjectarchivesotherroad = async (ArchivesID) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        `SELECT * FROM Archives WHERE ArchivesID=?`,
        [ArchivesID],
        function (err, rows) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(rows);
          }
          // client.sAdd("Archives", JSON.stringify(rows));
        }
      );
    });
  });
};

//  جلب المنشورات للصفحة العامة
const SELECTTablePostPublic = (count = 10) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Post ORDER BY PostID DESC LIMIT ${count} OFFSET ${
          count + 10
        }`,
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

//  جلب معرف الفرع ومعرف الشركة
const SELECTTableIDcompanytoPost = (projectID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        "SELECT NumberCompany,IDcompanySub FROM companySubprojects INNER JOIN  companySub ON companySub.id = companySubprojects.IDcompanySub WHERE companySubprojects.id =? ",
        [projectID],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
            // console.log(result, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
          }
        }
      );
    });
  });
};
//  جلب تعليقات المنشورات للصفحة العامة
const SELECTTableCommentPostPublic = (PostId) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Comment WHERE PostId =?`,
        [PostId],
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
//  جلب الاعجابات المنشورات للصفحة العامة
const SELECTTableLikesPostPublic = (PostId) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Likes WHERE PostId =?`,
        [PostId],
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
const SELECTTableLikesPostPublicotherroad = (PostId, userName) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Likes WHERE PostId =? AND userName=?`,
        [PostId, userName],
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
//

//  جلب بيانات الشات
const SELECTTableChateStage = (ProjectID, StageID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM ChatSTAGE WHERE ProjectID=? AND StageID =?`,
        [ProjectID, StageID],
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
// معرفة طول الجدول
const SELECTLengthTableChateStage = (ProjectID, StageID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        // 'SELECT COUNT(*) FROM PRAGMA table_info(ChatSTAGE) WHERE ProjectID=? AND StageID =?',
        "SELECT COUNT(*) FROM ChatSTAGE WHERE ProjectID=? AND StageID =?",
        [ProjectID, StageID],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result["COUNT(*)"]);
          }
        }
      );
    });
  });
};
// جلب اخر بيانات في الشات
const SELECTLastTableChateStage = (ProjectID, StageID, count = 1) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM ChatSTAGE  WHERE ProjectID=? AND StageID =? ORDER BY rowid DESC, datetime(timeminet) ASC LIMIT ${count} `,
        [ProjectID, StageID],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result.reverse());
            // console.log(result)
          }
        }
      );
    });
  });
};
// جلب chatiD
const SELECTLastTableChateID = (ProjectID, type, userName) => {
  return new Promise((resolve, reject) => {
    const stringSql = Number(type)
      ? `SELECT chatID FROM ChatSTAGE  WHERE ProjectID=? AND StageID =? AND Sender !=? `
      : `SELECT chatID FROM Chat  WHERE ProjectID=? AND Type =? AND Sender !=? `;
    db.serialize(function () {
      db.all(
        stringSql,
        [ProjectID, type, userName],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result);
            // console.log(result)
          }
        }
      );
    });
  });
};

//  الاستعلام على اسم الشخص ومعرف الرسالة
const SELECTTableViewChateUser = (chatID, userName, type) => {
  return new Promise((resolve, reject) => {
    const stringSql = Number(type)
      ? `SELECT * FROM ViewsCHATSTAGE WHERE chatID=? AND userName=?`
      : `SELECT * FROM Views WHERE chatID=? AND userName=?`;
    db.serialize(function () {
      db.all(stringSql, [chatID, userName], function (err, result) {
        if (err) {
          reject(err);
          resolve(chatID);
          console.log(err.message, "nooooo");
        } else {
          resolve(result);
        }
      });
    });
  });
};
const SELECTLastTableChateStageDontEmpty = (ProjectID, StageID, id) => {
  return new Promise((resolve, reject) => {
    console.log(id,'hhhh')

    db.serialize(function () {
      db.all(
        `SELECT * FROM ChatSTAGE  WHERE ProjectID=? AND StageID =? AND  chatID > ? `,
        [ProjectID, StageID, id],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result.reverse());
            // console.log(result)
          }
        }
      );
    });
  });
};
const SELECTLastTableChateTypeDontEmpty = (ProjectID, StageID, id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Chat  WHERE ProjectID=? AND Type =? AND  chatID > ? `,
        [ProjectID, StageID, id],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result.reverse());
            // console.log(result)
          }
        }
      );
    });
  });
};

const SELECTTableChateStageOtherroad = (idSendr) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM ChatSTAGE WHERE idSendr=?`,
        [idSendr],
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

//  جلب مشاهدات رسائل الشات
const SELECTTableViewChateStage = (chatID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM ViewsCHATSTAGE WHERE chatID=?`,
        [chatID],
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
//  جلب بيانات الشات

const SELECTLengthTableChate = (ProjectID, Type) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        // 'SELECT COUNT(*) FROM PRAGMA table_info(ChatSTAGE) WHERE ProjectID=? AND Type =?',
        "SELECT COUNT(*) FROM Chat WHERE ProjectID=? AND Type =?",
        [ProjectID, Type],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result["COUNT(*)"]);
          }
        }
      );
    });
  });
};
const SELECTTableChate = (ProjectID, Type) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Chat WHERE ProjectID=? AND Type=?`,
        [ProjectID, Type],
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
const SELECTTableChateotherroad = (idSendr) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM Chat WHERE idSendr=?`,
        [idSendr],
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
const SELECTLastTableChate = (ProjectID, Type, count = 1) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Chat  WHERE ProjectID=? AND Type =? ORDER BY rowid DESC, datetime(timeminet) ASC LIMIT ${count} `,
        [ProjectID, Type],
        function (err, result) {
          if (err) {
            reject(err);
            console.error(err.message);
          } else {
            resolve(result.reverse());
            // console.log(result)
          }
        }
      );
    });
  });
};
//  جلب مشاهدات رسائل الشات
const SELECTTableViewChate = (chatID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Views WHERE chatID=?`,
        [chatID],
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
  SELECTTablecompany,
  SELECTTablecompanySub,
  SELECTTablecompanySubProject,
  SELECTTablecompanySubProjectREVENUE,
  SELECTTablecompanySubProjectReturned,
  SELECTTablecompanySubProjectexpense,
  SELECTTablecompanySubProjectarchives,
  SELECTTablePostPublic,
  SELECTTableCommentPostPublic,
  SELECTTableLikesPostPublic,
  SELECTTableLikesPostPublicotherroad,
  SELECTTableChateStage,
  SELECTLengthTableChateStage,
  SELECTLengthTableChate,
  SELECTLastTableChateStage,
  SELECTLastTableChate,
  SELECTTableChateStageOtherroad,
  SELECTTableViewChateStage,
  SELECTTablecompanySubProjectStageCUST,
  SELECTTablecompanySubProjectStageNotes,
  SELECTTablecompanySubProjectStagesSub,
  SELECTTablecompanySubProjectStageSubNotes,
  SELECTTableChate,
  SELECTTableChateotherroad,
  SELECTTableViewChate,
  SELECTTablecompanySubProjectindividual,
  SELECTTablecompanySubAnotherway,
  SELECTTablecompanySubProjectarchivesotherroad,
  SELECTFROMTablecompanysubprojectStageTemplet,
  SELECTFROMTablecompanysubprojectStagesubTeplet,
  SELECTTableIDcompanytoPost,
  SELECTLastTableChateStageDontEmpty,
  SELECTLastTableChateTypeDontEmpty,
  SELECTLastTableChateID,
  SELECTTableViewChateUser,
};
