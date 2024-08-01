const db = require("./sqlite");
// already
const insertTablecompany = async (data) => {
  let V = true;
  db.serialize(function () {
    db.run(
      `INSERT INTO company (CommercialRegistrationNumber, BuildingNumber, StreetName,NeighborhoodName,PostalCode,City,Country,TaxNumber,NumberOFbranchesAllowed,NumberOFcurrentBranches) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          V = false;
          console.error(err.message);
        } else {
          V = true;
        }
        console.log(`Row with the ID  has been inserted.`);
      }
    );
    // db.close();
  });

  return V;
};
const insertTablecompanySub = async (data) => {
  let V = true;
  db.serialize(function () {
    db.run(
      `INSERT INTO companySub (NumberCompany, NameSub, BranchAddress,Email,PhoneNumber) VALUES (?, ?, ?,?,?)`,
      data,
      function (err) {
        if (err) {
          V = false;
          console.error(err.message);
        } else {
          V = true;
        }
        // console.log(`Row with the ID has been inserted.`);
      }
    );
    // db.close();
  });
  return V;

};
const insertTableuserComppany = (data) => {
  try{
    db.serialize(function () {
      db.run(
        `INSERT INTO usersCompany (IDCompany,userName,IDNumber,PhoneNumber,image,job) VALUES (?,?,?,?,?,?)`,
        data,
        function (err) {
          if (err) {
            console.error(err.message);
          }
          console.log(`Row with the ID  has been inserted.`);
        }
      );
    });
    return true
  }catch(err){
    console.log(err)
    return false
  }
};
const insertTableLoginActivaty = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO LoginActivaty (IDCompany,userName,IDNumber,PhoneNumber,image,DateOFlogin,DateEndLogin,job,Validity,codeVerification) VALUES (?, ?, ?,?,?,?,?,?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Row with the ID  has been inserted.`);
          return true;
        }
      }
    );
  });
};

const insertTableuserComppanySub = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO usersCompanySub (IDuser,IDcompanySub,IDproject,job,Validity) VALUES (?, ?, ?,?,?)`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(`Row with the ID has been inserted.`);
      }
    );
  });
};

const insertTablecompanySubProject = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO companySubprojects (IDcompanySub, Nameproject, Note,TypeOFContract,GuardNumber,LocationProject,ProjectStartdate,Imageproject) VALUES (?,?,?,?,?,?,?,?)`,
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

// Templet************

const insertTablecompanySubProjectStagetemplet = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesTemplet (Type, StageName, Days,OrderBy) VALUES (?, ?,?,?)`,
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
const insertTablecompanySubProjectStageSubtemplet = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesSubTemplet (StageID, StageSubName) VALUES (?, ?)`,
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
// ****^*****^

// STAGE WITH DATA SUB STAGE AND NOTES STAGE AND NOTES SUB STAGE

const insertTablecompanySubProjectStageCUST = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesCUST (StageID, ProjectID, Type,StageName,Days,StartDate,EndDate,OrderBy,Difference) VALUES (?,?,?,?,?,?,?,?,?)`,
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
const insertTablecompanySubProjectStageNotes = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StageNotes (StagHOMID,ProjectID,Type,Note,RecordedBy,countdayDelay,ImageAttachment) VALUES (?, ?,?,?,?,?,?)`,
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
const insertTablecompanySubProjectStagesSub = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StagesSub (StagHOMID, ProjectID, StageSubName) VALUES (?,?,?)`,
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
const insertTablecompanySubProjectStageSubNotes = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO StageSubNotes (StagSubHOMID,StagHOMID,ProjectID,Type,Note,RecordedBy,countdayDelay,ImageAttachment) VALUES (?, ?,?,?,?,?,?,?)`,
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

// ****^***^*****

// المصروف
const insertTablecompanySubProjectexpense = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Expense (CustID, Amount, Data,ClassificationName,Image,InvoiceNo,Taxable,CreatedDate) VALUES (?, ?, ?,?,?,?,?,?)`,
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

// المقبوض
const insertTablecompanySubProjectREVENUE = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Revenue (CustID, Amount, Data,Bank) VALUES (?, ?, ?,?)`,
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

// المرتجع
const insertTablecompanySubProjectReturned = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Returns (CustID, Amount, Data) VALUES (?, ?, ?)`,
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

// الارشيف**********************
const insertTablecompanySubProjectarchivesFolder = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Archives (CustID, FolderName) VALUES (?, ?)`,
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
const insertTablecompanySubProjectarchivesfile = (data, ID) => {
  db.serialize(function () {
    db.run(
      `UPDATE Archives SET FolderContent =? WHERE ArchivesID=?`,
      [data, ID],
      function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};

//
// اليوميات
// المنشورات

const insertTablePostPublic = (data) => {
  console.log(data)
  db.serialize(function () {
    db.run(
      `INSERT INTO Post (postBy,url,Type,Location,StageID,ProjectID,brunshCommpanyID,CommpanyID) VALUES (?,?,?,?,?,?,?,?)`,
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
      `INSERT INTO Comment (PostId,commentText,userName) VALUES (?,?,?)`,
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
const insertTableLikesPostPublic = (data) => {
  db.serialize(function () {
    db.run(
      `INSERT INTO Likes (PostId,TypeLikes,userName) VALUES (?,?,?)`,
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
        console.log(`Row with the ID ${this.lastID} has been inserted.`);
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
        console.log(`Row with the ID ${this.lastID} has been inserted.`);
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
        console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  });
};
//
module.exports = {
  insertTablecompany,
  insertTablecompanySub,
  insertTablecompanySubProject,
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
  insertTablecompanySubProjectarchivesfile,
  insertTablePostPublic,
  insertTableCommentPostPublic,
  insertTableuserComppany,
  insertTableuserComppanySub,
  insertTableLoginActivaty,
  insertTableChateStage,
  insertTableViewsChateStage,
  insertTableChate,
  insertTableViewsChate,
  insertTableLikesPostPublic,
};
