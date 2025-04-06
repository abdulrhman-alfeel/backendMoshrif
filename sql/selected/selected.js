const db = require("../sqlite");
// الشركة

const SELECTTablecompany = (id, type = "*") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT ${type} FROM company WHERE id=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

const SELECTTablecompanyRegistrationall = (type = "companyRegistration",count=0) => {
  return new Promise((resolve, reject) => {
    let Plus = parseInt(count)  === 0 ? '>' : '<'
    db.serialize(function () {
      db.all(

        `SELECT * FROM ${type} WHERE  id ${Plus} ?  ORDER BY id DESC LIMIT 10`,
        [parseInt(count)],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablecompanyRegistration = (id, type = "*") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT ${type} FROM companyRegistration WHERE id=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablecompanyApi = (id, type = "*") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT ${type} FROM company WHERE Api=?`,
        [id],
        function (err, result) {
          if (err) {

            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

const SELECTTablecompanyName = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT NameCompany,CommercialRegistrationNumber,Country FROM company WHERE id=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SelectVerifycompanyexistence = (CommercialRegistrationNumber,type="company") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM ${type} WHERE CommercialRegistrationNumber=?`,
        [CommercialRegistrationNumber],
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
const SelectVerifycompanyexistencePhonenumber = (PhoneNumber) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM companyRegistration WHERE PhoneNumber=?`,
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

// عدد فروع الشركة
const SELECTTablecompanySubCount = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT COUNT(*) FROM companySub WHERE NumberCompany=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
          // console.log(result, "selecttable");
        }
      );
    });
  });
};

// فروع الشركة
const SELECTTablecompanySub = (id, type = "*") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT ${type} FROM companySub WHERE NumberCompany=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
          // console.log(result, "selecttable");
        }
      );
    });
  });
};
// جلب معرف الفرع
const SELECTTablecompanySubID = (NameSub, NumberCompany) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT id FROM companySub WHERE NameSub=? AND NumberCompany=? `,
        [NameSub, NumberCompany],
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

//  استدعاء اسم الفرع

const SELECTTableUsernameBrinsh = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.get(
        `SELECT NameSub FROM companySub WHERE id=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
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
      db.get(
        `SELECT * FROM companySub WHERE id=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablecompanySubLinkevaluation = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM Linkevaluation WHERE IDcompanySub=?`,
        [id],
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
// `UPDATE Projectdataforchat
// SET ProjectID = subquery.ProjectID,
//     Nameproject = subquery.Nameproject
// FROM
//     (SELECT ca.id AS ProjectID,
//             ca.Nameproject
//      FROM companySubprojects ca
//      LEFT JOIN companySub RE ON RE.id = ca.IDcompanySub
//      WHERE ca.IDcompanySub = 1) AS subquery`



// مشاريع الفرع
const SELECTTablecompanySubProject = (
  id,
  IDfinlty,
  kind = "all",
  Disabled = "true",
  type=""
) => {
  return new Promise((resolve, reject) => {
    let stringSql =
      kind === "all"
        ? `SELECT * 
FROM (
    SELECT 
        ca.id,
        ca.IDcompanySub,
        ca.Nameproject,
        ca.Note,
        ca.TypeOFContract,
        ca.GuardNumber,
        ca.LocationProject,
        ca.ProjectStartdate,
        ca.numberBuilding,
        ca.Contractsigningdate,
        EX.Cost AS ConstCompany,
        Li.urlLink AS Linkevaluation,
        ca.Disabled,
        ca.Referencenumber 
    FROM companySubprojects ca
    LEFT JOIN Linkevaluation Li ON Li.IDcompanySub = ca.IDcompanySub
    LEFT JOIN companySub RE ON RE.id = ca.IDcompanySub
    LEFT JOIN company EX ON EX.id = RE.NumberCompany
    WHERE 
        ca.IDcompanySub = ? AND (ca.id) > ?   AND (ca.Disabled) =?
          ${type}
    ORDER BY ca.id ASC
    LIMIT 10
) AS subquery
ORDER BY id ASC, datetime(Contractsigningdate) ASC`
        : kind === "difference"
        ? `SELECT Contractsigningdate,ProjectStartdate,Nameproject,IDcompanySub,TypeOFContract FROM companySubprojects WHERE id=? AND Disabled =?`
        : kind === "forchat"
        ? `SELECT ca.id AS ProjectID,ca.Nameproject FROM companySubprojects ca  LEFT JOIN companySub RE ON RE.id = ca.IDcompanySub  WHERE  ca.IDcompanySub=? AND ca.Disabled=?  `
        : kind === "forchatAdmin"
        ? `SELECT ca.id AS ProjectID,ca.Nameproject FROM companySubprojects ca  LEFT JOIN companySub RE ON RE.id = ca.IDcompanySub LEFT JOIN company EX ON EX.id = RE.NumberCompany  WHERE RE.NumberCompany=?  AND (ca.Disabled) =? `
        : `SELECT COUNT(*) FROM companySubprojects WHERE IDcompanySub=? AND Disabled =?`;

    let data =
      kind === "all"
        ? [id, IDfinlty, Disabled]
        : [id, Disabled];
    db.serialize(function () {
      db.all(stringSql, data, function (err, result) {
        if (err) {
          reject(err);
          // console.log(err.message);
        } else {
          resolve(result);
        }
      });
    });
  });
};
const SELECTTablecompanySubProjectLast_id = (
  id,
  kind = "all",
  type = "RE.id"
) => {
  return new Promise((resolve, reject) => {
    let stringSql =
      kind === "all"
        ? `SELECT MAX(id) AS last_id,numberBuilding FROM companySubprojects WHERE  Disabled ='true' AND IDcompanySub=?`
        : kind === "max"
        ? `SELECT MAX(ca.id) AS last_id, ca.id,ca.IDcompanySub,ca.Nameproject,ca.Note,ca.TypeOFContract,ca.GuardNumber,ca.LocationProject,ca.ProjectStartdate,ca.Contractsigningdate,ca.Disabled,EX.Cost AS ConstCompany, Li.urlLink AS Linkevaluation FROM companySubprojects ca LEFT JOIN companySub RE ON RE.id = ca.IDcompanySub LEFT JOIN Linkevaluation Li ON Li.IDcompanySub =RE.id LEFT JOIN company EX ON EX.id = RE.NumberCompany  WHERE Disabled ='true' AND ${type}=?`
        : kind === "forchat"
        ? `SELECT ca.id AS ProjectID,ca.Nameproject FROM companySubprojects ca WHERE ca.Disabled="true" AND ca.id=?`
        : `SELECT ca.id,ca.IDcompanySub,ca.Nameproject,ca.Note,ca.TypeOFContract,ca.GuardNumber,ca.LocationProject,ca.ProjectStartdate,ca.numberBuilding,ca.Contractsigningdate,ca.Disabled,EX.Cost AS ConstCompany, Li.urlLink AS Linkevaluation ,ca.Referencenumber FROM companySubprojects ca LEFT JOIN companySub RE ON RE.id = ca.IDcompanySub LEFT JOIN Linkevaluation Li ON Li.IDcompanySub =RE.id LEFT JOIN  company EX ON EX.id = RE.NumberCompany  WHERE Disabled ='true' AND ca.id=?`;
    db.serialize(function () {
      db.get(stringSql, [id], function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result);
        }
      });
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
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
// فلتر المشاريع
const SELECTTablecompanySubProjectFilter = (search, IDcompanySub) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        "SELECT * FROM companySubprojects WHERE Nameproject LIKE '%" +
          search +
          "%' AND IDcompanySub=?",
        [IDcompanySub],
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
// طلب تاريخ المشروع
const SELECTProjectStartdate = (id, kind = "all",type="id") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        kind === "all"
          ? `SELECT ProjectStartdate,Contractsigningdate,Nameproject,numberBuilding,id,IDcompanySub FROM companySubprojects WHERE ${type}=? `
          : "SELECT ca.id,EX.Cost AS ConstCompany FROM companySubprojects ca LEFT JOIN companySub RE ON RE.id = ca.IDcompanySub LEFT JOIN company EX ON EX.id = RE.NumberCompany  WHERE ca.id=?",
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTProjectStartdateapis = (id, idSub) => {

  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(`SELECT ProjectStartdate,Contractsigningdate,Nameproject,numberBuilding,id,IDcompanySub FROM companySubprojects   WHERE Referencenumber=? AND IDcompanySub=? `,
        [id,idSub],
        function (err, result) {

          if (err) {
            
            // console.error(err.message);
            // reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};


// حساب رصيد المشروع
const SELECTSUMAmountandBring = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT 
        ca.Nameproject AS 'Nameproject', 
        COALESCE(RE.total_revenue, 0.00) AS 'TotalRevenue', 
        COALESCE(EX.landers_count, 0.00) AS 'TotalExpense', 
        COALESCE(RT.total_Returns, 0.00) AS 'TotalReturns', 
        COALESCE((COALESCE(RE.total_revenue, 0.00) - COALESCE(EX.landers_count, 0.00) + COALESCE(RT.total_Returns, 0.00)), 0.00) AS 'RemainingBalance'
        FROM companySubprojects ca
        LEFT JOIN (
        SELECT projectID, COALESCE(SUM(Amount), 0.00) AS landers_count
        FROM Expense
        GROUP BY projectID
        ) EX ON EX.projectID = ca.id
        LEFT JOIN (
        SELECT projectID, COALESCE(SUM(Amount), 0.00) AS total_revenue
        FROM Revenue
        GROUP BY projectID
        ) RE ON RE.projectID = ca.id
        LEFT JOIN (
        SELECT projectID, COALESCE(SUM(Amount), 0.00) AS total_Returns
        FROM Returns
        GROUP BY projectID
        ) RT ON RT.projectID = ca.id
        WHERE ca.id =?`,
        [id],
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

// طلب بيانات الشركة والفرع والمشروع
const SELECTdataprojectandbrinshandcompany = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT 
        ca.Nameproject AS 'Nameproject', 
        EX.NameSub AS "NameBranch",
        RE.NameCompany AS "NameCompany",
        EX.Email,EX.PhoneNumber
        FROM companySubprojects ca
        LEFT JOIN (
        SELECT id,NumberCompany,NameSub,Email,PhoneNumber
        FROM companySub
        ) EX ON EX.id = ca.IDcompanySub
        LEFT JOIN (
        SELECT *
        FROM company
        ) RE ON RE.id = EX.NumberCompany
        WHERE ca.id =?`,
        [id],
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
  // console.log(StageID, "helll stageID");
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

// مراحل المشروع
const SELECTTablecompanySubProjectStageCUST = (
  id,
  kind = "all",
  type = "*"
) => {
  let stringSql =
    kind === "all"
      ? `SELECT ${type} FROM StagesCUST cu LEFT JOIN companySubprojects pr ON pr.id = cu.ProjectID  WHERE ProjectID=?`
      : kind === "CountDate"
      ? `SELECT EndDate , StartDate FROM StagesCUST WHERE ProjectID=?`
      : `SELECT * FROM StagesCUST WHERE ProjectID=? AND trim(StageName)=trim(?)`;
  let data = kind === "all" ? [id] : kind === "CountDate" ? [id] : [id, kind];
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(stringSql, data, function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result);
        }
      });
    });
  });
};

// جلب كائن واحد من المراحل
const SELECTTablecompanySubProjectStageCUSTONe = (
  ProjectID,
  StageID,
  kind = "all",
  type = "cu.projectID=?"
) => {
  const stringSql =
    kind === "all"
      ? `SELECT pr.Nameproject,pr.IDcompanySub, cu.StageID,cu.ProjectID,cu.Type,cu.StageName,cu.Days,cu.StartDate,cu.EndDate,cu.CloseDate,cu.OrderBy,cu.Done,cu.OpenBy,cu.NoteOpen,cu.ClosedBy,cu.NoteClosed  FROM StagesCUST cu LEFT JOIN companySubprojects pr ON pr.id = cu.ProjectID WHERE ProjectID=? AND StageID=?`
      : kind === "notifcation"
      ? `SELECT max(cu.StageID) AS StageID,pr.Nameproject,pr.IDcompanySub, cu.ProjectID,cu.Type,cu.StageName,cu.Days,cu.StartDate,cu.EndDate,cu.CloseDate,cu.OrderBy,cu.Done,cu.OpenBy,cu.NoteOpen,cu.ClosedBy,cu.NoteClosed FROM StagesCUST cu LEFT JOIN companySubprojects pr ON pr.id = cu.ProjectID WHERE cu.StageID != 'A1' AND ${type} `
      :`SELECT Done,Days FROM StagesCUST WHERE ProjectID=? AND Done = "true"`;
  const data =
    kind === "all" || kind ===  "cu.projectID=? AND cu.StageID=?"
      ? [ProjectID, StageID]
      : [ProjectID];
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(stringSql, data, function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result);
        }
      });
    });
  });
};

