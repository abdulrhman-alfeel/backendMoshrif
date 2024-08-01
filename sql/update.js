const db = require("./sqlite");
// already
const UpdateTablecompany = (data) => {
  db.run(
    `UPDATE company SET CommercialRegistrationNumber=?, BuildingNumber=?, StreetName=?,NeighborhoodName=?,PostalCode=?,City=?,Country=?,TaxNumber=?,Email=?,Password=?,PhoneNumber=?,NumberOFbranchesAllowed=?,NumberOFcurrentBranches=? WHERE id=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UpdateTablecompanySub = (data) => {
  db.run(
    `UPDATE companySub SET NumberCompany=?, NameSub=?, BranchAddress=?,Email=?,PhoneNumber=? WHERE id=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

const UpdateTableuserComppany = (data) => {
  db.run(
    `UPDATE usersCompany SET IDCompany=?, userName=?, IDNumber=?,PhoneNumber=?,image=? WHERE id=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UpdateTableuserComppanySub = (data) => {
  db.run(
    `UPDATE usersCompanySub SET IDuser=?, IDcompanySub=?, IDproject=?,job=?,Validity=? WHERE id=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

const UpdateTablecompanySubProject = (data) => {
  db.run(
    `UPDATE companySubprojects SET IDcompanySub=?, Nameproject=?, Note=?,TypeOFContract=?,GuardNumber=?,LocationProject=?,ProjectStartdate=?,Imageproject=? WHERE id=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};



// 


// Templet************

const UPDATETablecompanySubProjectStagetemplet = (data) => {
  db.run(
    `UPDATE StagesTemplet SET Type=?, StageName=?, Days=?,OrderBy=?,Difference=? WHERE StageID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UPDATETablecompanySubProjectStageSubtemplet = (data) => {
  db.run(
    `UPDATE StagesSubTemplet SET StageSubName=? WHERE StageSubID=? `,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
// ****^*****^

// STAGE WITH DATA SUB STAGE AND NOTES STAGE AND NOTES SUB STAGE

const UPDATETablecompanySubProjectStageCUST = (data) => {
  db.run(
    `UPDATE StagesCUST SET Type=?,StageName=?,Days=?,StartDate=?,OrderBy=?,Difference=? WHERE StageID=? AND ProjectID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};



const UPDATETablecompanySubProjectStageNotes = (data) => {
  db.run(
    `UPDATE StageNotes SET Type=?,Note=?,RecordedBy=?,countdayDelay=?,ImageAttachment=? WHERE StageNoteID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UPDATETablecompanySubProjectStagesSub = (data) => {
  db.run(
    `UPDATE StagesSub SET StageSubName=? WHERE StagHOMID=? AND ProjectID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UPDATETablecompanySubProjectStageSubNotes = (data) => {
  db.run(
    `UPDATE StageSubNotes  SET Type=?,Note=?,RecordedBy=?,countdayDelay=?,ImageAttachment=? WHERE StagSubHOMID=? AND StagHOMID=? AND ProjectID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

// ****^***^*****


// المصروف
const UPDATETablecompanySubProjectexpense = (data) => {
  db.run(
    `UPDATE Expense SET Amount=?, Data=?,ClassificationName=?,Image=?,InvoiceNo=?,Taxable=?,CreatedDate=? WHERE Expenseid=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};

// المقبوض
const UPDATETablecompanySubProjectREVENUE = (data) => {
  db.run(
    `UPDATE Revenue SET  Amount=?, Data=?,Bank=? WHERE RevenueId=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};

// المرتجع
const UPDATETablecompanySubProjectReturned = (data) => {
  db.run(
    `UPDATE Returns SET Amount=?, Data=? WHERE  ReturnsId=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};

// الارشيف ***************
const UPDATETablecompanySubProjectarchivesFolder = (data) => {
  db.run(
    `UPDATE Archives SET CustID=?, FolderName=? WHERE ArchivesID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
// 



// المنشورات
const UPDATETablePostPublic = (data) => {
  // const data = ["sammy", "blue", 1900];
  db.run(
    `UPDATE Post SET postBy=?,url=?,Type=?,Location=?,StageID=?,ProjectID=?,brunshCommpanyID=?,CommpanyID=? WHERE PostID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

const UPDATETableCommentPostPublic = (data) => {
  // const data = ["sammy", "blue", 1900];
  db.run(
    `UPDATE Comment SET commentText=? WHERE CommentID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

// 

const UPDATETableChateStage = (data) => {
  db.run(
    `UPDATE ChatSTAGE  SET message=?,File=?,Reply=? WHERE chatID=? `,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};


const UPDATETableChate = (data) => {
  db.run(
    `UPDATE Chat SET message=?, File=?, Reply=? WHERE chatID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};

module.exports = {
  UpdateTablecompany,
  UpdateTablecompanySub,
  UpdateTablecompanySubProject,
  UPDATETablecompanySubProjectStagetemplet,
  UPDATETablecompanySubProjectStageSubtemplet,
  UPDATETablecompanySubProjectStageCUST,
  UPDATETablecompanySubProjectStageNotes,
  UPDATETablecompanySubProjectStagesSub,
  UPDATETablecompanySubProjectStageSubNotes,
  UPDATETablecompanySubProjectexpense,
  UPDATETablecompanySubProjectREVENUE,
  UPDATETablecompanySubProjectReturned,
  UPDATETablecompanySubProjectarchivesFolder,
  UPDATETablePostPublic,
  UPDATETableCommentPostPublic,
  UpdateTableuserComppany,
  UpdateTableuserComppanySub,
  UPDATETableChateStage,
  UPDATETableChate,
};
