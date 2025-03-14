const db = require("./sqlite");
// already
const insertTablecompanycompanyRegistration = async (data) => {
  return new Promise((resolve, reject) => {
      db.serialize(function () {
    db.run(
      `INSERT INTO companyRegistration (CommercialRegistrationNumber,NameCompany, BuildingNumber, StreetName,NeighborhoodName,PostalCode,City,Country,TaxNumber,Api,PhoneNumber,userName) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          resolve(false);
          console.error(err.message);
        } else {
          resolve(true);
        }
      }
    );
  });
});
};
const insertTablecompany = async (data) => {
  return new Promise((resolve, reject) => {
      db.serialize(function () {
    db.run(
      `INSERT INTO company (CommercialRegistrationNumber,NameCompany, BuildingNumber, StreetName,NeighborhoodName,PostalCode,City,Country,TaxNumber,Api,NumberOFbranchesAllowed,NumberOFcurrentBranches) VALUES (?,?,?,?,?,?,?,?,?,?,0,0)`,
      data,
      function (err) {
        if (err) {
          resolve(false);
          console.error(err.message);
        } else {
          resolve(true);
        }
      }
    );
  });
});
};
const insertTablecompanySub = async (data) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.run(
        `INSERT INTO companySub (NumberCompany, NameSub, BranchAddress,Email,PhoneNumber) VALUES (?, ?, ?,?,?)`,
        data,
        function (err) {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
          // console.log(`Row with the ID has been inserted.`);
        }
      );
      // db.close();
    });
  });
};
const insertTableLinkevaluation = async (data) => {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.run(
        `INSERT INTO Linkevaluation (IDcompanySub, urlLink) VALUES (?, ?)`,
        data,
        function (err) {
          if (err) {
            resolve(false);
            console.log(err.message);
          } else {
            resolve(true);
          }
          // console.log(`Row with the ID has been inserted.`);
        }
      );
      // db.close();
    });
  });
};
const insertTableuserComppany = (data) => {
  try {
    db.serialize(function () {
      db.run(
        `INSERT INTO usersCompany (IDCompany,userName,IDNumber,PhoneNumber,job,jobdiscrption,jobHOM,Validity) VALUES (?,?,?,?,?,?,?,?)`,
        data,
        function (err) {
          if (err) {
            console.error(err.message);
          }
          // console.log(`Row with the ID  has been inserted.`);
        }
      );
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const insertTableLoginActivaty = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO LoginActivaty (IDCompany,userName,IDNumber,PhoneNumber,image,DateOFlogin,DateEndLogin,job,jobdiscrption,Validity,codeVerification,token) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        } else {
          // console.log(`Row with the ID  has been inserted.`);
          return true;
        }
      }
    );
  });
};

const insertTablecompanySubProject = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO companySubprojects (IDcompanySub, Nameproject, Note,TypeOFContract,GuardNumber,LocationProject,numberBuilding) VALUES (?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectv2 = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO companySubprojects (IDcompanySub, Nameproject, Note,TypeOFContract,GuardNumber,LocationProject,numberBuilding,Referencenumber) VALUES (?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// Templet************

const insertTablecompanySubProjectStagetemplet = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesTemplet (StageID,Type, StageName, Days,OrderBy) VALUES (?,?, ?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectStageSubtemplet = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesSubTemplet (StageID, StageSubName) VALUES (?, ?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
// ****^*****^

// STAGE WITH DATA SUB STAGE AND NOTES STAGE AND NOTES SUB STAGE

const insertTablecompanySubProjectStageCUST = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesCUST (StageID, ProjectID, Type,StageName,Days,StartDate,EndDate,OrderBy) VALUES (?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectStageNotes = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StageNotes (StagHOMID,ProjectID,Type,Note,RecordedBy,countdayDelay,ImageAttachment) VALUES (?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectStagesSub = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesSub (StagHOMID, ProjectID, StageSubName) VALUES (?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectStageSubNotes = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StageSubNotes (StagSubHOMID,StagHOMID,ProjectID,Type,Note,RecordedBy,countdayDelay,ImageAttachment) VALUES (?, ?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// ****^***^*****

// المصروف
const insertTablecompanySubProjectexpense = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Expense (projectID, Amount, Data,ClassificationName,Image,InvoiceNo,Taxable) VALUES (?, ?, ?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectexpenseapi = (data) => {
  console.log(data);
  db.serialize(function () {
    db.run(
      `INSERT INTO Expense (Referencenumberfinanc,projectID, Amount, Data,ClassificationName,InvoiceNo,Taxable,Date) VALUES (?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// المقبوض
const insertTablecompanySubProjectREVENUE = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Revenue (projectID, Amount, Data,Bank,Image) VALUES (?,?, ?, ?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectREVENUEapi = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Revenue (Referencenumberfinanc,projectID, Amount, Data,Bank,Date) VALUES (?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// المرتجع
const insertTablecompanySubProjectReturned = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Returns (projectID, Amount, Data,Image) VALUES (?,?, ?, ?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectReturnedapi = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Returns (Referencenumberfinanc,projectID, Amount, Data,Date) VALUES (?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
      }
    );
  });
};






const insertTableSabepdf = (
  data,
  typename = "namefileall",
  typeTotal = "Total"
) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Savepdf (projectID,${typename}, ${typeTotal}) VALUES (?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// الارشيف**********************
const insertTablecompanySubProjectarchivesFolder = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Archives (ProjectID, FolderName) VALUES (?, ?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTablecompanySubProjectarchivesFolderforcreatproject = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Archives (ProjectID, FolderName,ActivationHome,Activationchildren) VALUES (?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// ******************************************
// ****************الطلبيات ****************

const insertTablecompanySubProjectRequestsForcreatOrder = async (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Requests (ProjectID,Type, Data,InsertBy,Image,DateTime) VALUES (?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// اليوميات
// المنشورات

const insertTablePostPublic = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Post (postBy,url,Type,Data,timeminet,StageID,ProjectID,brunshCommpanyID,CommpanyID) VALUES (?,?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
// platforms: {
//   ios: {
//     project: './platforms/ios/SQLite.xcodeproj'
//   },
//   android: {
//     sourceDir: './platforms/android'
//   },
//   windows: {
//     sourceDir: './platforms/windows',
//     solutionFile: 'SQLitePlugin.sln',
//     projects: [
//       {
//       projectFile: 'SQLitePlugin/SQLitePlugin.vcxproj',
//       directDependency: true,
//       }
//     ],
//   }
// }
const insertTableCommentPostPublic = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Comment (PostId,commentText,Date,userName) VALUES (?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTableLikesPostPublic = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Likes (PostId,userName) VALUES (?,?)`,
      data,
      function (err) {
        if (err) {
          console.log(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

// دردشة المراحل
const insertTableChateStage = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO ChatSTAGE (idSendr,StageID, ProjectID, Sender,message,timeminet,File,Reply) VALUES (?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTableViewsChateStage = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO ViewsCHATSTAGE (chatID, userName) VALUES (?,?)`,
      data,
      function (err) {
        if (err) {
          console.log(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
// دردشة المشروع مالية وطلبات
const insertTableChate = (data) => {
  // console.log(data)
  db.serialize(function () {
    db.run(
      `INSERT INTO Chat (idSendr,Type, ProjectID, Sender,message,timeminet,File,Reply) VALUES (?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTableViewsChate = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Views (chatID, userName) VALUES (?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTableNavigation = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Navigation (IDCompanySub,ProjectID,notification,tokens,data,Date) VALUES (?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.log(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
const insertTableProjectdataforchat = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Projectdataforchat (ProjectID,Nameproject,PhoneNumber,Disabled) VALUES (?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.log(err.message);
        }
        // console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

//  عمليات طلبات العهد

const insertTableFinancialCustody = (data) => {
  try {
    db.serialize(function () {
      db.run(
        "INSERT INTO FinancialCustody (idOrder,IDCompany,IDCompanySub,Requestby,Amount,Statement) VALUES (?,?,?,?,?,?)",
        data,
        function (err) {
          if (err) {
            console.log(err.message);
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

//
module.exports = {
  insertTablecompany,
  insertTablecompanySub,
  insertTablecompanySubProject,
  insertTablecompanySubProjectv2,
  insertTablecompanySubProjectStagetemplet,
  insertTablecompanySubProjectStageSubtemplet,
  insertTablecompanySubProjectStageNotes,
  insertTablecompanySubProjectStageSubNotes,
  insertTablecompanySubProjectStagesSub,
  insertTablecompanySubProjectStageCUST,
  insertTablecompanySubProjectReturned,
  insertTablecompanySubProjectREVENUE,
  insertTablecompanySubProjectexpense,
  insertTablecompanySubProjectarchivesFolder,
  insertTablePostPublic,
  insertTableCommentPostPublic,
  insertTableuserComppany,
  insertTableLoginActivaty,
  insertTableChateStage,
  insertTableViewsChateStage,
  insertTableChate,
  insertTableViewsChate,
  insertTableLikesPostPublic,
  insertTablecompanySubProjectarchivesFolderforcreatproject,
  insertTableSabepdf,
  insertTablecompanySubProjectRequestsForcreatOrder,
  insertTableNavigation,
  insertTableLinkevaluation,
  insertTableProjectdataforchat,
  insertTableFinancialCustody,
  insertTablecompanySubProjectexpenseapi,
  insertTablecompanySubProjectREVENUEapi,
  insertTablecompanySubProjectReturnedapi,insertTablecompanycompanyRegistration

};