// جلب اجمالي عدد المراحل الرئيسية المغلقة والمفتوحة
const SELECTTablecompanySubProjectStageCUSTCount = (id, kind = "all") => {
  let stringSql =
    kind === "all"
      ? `SELECT COUNT(Type) FROM StagesCUST WHERE ProjectID=?`
      : `SELECT COUNT(Type) FROM StagesCUST WHERE ProjectID=? AND trim(Done)=trim(?)`;
  let data = kind === "all" ? [id] : [id, kind];
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(stringSql, data, function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result);
        }
      });
    });
  });
};
// جلب اجمالي عدد المراحل الفرعية المغلقة والمفتوحة
const SELECTTablecompanySubProjectStageCUSTSubCount = (
  StagHOMID,
  ProjectID,
  kind = "all"
) => {
  let stringSql =
    kind === "all"
      ? `SELECT COUNT(StageSubName) FROM StagesSub WHERE StagHOMID=? AND ProjectID=?`
      : `SELECT COUNT(StageSubName) FROM StagesSub WHERE StagHOMID=? AND ProjectID=? AND trim(Done)=trim(?)`;
  let data =
    kind === "all" ? [StagHOMID, ProjectID] : [StagHOMID, ProjectID, kind];
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(stringSql, data, function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result);
        }
      });
    });
  });
};

// جمع المراحل الفرعية للمشروع ككل
const SELECTTablecompanybrinshStagesSubAll = (ProjectID, kind = "all") => {
  // console.log(ProjectID, kind)
  return new Promise((resolve, reject) => {
    let stringSql =
      kind === "all"
        ? `SELECT COUNT(StageSubName) FROM StagesSub WHERE ProjectID=?`
        : `SELECT COUNT(StageSubName) FROM StagesSub WHERE  ProjectID=? AND Done = ?`;
    let data = kind === "all" ? [ProjectID] : [ProjectID, kind];
    db.serialize(function () {
      db.get(stringSql, data, function (err, result) {
        if (err) {
          reject(err);
          console.log(err.message);
          resolve([]);
        } else {
          resolve(result);
        }
      });
    });
  });
};

// جلب مراحل المشروع حسب تاريخ النهاية والترتيب ومعرف اخر مرحلة في نفس المشروع
const SELECTTablecompanySubProjectStageCUSTAccordingEndDateandStageIDandStartDate =
  (id) => {
    return new Promise((resolve, reject) => {
      db.serialize(function () {
        db.get(
          `SELECT MAX(StageID) AS StageID ,MAX(OrderBy) AS OrderBy,EndDate FROM StagesCUST WHERE ProjectID=? AND  StageID != "A1" `,
          [id],
          function (err, result) {
            if (err) {
              reject(err);
              // console.error(err.message);
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
            // console.error(err.message);
          } else {
            // console.log(result);
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTableStageNotesAllproject = (ProjectID) => {
  return new Promise((resolve, reject) => {

    db.serialize(function () {
      db.all(
        `SELECT countdayDelay,Type,Note,DateNote FROM StageNotes WHERE  ProjectID=?`,
        [ProjectID],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablecompanySubProjectStageNotesOneObject = (
  data,
  type = "sn.StagHOMID=? AND sn.ProjectID=?"
) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT cu.StageName,pr.Nameproject,sn.StageNoteID,sn.StagHOMID,sn.ProjectID,sn.Type,sn.Note,sn.DateNote,sn.RecordedBy,sn.UpdatedDate,sn.countdayDelay,sn.ImageAttachment,pr.IDcompanySub, MAX(sn.StageNoteID) AS last_id  FROM StageNotes sn LEFT JOIN companySubprojects pr ON pr.id = sn.ProjectID LEFT JOIN StagesCUST cu ON cu.StageID = sn.StagHOMID AND cu.ProjectID = sn.ProjectID  WHERE ${type}`,
        data,
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
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
const SELECTTablecompanySubProjectStagesSub = (
  ProjectID,
  StageID,
  kind = "all",
  type = "su.StagHOMID=? AND su.ProjectID=?"
) => {
  return new Promise((resolve, reject) => {
    let stringSql =
      kind === "all"
        ? `SELECT * FROM StagesSub WHERE StagHOMID=? AND ProjectID=?`
        : kind === "accomplished"
        ? `SELECT closingoperations FROM StagesSub WHERE Done="true" AND ProjectID=?`
        : kind === "notification"
        ? `SELECT cu.StageName,pr.Nameproject ,pr.IDcompanySub,su.ProjectID,su.StagHOMID AS StageID, MAX(su.StageSubID) AS StageSubID ,su.StagHOMID,su.ProjectID,su.StageSubName, su.closingoperations,su.Note,su.Done,su.CloseDate FROM StagesSub su LEFT JOIN StagesCUST cu ON cu.ProjectID = su.ProjectID AND cu.StageID = su.StagHOMID LEFT JOIN companySubprojects pr ON pr.id = su.ProjectID  WHERE  ${type}`
        : `SELECT * FROM StagesSub WHERE StagHOMID=? AND ProjectID=? AND trim(StageSubName) = trim(?)`;
    let data =
      kind === "all"
        ? [StageID, ProjectID]
        : kind === "notification" &&
          type !== "su.StagHOMID=? AND su.ProjectID=?"
        ? [ProjectID]
        : kind === "notification" &&
          type === "su.StagHOMID=? AND su.ProjectID=?"
        ? [StageID, ProjectID]
        : kind === "accomplished"
        ? [ProjectID]
        : [StageID, ProjectID, kind];
    db.serialize(function () {
      db.all(stringSql, data, function (err, result) {
        if (err) {
          reject(err);
          console.log(err.message);
          resolve([]);
        } else {
          // console.log(result);
          resolve(result);
        }
      });
    });
  });
};

//  جلب احد المراحل الفرعية
const SELECTTablecompanySubProjectStagesSubSingl = (StageSubID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT StagHOMID,ProjectID, closingoperations,Note,Done,CloseDate FROM StagesSub WHERE StageSubID=?`,
        [StageSubID],
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
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

//  المصروفات
const SELECTTablecompanySubProjectexpense = (idproject, type = "all",lastID=0) => {
  return new Promise((resolve, reject) => {
    let plus = parseInt(lastID) === 0 ? ">" : "<";

    let stringSql =
      type === "all"
        ? "SELECT * FROM Expense WHERE projectID=?  AND Expenseid "+ plus +" '"+ parseInt(lastID) +"' ORDER BY InvoiceNo DESC LIMIT 10"
        :type === "pdf"?  "SELECT * FROM Expense WHERE projectID=? " : `SELECT InvoiceNo FROM Expense WHERE projectID=?`;
    db.serialize(function () {
      db.all(stringSql, [idproject], function (err, result) {
        if (!err) {
          resolve(result);
        }
      });
    });
  });
};
//  للارشيف طلب كائن واحد من المصروفات
const SELECTTablecompanySubProjectexpenseObjectOneforArchif = (
  InvoiceNo,
  projectID,
  type = "all"
) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        type === "all"
          ? `SELECT * FROM Expense WHERE InvoiceNo=? AND projectID=?`
          : `SELECT PR.Nameproject,  MAX(Expenseid) AS Expenseid , projectID ,InvoiceNo,Amount,Date,Data,ClassificationName,Image,Taxable,CreatedDate FROM Expense ex 
          LEFT JOIN companySubprojects PR ON PR.id = ex.projectID 
          LEFT JOIN companySub RE ON RE.id = PR.IDcompanySub
          WHERE InvoiceNo=? AND projectID=?`,
        [InvoiceNo, projectID],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablecompanySubProjectfornotification = (
  projectID,
  type = "Expense"
) => {
  return new Promise((resolve, reject) => {
    let project = type === "RequestsID" ? "ProjectID" : "projectID";
    let projecttype = type === "Requests" ? " ex.projectID" : " ex.ProjectID";

    let SqlString =
      type === "Expense"
        ? ` max(Expenseid) AS Expenseid , projectID,InvoiceNo,Amount, Date,Data,Taxable,CreatedDate FROM Expense`
        : type === "Returns"
        ? ` max(ReturnsId) AS ReturnsId , projectID,Amount,Date,Data,Image FROM Returns`
        : type === "Revenue"
        ? ` max(RevenueId) AS RevenueId, projectID,Amount,Date,Data,Bank,Image FROM Revenue`
        : `max(RequestsID) AS RequestsID, ProjectID AS projectID,Type,Data,Date,InsertBy,Implementedby,Image FROM Requests`;
    db.serialize(function () {
      db.get(
        `SELECT PR.Nameproject,PR.IDcompanySub,${SqlString} ex 
          LEFT JOIN companySubprojects PR ON PR.id = ${projecttype} 
          LEFT JOIN companySub RE ON RE.id = PR.IDcompanySub
          WHERE  ${project}=?`,
        [projectID],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            // console.log(result, "hello");
            resolve(result);
          }
        }
      );
    });
  });
};

const SELECTTablecompanySubProjectfornotificationEdit = (
  id,
  type = "Expense",
  kind = "Expenseid"
) => {
  return new Promise((resolve, reject) => {
    let project = type === "Requests" ? " ex.projectID" : " ex.ProjectID";
    let SqlString =
      type === "Expense"
        ? `  Expenseid ,projectID,InvoiceNo,Amount, Date,Data,Taxable,CreatedDate FROM Expense`
        : type === "Returns"
        ? ` ReturnsId , projectID,Amount,Date,Data,Image FROM Returns`
        : type === "Revenue"
        ? `RevenueId, projectID,Amount,Date,Data,Bank,Image FROM Revenue`
        : `RequestsID, ProjectID AS projectID,Type,Data,Date,InsertBy,Implementedby,Image FROM Requests`;
    db.serialize(function () {
      db.get(
        `SELECT PR.Nameproject,PR.IDcompanySub,${SqlString} ex 
          LEFT JOIN companySubprojects PR ON PR.id = ${project}
          LEFT JOIN companySub RE ON RE.id = PR.IDcompanySub
          WHERE ${kind}=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            // console.log(result, "hello");
            resolve(result);
          }
        }
      );
    });
  });
};

//  طلب كائن واحد من المصروفات
const SELECTTablecompanySubProjectexpenseObjectOne = (ID, kind = "all",type="projectID") => {
  return new Promise((resolve, reject) => {
    let stringSql =
      kind === "all"
        ? `SELECT * FROM Expense WHERE Expenseid=?`
        : `SELECT COUNT(*) FROM Expense WHERE ${type}=?`;
    db.serialize(function () {
      db.get(stringSql, [ID], function (err, result) {
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

// العهد
const SELECTTablecompanySubProjectREVENUE = (idproject,lastID=0,types='all') => {
  return new Promise((resolve, reject) => {
    let plus = parseInt(lastID) === 0 ? '>': "<";
    db.serialize(function () {
      db.all(types === 'pdf'?  'SELECT * FROM Revenue WHERE projectID=? ' :
        "SELECT * FROM Revenue WHERE projectID=?  AND RevenueId "+ plus +" '"+ parseInt(lastID) +"' ORDER BY RevenueId DESC LIMIT 10",
        [idproject],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            // console.log(result);
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablecompanySubProjectREVENUEObjectOne = (RevenueId) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM Revenue  WHERE RevenueId=?`,
        [RevenueId],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

// المرتجعات
const SELECTTablecompanySubProjectReturned = (idproject,lastID=0,types='all') => {
  return new Promise((resolve, reject) => {
    let plus = parseInt(lastID) === 0 ? '>': "<";

    db.serialize(function () {
      db.all(types === 'pdf'?  'SELECT * FROM Returns WHERE projectID=? ' :
        "SELECT * FROM Returns WHERE projectID=?  AND ReturnsId "+ plus +" '"+ parseInt(lastID) +"' ORDER BY ReturnsId DESC LIMIT 10",
        [idproject],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablecompanySubProjectReturnedObjectOne = (idproject) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM Returns WHERE ReturnsId=?`,
        [idproject],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTableFinance = (id, type = "Returns", typeid = "ReturnsId") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM ${type} WHERE ${typeid}=?`,
        [id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTableFinanceapi = (type = "Returns",id,NumberCompany,IDcompanySub,Referencenumber) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM ${type}  fi  LEFT JOIN companySubprojects pr ON pr.id = fi.projectID   LEFT JOIN companySub RE ON RE.id = pr.IDcompanySub  WHERE fi.Referencenumberfinanc=? AND RE.NumberCompany=? AND PR.IDcompanySub=?  AND PR.Referencenumber=?
    `,
        [id,NumberCompany,IDcompanySub,Referencenumber],
        function (err, result) {
          if (err) {
            resolve({});
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
// معرفة بيانات عن اخر عملية حفظ كشف pdf
const SELECTTableSavepdf = (idproject) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT * FROM Savepdf WHERE projectID=?`,
        [idproject],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
            resolve(0);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

// عملية فلتر البحث في المالية
const SELECTSEARCHINFINANCE = (type, projectID, from, to, fromtime, totime) => {
  // console.log(type, projectID, from, to, fromtime, totime);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(
        `SELECT * FROM ${type} WHERE projectID = ? AND Amount BETWEEN ? AND ? AND Date BETWEEN ? AND ?`,
        [projectID, from, to, fromtime, totime],
        (err, rows) => {
          if (err) {
            // console.error("Database query error:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  });
};

// الارشيف
const SELECTTablecompanySubProjectarchives = (idproject) => {
  // console.log(idproject);
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT ArchivesID,ProjectID,FolderName,Date,ActivationHome,Activationchildren FROM Archives WHERE ProjectID=?`,
        [idproject],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
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
      db.get(
        `SELECT children,FolderName FROM Archives WHERE ArchivesID=?`,
        [ArchivesID],
        function (err, rows) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(rows);
          }
          // client.sAdd("Archives", JSON.stringify(rows));
        }
      );
    });
  });
};
// SELECT * FROM Requests WHERE  ProjectID=? AND Type LIKE "%خفيفة%"

//  جلب بيانات الطلبيات
const SELECTallDatafromTableRequests = async (Type, ProjectID) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.all(
        "SELECT * FROM Requests WHERE  ProjectID=? AND Type LIKE '%" +
        Type +
          "%' ",
        [ProjectID],
        function (err, rows) {
          if (err) {
            reject(err);
            console.log(err.message);
            resolve([]);
          } else {
            resolve(rows);
          }
          // client.sAdd("Archives", JSON.stringify(rows));
        }
      );
    });
  });
};
const SELECTDataAndTaketDonefromTableRequests = async (
  RequestsID,
  type = "all"
) => {
  // console.log(type, "hhhhhhhhhhh");
  return new Promise((resolve, reject) => {
    let sqlString =
      type === "all"
        ? `SELECT * FROM Requests WHERE  RequestsID=?`
        : type === "allCount"
        ? `SELECT COUNT(Done) FROM Requests WHERE ProjectID=?`
        : `SELECT COUNT(Done) FROM Requests WHERE Done=? AND  ProjectID=?`;
    let data =
      type === "all" || type === "allCount" ? [RequestsID] : [type, RequestsID];
    db.serialize(async () => {
      db.get(sqlString, data, function (err, rows) {
        // console.log(RequestsID);

        if (err) {
          reject(err);
          console.log(err.message);
          resolve([]);
        } else {
          resolve(rows);
        }
        // client.sAdd("Archives", JSON.stringify(rows));
      });
    });
  });
};
const SELECTallDatafromTableRequestsV2 = async (Type, ProjectID,type="part",Done,lastID,whereAdd) => {
  return new Promise((resolve, reject) => {
  let plus = parseInt(lastID) === 0 ? ">" : "<";
  db.serialize(async () => {
      db.all(
       type === "part"? "SELECT * FROM Requests WHERE  ProjectID=? AND Type LIKE '%" +
        Type +
          "%'  AND Done= '"+ Done +"' AND RequestsID "+ plus +" '"+ parseInt(lastID) +"' ORDER BY RequestsID DESC,datetime(Date) DESC LIMIT 10": "SELECT  RequestsID,Nameproject,ProjectID,Type,Data,Date,Done,InsertBy,Implementedby,Image,checkorderout,DateTime FROM Requests re LEFT JOIN companySubprojects PR ON PR.id = re.ProjectID WHERE PR.IDcompanySub=? AND Type LIKE '%" +
        Type +
          "%'  AND Done='"+ Done +"'  AND RequestsID "+ plus +" '"+ parseInt(lastID) +"' "+whereAdd+"  ORDER BY RequestsID DESC,datetime(Date)  DESC LIMIT 10",
        [ProjectID],
        function (err, rows) {
          if (err) {
            reject(err);
            console.log(err.message);
            resolve([]);
          } else {
            resolve(rows);
          }
          // client.sAdd("Archives", JSON.stringify(rows));
        }
      );
    });
  });
};
const SELECTDataAndTaketDonefromTableRequests2 = async (
  RequestsID,
  type = "part",
  Done, 
  whereAdd
) => {
  return new Promise((resolve, reject) => {
let sqlString =
 type === 'part'? `SELECT COUNT(Done) FROM Requests WHERE Done=? AND  ProjectID=?`:`SELECT COUNT(Done) FROM Requests re LEFT JOIN companySubprojects PR ON PR.id = re.ProjectID WHERE  ${whereAdd} Done=? AND PR.IDcompanySub=? ` ;
    let data =  [Done, RequestsID];
    db.serialize(async () => {
      db.get(sqlString, data, function (err, rows) {
        // console.log(RequestsID);
        if (err) {
          reject(err);
          console.log(err.message);
          resolve([]);
        } else {
          resolve(rows);
        }
        // client.sAdd("Archives", JSON.stringify(rows));
      });
    });
  });
};


// const SELECTDataAndTaketDonefromTableRequests2 = async (
//   RequestsID,
//   type = "all",
//   Done, 

// ) => {
//   // console.log(type, "hhhhhhhhhhh");
//   return new Promise((resolve, reject) => {

//     let sqlString = type === "all"
//     ? `SELECT * FROM Requests WHERE  RequestsID=?`
//     : type === "allCount"
//     ? `SELECT COUNT(Done) FROM Requests WHERE ProjectID=?`
//     :type === 'partCount'? `SELECT COUNT(Done) FROM Requests WHERE Done=? AND  ProjectID=?`:`SELECT COUNT(Done) FROM Requests re LEFT JOIN companySubprojects PR ON PR.id = re.ProjectID WHERE Done=? AND PR.IDcompanySub=? ` ;
//     let data =
//     type === "all" || type === "allCount" ? [RequestsID] : [Done, RequestsID];
//     db.serialize(async () => {
//       db.get(sqlString, data, function (err, rows) {
//         if (err) {
//           reject(err);
//           console.log(err.message);
//           resolve([]);
//         } else {
//           resolve(rows);
//         }
//         // client.sAdd("Archives", JSON.stringify(rows));
//       });
//     });
//   });
// };


// let array = [16,55,56,60,56,54]
// const where = array.reduce((item,r) => `${String(item) + " AND "+ r}`);
// console.log(where);



//  جلب المنشورات للصفحة العامة
const SELECTTablePostPublic = (id, Date, PostID,where ="") => {
  return new Promise((resolve, reject) => {
    let plus = parseInt(PostID) === 0 ? ">" : "<";
    db.serialize(function () {
      db.all(    
        `SELECT * FROM (SELECT PostID,postBy,Date,timeminet,url,Type,Data,StageID,NameCompany,NameSub,Nameproject
          FROM Post ca
          LEFT JOIN company EX ON EX.id = ca.CommpanyID
          LEFT JOIN companySub RE ON RE.id = ca.brunshCommpanyID
          LEFT JOIN companySubprojects PR ON PR.id = ca.ProjectID
          WHERE ca.CommpanyID = ?
          AND Date(ca.Date)=? AND (ca.PostID) ${plus} ? ${where}
          ORDER BY ca.PostID ASC  ) AS subquery ORDER BY PostID DESC,datetime(Date) DESC LIMIT 10`,

        [id, Date, PostID],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            // console.log(result);
            resolve(result);
          }
        }
      );
    });
  });
};

// جلب كائن واحد من المنشورات
const SELECTTablePostPublicOneObject = (PostID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT PostID,postBy,Date,timeminet,url,Type,Data,StageID,NameCompany,NameSub,Nameproject
          FROM Post ca
          LEFT JOIN company EX ON EX.id = ca.CommpanyID
          LEFT JOIN companySub RE ON RE.id = ca.brunshCommpanyID
          LEFT JOIN companySubprojects PR ON PR.id = ca.ProjectID
          WHERE (ca.PostID) = ?`,
        [PostID],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
          } else {
            // console.log(result);
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTablePostPublicSearch = (
  id,
  DateStart,
  DateEnd,
  type,
  nameProject,
  userName,
  branch,
  PostID,
  where=''
) => {
  return new Promise((resolve, reject) => {
    let plus = parseInt(PostID) === 0 ? ">" : "<";

    let SearchSub =
      type === "بحسب المشروع والتاريخ"
        ? "PR.Nameproject"
        : type === "بحسب الفرع"
        ? "RE.NameSub"
        : "ca.postBy";
    let SqlStringOne =
      type === "بحسب المشروع والمستخدم والتاريخ"
        ? `SELECT PostID,postBy,Date,timeminet,url,Type,Data,StageID,NameCompany,NameSub,Nameproject
          FROM Post ca
          LEFT JOIN company EX ON EX.id = ca.CommpanyID
          LEFT JOIN companySub RE ON RE.id = ca.brunshCommpanyID
          LEFT JOIN companySubprojects PR ON PR.id = ca.ProjectID
          WHERE ca.CommpanyID = ?
           AND Date(Date) BETWEEN ? AND ?  AND trim(PR.Nameproject) = trim(?) AND trim(ca.postBy) = trim(?) AND (ca.PostID) ${plus} ?
          ORDER BY ca.PostID ASC  `
        : type === "بحسب التاريخ"
        ? `SELECT PostID,postBy,Date,timeminet,url,Type,Data,StageID,NameCompany,NameSub,Nameproject
          FROM Post ca
          LEFT JOIN company EX ON EX.id = ca.CommpanyID
          LEFT JOIN companySub RE ON RE.id = ca.brunshCommpanyID
          LEFT JOIN companySubprojects PR ON PR.id = ca.ProjectID
          WHERE ca.CommpanyID = ?
           AND Date(Date) BETWEEN ? AND ?   AND (ca.PostID) ${plus} ? ${where}
          ORDER BY ca.PostID ASC  `
        : `SELECT PostID,postBy,Date,timeminet,url,Type,Data,StageID,NameCompany,NameSub,Nameproject
          FROM Post ca
          LEFT JOIN company EX ON EX.id = ca.CommpanyID
          LEFT JOIN companySub RE ON RE.id = ca.brunshCommpanyID
          LEFT JOIN companySubprojects PR ON PR.id = ca.ProjectID
          WHERE ca.CommpanyID = ?
           AND Date(Date) BETWEEN ? AND ?  AND trim(${SearchSub}) = trim(?) AND (ca.PostID) ${plus} ?
          ORDER BY ca.PostID ASC  `;

    let data =
      type === "بحسب التاريخ"
        ? [id, DateStart, DateEnd, PostID]
        : type === "بحسب المشروع والمستخدم والتاريخ"
        ? [id, DateStart, DateEnd, nameProject, userName, PostID]
        : type === "بحسب المشروع والتاريخ"
        ? [id, DateStart, DateEnd, nameProject, PostID]
        : type === "بحسب الفرع"
        ? [id, DateStart, DateEnd, branch, PostID]
        : [id, DateStart, DateEnd, userName, PostID];
    db.serialize(function () {
      db.all(
        `SELECT * FROM (${SqlStringOne}) AS subquery ORDER BY PostID DESC,datetime(Date) DESC LIMIT 10`,
        data,
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            // console.log(result);
            resolve(result);
          }
        }
      );
    });
  });
};

// SELECTTablePostPublicSearch(
//   1,
//   "2024-09-15",
//   "2024-09-16",
//   "بحسب التاريخ",
//   "فلة تجريبية",
//   "احمد العرامي",
//   5
// );
//  جلب معرف الفرع ومعرف الشركة
const SELECTTableIDcompanytoPost = (
  projectID,
  type = "pr.id",
  select = "pr.id"
) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT su.NumberCompany,pr.IDcompanySub,${select} FROM companySubprojects pr INNER JOIN  companySub su ON su.id = pr.IDcompanySub WHERE ${type} =? `,
        [projectID],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
          } else {
            resolve(result);
            // console.log(result, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
          }
        }
      );
    });
  });
};

const SELECTCOUNTCOMMENTANDLIKPOST = (PostID, type = "Comment") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT COUNT(userName) FROM ${type} WHERE PostId =?`,
        [PostID],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

const SELECTDataPrivatPost = (PostID, type = "Comment", idEdit = null) => {
  return new Promise((resolve, reject) => {
    let idString =
      idEdit === null
        ? type === "Likes"
          ? "max(fl.LikesID) AS LikesID"
          : "max(fl.CommentID) AS CommentID"
        : type === "Likes"
        ? "fl.LikesID"
        : "fl.CommentID";

    let Id = idEdit === null ? PostID : idEdit;
    let WhereID = idEdit === null ? "fl.PostId" : "fl.CommentID";
    // console.log(idEdit);

    let SqlString =
      type === "Likes"
        ? `${idString},fl.PostId,fl.Date,fl.userName`
        : `${idString},fl.PostId,fl.CommentText,fl.Date,fl.userName`;
    db.serialize(function () {
      db.get(
        `SELECT po.ProjectID ,po.postBy, ${SqlString} FROM ${type} fl  LEFT JOIN Post po ON po.PostID = fl.PostId  WHERE ${WhereID} =?`,
        [Id],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err);
            resolve({});
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTDataPrivatPostonObject = (PostID) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        // `SELECT po.ProjectID ,po.postBy,COUNT(${WhereID}) FROM ${type} fl  LEFT JOIN Post po ON po.PostID = fl.PostId  WHERE po.PostID =?`,
        `SELECT po.ProjectID ,po.postBy FROM Post po  WHERE po.PostID =?`,
        [PostID],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err);
            resolve({});
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

//  جلب تعليقات المنشورات للصفحة العامة
const SELECTTableCommentPostPublic = (PostId, count) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM (SELECT * FROM Comment co  WHERE co.PostId =? AND (co.CommentID) > ? ORDER BY co.CommentID ASC LIMIT 10) AS subquery ORDER BY CommentID ASC, datetime(Date) ASC `,
        [PostId, count],
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
//  جلب معرف التعليق
const SELECTTableCommentID = (PostId) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT MAX(CommentID),Date FROM Comment WHERE PostId =? `,
        [PostId],
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
            // console.error(err.message);
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
      db.get(
        `SELECT * FROM Likes WHERE PostId =? AND userName=?`,
        [PostId, userName],
        function (err, result) {
          if (err) {
            reject(err);
            console.log(err.message);
            resolve(false);
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
const SELECTTableChateStage = (chatID, StageID) => {
  return new Promise((resolve, reject) => {
    const stringSql = Number(StageID)
      ? `SELECT * FROM ChatSTAGE WHERE  chatID=?`
      : `SELECT * FROM Chat WHERE  chatID=?`;

    db.serialize(function () {
      db.get(stringSql, [chatID], function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result);
        }
      });
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
            // console.error(err.message);
          } else {
            resolve(result["COUNT(*)"]);
          }
        }
      );
    });
  });
};
// جلب اخر بيانات في الشات
const SELECTLastTableChateStage = (
  ProjectID,
  StageID,
  count = 1,
  kind = "all",
  type = "ChatSTAGE"
) => {
  let Type = type === "ChatSTAGE" ? "StageID" : "Type";
  return new Promise((resolve, reject) => {
    let stringSql =
      kind === "all"
        ? `SELECT * FROM ChatSTAGE  WHERE ProjectID=? AND StageID =? ORDER BY rowid DESC, datetime(timeminet) ASC LIMIT ${count} `
        : `SELECT File,Date FROM ${type}  WHERE ProjectID=? AND  ${Type}=? `;

    db.serialize(function () {
      db.all(stringSql, [ProjectID, StageID], function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result.reverse());
          // console.log(result)
        }
      });
    });
  });
};
// جلب chatiD
const SELECTLastTableChateID = (ProjectID, type, userName) => {
  return new Promise((resolve, reject) => {
    const stringSql = Number(type)
      ? `SELECT chatID FROM ChatSTAGE  WHERE ProjectID=? AND StageID =? AND trim(Sender) !=trim(?) `
      : `SELECT chatID FROM Chat  WHERE ProjectID=? AND Type =? AND trim(Sender) !=trim(?) `;
    db.serialize(function () {
      db.all(stringSql, [ProjectID, type, userName], function (err, result) {
        if (err) {
          reject(err);
          // console.error(err.message);
        } else {
          resolve(result);
          // console.log(result)
        }
      });
    });
  });
};

//  الاستعلام على اسم الشخص ومعرف الرسالة
const SELECTTableViewChateUser = (chatID, userName, type) => {
  return new Promise((resolve, reject) => {
    const stringSql = Number(type)
      ? `SELECT * FROM ViewsCHATSTAGE WHERE chatID=? AND trim(userName)=trim(?)`
      : `SELECT * FROM Views WHERE chatID=? AND trim(userName)=trim(?)`;
    db.serialize(function () {
      db.all(stringSql, [chatID, userName], function (err, result) {
        if (err) {
          resolve([]);
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
    db.serialize(function () {
      db.all(
        `SELECT * FROM ChatSTAGE  WHERE ProjectID=? AND StageID =? AND  chatID > ? `,
        [ProjectID, StageID, id],
        function (err, result) {
          if (err) {
            reject(err);
            // console.error(err.message);
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
            // console.error(err.message);
          } else {
            resolve(result.reverse());
            // console.log(result)
          }
        }
      );
    });
  });
};

const SELECTTableChateStageOtherroad = (
  idSendr,
  userName = "",
  type = "idSendr=?",
  table = "ChatSTAGE"
) => {
  return new Promise((resolve, reject) => {
    let data = type === "idSendr=?" ? [idSendr] : [idSendr, userName];
    db.serialize(function () {
      db.get(
        `SELECT * FROM ${table} WHERE ${type}`,
        data,
        function (err, result) {
          if (err) {
            console.log(err.message);
            resolve(false);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

//  معرفة اخر رسائل المستخدم في الدردشة
const SELECTLastmassgeuserinchat = (
  ProjectID,
  StageID,
  userName,
  type = "ChatSTAGE"
) => {
  return new Promise((resolve, reject) => {
    let kind = type === "ChatSTAGE" ? "StageID" : "Type";
    db.serialize(function () {
      db.get(
        `SELECT MAX(chatID) AS  last_id FROM ${type} WHERE ProjectID=? AND ${kind} =? AND Sender=? AND DATE != CURRENT_DATE `,
        [ProjectID, StageID, userName],
        function (err, result) {
          if (err) {
            // reject(err);
            // console.log(err.message);
            resolve(null);
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
            // console.error(err.message);
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
            // console.error(err.message);
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
            // console.error(err.message);
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
            // console.error(err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};
const SELECTTableNavigation = (data,where="DateDay BETWEEN strftime('%Y-%m-01',CURRENT_DATE )  AND CURRENT_DATE " ) => {
  return new Promise((resolve, reject) => {
    let plus = parseInt(data[0]) === 0 ? ">" : "<";

    db.serialize(function () {
      db.all(
        `SELECT * FROM(SELECT * FROM Navigation WHERE id ${plus} ?   AND ${where}  ) AS subquery  ORDER BY id DESC   LIMIT 30 `,
        data,
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
const SELECTTableNavigationObjectOne = (id, type = "max(id) AS id") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        `SELECT ${type} FROM Navigation WHERE IDCompanySub=? AND DateDay BETWEEN strftime('%Y-%m-01',CURRENT_DATE )  AND CURRENT_DATE`,
        [id],
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
const SELECTTableProjectdataforchat = (PhoneNumber, id,disabled="false",type='id') => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT * FROM Projectdataforchat WHERE PhoneNumber=? AND ${type} > ? AND Disabled = ? ORDER BY id ASC LIMIT 10`,
        [PhoneNumber, id,disabled],
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
//  طلب اخر رقم في جدول العهد
const SELECTTableMaxFinancialCustody = async (id,type='max',kindOpreation='*') => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.get(
        type === 'max' ? `SELECT Max(idOrder) AS  last_id FROM FinancialCustody WHERE IDCompanySub=? `: type === 'count'? `SELECT ${kindOpreation} FROM FinancialCustody WHERE IDCompany=? AND OrderStatus="false" AND RejectionStatus="false"`:  `SELECT ${kindOpreation} FROM FinancialCustody WHERE id=? `,
        [id],
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
const SELECTTableFinancialCustody = async (id, type = "") => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.all(
        `SELECT fi.id,fi.idOrder,fi.IDCompany,fi.IDCompanySub,fi.Requestby,fi.Amount,fi.Statement,fi.Date,fi.Approvingperson,fi.ApprovalDate,fi.OrderStatus,fi.RejectionStatus,fi.Reasonforrejection,fi.Dateofrejection,RE.NameSub,us.userName FROM FinancialCustody fi LEFT JOIN companySub RE ON RE.id = fi.IDcompanySub LEFT JOIN usersCompany us ON us.PhoneNumber = fi.Requestby WHERE fi.IDCompany=? AND ${type}  ORDER BY fi.id DESC LIMIT 10`,
        [id],
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

module.exports = {
  SELECTTablecompanyApi,
  SELECTTablecompany,
  SELECTTablecompanyName,
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
  SELECTTablecompanySubID,
  SELECTTablecompanySubCount,
  SELECTTablecompanySubProjectLast_id,
  SELECTTableUsernameBrinsh,
  SELECTSUMAmountandBring,
  SelectVerifycompanyexistence,
  SELECTProjectStartdate,
  SELECTTablecompanySubProjectStageCUSTAccordingEndDateandStageIDandStartDate,
  SELECTTablecompanySubProjectStagesSubSingl,
  SELECTTablecompanySubProjectStageCUSTCount,
  SELECTTablecompanySubProjectStageCUSTSubCount,
  SELECTTablecompanySubProjectStageCUSTONe,
  SELECTTablecompanybrinshStagesSubAll,
  SELECTTablecompanySubProjectexpenseObjectOne,
  SELECTdataprojectandbrinshandcompany,
  SELECTTableSavepdf,
  SELECTTablecompanySubProjectexpenseObjectOneforArchif,
  SELECTSEARCHINFINANCE,
  SELECTTablecompanySubProjectREVENUEObjectOne,
  SELECTTablecompanySubProjectReturnedObjectOne,
  SELECTallDatafromTableRequests,
  SELECTDataAndTaketDonefromTableRequests,
  SELECTCOUNTCOMMENTANDLIKPOST,
  SELECTTableCommentID,
  SELECTTablePostPublicSearch,
  SELECTTablecompanySubProjectStageNotesOneObject,
  SELECTTablecompanySubProjectfornotification,
  SELECTTablecompanySubProjectfornotificationEdit,
  SELECTDataPrivatPost,
  SELECTDataPrivatPostonObject,
  SELECTTableNavigation,
  SELECTTableNavigationObjectOne,
  SELECTTablePostPublicOneObject,
  SELECTTableFinance,
  SELECTTablecompanySubLinkevaluation,
  SELECTTableProjectdataforchat,
  SELECTLastmassgeuserinchat,
  SELECTTablecompanySubProjectFilter,
  SELECTTableMaxFinancialCustody,
  SELECTTableFinancialCustody,
  SELECTallDatafromTableRequestsV2,
  SELECTDataAndTaketDonefromTableRequests2,
  SELECTTableFinanceapi,
  SELECTTablecompanyRegistration,
  SELECTTablecompanyRegistrationall,
  SelectVerifycompanyexistencePhonenumber,
  SELECTProjectStartdateapis,
  SELECTTableStageNotesAllproject
};
