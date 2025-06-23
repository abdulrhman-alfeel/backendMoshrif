const db = require("./sqlite");
// already


const UpdateMoveingDataBranshtoBrinsh = (fromId,toId,type,typename="IDcompanySub") =>{
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          `UPDATE ${type} SET ${typename}=? WHERE ${typename}=?`,
          [toId,fromId],
          function (err) {
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}



const UpdateTablecompany = (data,type='') => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          `UPDATE company SET NameCompany=?, BuildingNumber=?, StreetName=?,NeighborhoodName=?,PostalCode=?,City=?,Country=?,TaxNumber=?,Cost=? ${type} WHERE id=?`,
          data,
          function (err) {
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const UpdateTablecompanyRegistration = (data) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          `UPDATE companyRegistration SET CommercialRegistrationNumber=?, NameCompany=?, BuildingNumber=?, StreetName=?,NeighborhoodName=?,PostalCode=?,City=?,Country=?,TaxNumber=?,PhoneNumber=?,userName=? ,Api=? WHERE id=?`,
          data,
          function (err) {
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const UpdateTableinnuberOfcurrentBranchescompany = (data,type="NumberOFcurrentBranches") => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          `UPDATE company SET ${type}=? WHERE id=?`,
          data,
          function (err) {
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const UpdateTablecompanySub = (data) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          `UPDATE companySub SET NumberCompany=?, NameSub=?, BranchAddress=?,Email=?,PhoneNumber=? WHERE id=?`,
          data,
          function (err) {
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const UpdateTableLinkevaluation = (data) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          `UPDATE Linkevaluation SET urlLink=? WHERE IDcompanySub=?`,
          data,
          function (err) {
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const UpdateTableuserComppany = (data,type ='job=?') => {
  return new Promise((resolve, reject) => {
    try {
  
      db.serialize(function () {
        db.run(
          `UPDATE usersCompany SET IDCompany=?, userName=?, IDNumber=?,PhoneNumber=?,${type} WHERE id=?`,
          data,
          function (err) {
            // console.log("updatetableusercompany", data);
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const UpdateTableuserComppanyValidity = (data) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          `UPDATE usersCompany SET Validity=? WHERE id=?`,
          data,
          function (err) {
            // console.log("updatetableusercompany", data);
            if (err) {
              console.log(err.message);
              reject(err);
            }
            resolve(true);
            console.log(`Row with the ID  has been inserted.`);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};



const UpdateTablecompanySubProjectapi = (data,type="id") => {

  db.run(
    `UPDATE companySubprojects  SET Nameproject=?, Note=?,GuardNumber=?,LocationProject=?,numberBuilding=? WHERE   IDcompanySub=?  AND  ${type}=?   AND EXISTS (
        SELECT 1
        FROM companySub AS RE
        WHERE 
            RE.id = companySubprojects.IDcompanySub
            AND RE.NumberCompany = ?
    );`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UpdateTablecompanySubProject = (data,type="id") => {
  db.run(
    `UPDATE companySubprojects SET IDcompanySub=?, Nameproject=?, Note=?,TypeOFContract=?,GuardNumber=?,LocationProject=?,numberBuilding=? ,Referencenumber=? WHERE ${type}=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UpdateProjectStartdateinProject = (data) => {
  db.run(
    `UPDATE companySubprojects SET ProjectStartdate=? WHERE id=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UpdateProjectClosorOpen = (data) => {
  db.run(
    `UPDATE companySubprojects SET Disabled=? WHERE id=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

// لاغلاق جميع نشاط المستخدم
const UpdateTableLoginActivaty = (data) => {
  db.serialize(function () {
    db.run(
      `UPDATE LoginActivaty SET Activation="false"  WHERE PhoneNumber=?`,
      data,
      function (err) {
        // console.log(`Row with the ID has been inserted.`);
      }
    );
  });
};
// لاغلاق جميع نشاط المستخدم
const UpdateTableLoginActivatyValidityORtoken = (data, PhoneNumber, type) => {
  db.serialize(function () {
    db.run(
      `UPDATE LoginActivaty SET ${type}=?  WHERE PhoneNumber=?`,
      [data, PhoneNumber],
      function (err) {
        if (err) return console.error(err);
        console.log(`Row with the ID has been upadate.`);
      }
    );
  });
};
const UpdateTableLoginActivatytoken = (PhoneNumber, tokennew, tokenold) => {
  db.serialize(function () {
    db.run(
      `UPDATE LoginActivaty SET token=?  WHERE token=? AND PhoneNumber=?`,
      [tokennew, tokenold, PhoneNumber],
      function (err) {
        if (err) return console.error(err);
        console.log(`Row with the ID has been upadate.`);
      }
    );
  });
};

// Templet************

const UPDATETablecompanySubProjectStagetemplet = (data) => {
  db.run(
    `UPDATE StagesTemplet SET Type=?, StageName=?, Days=?,OrderBy=?,Difference=? WHERE StageID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
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
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
// ****^*****^

// STAGE WITH DATA SUB STAGE AND NOTES STAGE AND NOTES SUB STAGE

const UPDATETablecompanySubProjectStageCUST = (data) => {
  db.run(
    `UPDATE StagesCUST SET StageName=?,Days=? WHERE StageID=? AND ProjectID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
// اغلاق المراحل
const UPDATEStopeProjectStageCUST = (data, kind = "Closed") => {
  console.log(data);
  let sqlString =
    kind === "Closed"
      ? `UPDATE StagesCUST SET CloseDate=?,Difference=?,Done=?, NoteClosed=?,ClosedBy=? WHERE StageID=? AND ProjectID=?`
      : `UPDATE StagesCUST SET CloseDate=?,Difference=?,Done=?,NoteOpen=?,OpenBy=? WHERE StageID=? AND ProjectID=?`;
  db.run(sqlString, data, function (err) {
    if (err) {
      console.log(err.message);
    }
    console.log(`Row with the ID ${this.lastID} has been inserted.`);
  });
};

const UPDATETablecompanySubProjectStageNotes = (data) => {
  db.run(
    `UPDATE StageNotes SET Type=?,Note=?,RecordedBy=?,countdayDelay=?,ImageAttachment=? WHERE StageNoteID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const UPDATETablecompanySubProjectStagesSub = (data, kind = "Name") => {
  let stringSql =
    kind === "Name"
      ? `UPDATE StagesSub SET StageSubName=? WHERE StageSubID=?`
      : kind === "Note"
      ? `UPDATE StagesSub SET Note=? WHERE StageSubID=?`
      : `UPDATE StagesSub SET closingoperations=?,CloseDate=?, Done=?  WHERE StageSubID=?`;
  db.run(stringSql, data, function (err) {
    if (err) {
      console.log(err.message);
    }
    console.log(`Row with the ID ${this.lastID} has been inserted.`);
  });
};
const UPDATETablecompanySubProjectStageSubNotes = (data) => {
  db.run(
    `UPDATE StageSubNotes  SET Type=?,Note=?,RecordedBy=?,countdayDelay=?,ImageAttachment=? WHERE StagSubHOMID=? AND StagHOMID=? AND ProjectID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

// المصروف
const UPDATETablecompanySubProjectexpense = (data) => {
  db.run(
    `UPDATE Expense SET Amount=?, Data=?,ClassificationName=?,Image=? WHERE Expenseid=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};
const UPDATETablecompanySubProjectexpenseapi = (data) => {

  db.run(
    `UPDATE Expense SET Amount=?, Data=?,ClassificationName=?,Date=?,Taxable=?,InvoiceNo=? WHERE Referencenumberfinanc=? AND EXISTS (
    SELECT 1
    FROM companySubprojects  PR LEFT JOIN companySub RE ON  PR.IDcompanySub = RE.id WHERE RE.NumberCompany=? AND PR.IDcompanySub=?  AND PR.Referencenumber=?
    ) `,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};
const UPDATETablecompanySubProjectexpenseInvoiceNoapi = (data) => {

  db.run(
    `UPDATE Expense SET InvoiceNo=? WHERE Referencenumberfinanc=? AND EXISTS (
    SELECT 1
    FROM companySubprojects  PR LEFT JOIN companySub RE ON  PR.IDcompanySub = RE.id WHERE RE.NumberCompany=? AND PR.IDcompanySub=?  AND PR.Referencenumber=?
    ) `,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};

// المقبوض
const UPDATETablecompanySubProjectREVENUE = (data) => {
  db.run(
    `UPDATE Revenue SET  Amount=?, Data=?,Bank=?,Image=? WHERE RevenueId=? `,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};

const UPDATETablecompanySubProjectREVENUEapi = (data) => {
  db.run(
    `UPDATE Revenue SET  Amount=?, Data=?,Bank=?,Date=? WHERE Referencenumberfinanc=? AND EXISTS (
    SELECT 1
    FROM companySubprojects  PR LEFT JOIN companySub RE ON  PR.IDcompanySub = RE.id WHERE RE.NumberCompany=? AND PR.IDcompanySub=?  AND PR.Referencenumber=?
    )`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};



//  حفظ الملفات 
const UPDATETablecompanySubProjectFinancial = (data,type="Revenue") => {
  db.run(
    `UPDATE ${type} SET  Image=? WHERE Referencenumberfinanc=? AND EXISTS (
    SELECT 1
    FROM companySubprojects  PR LEFT JOIN companySub RE ON  PR.IDcompanySub = RE.id WHERE RE.NumberCompany=? AND PR.IDcompanySub=?  AND PR.Referencenumber=?
    )`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};
// المرتجع
const UPDATETablecompanySubProjectReturned = (data) => {
  db.run(
    `UPDATE Returns SET Amount=?, Data=?,Image=? WHERE  ReturnsId=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};
const UPDATETablecompanySubProjectReturnedapi = (data) => {
  db.run(
    `UPDATE Returns SET Amount=?, Data=?,Date=? WHERE  Referencenumberfinanc=? AND EXISTS (
    SELECT 1
    FROM companySubprojects  PR LEFT JOIN companySub RE ON  PR.IDcompanySub = RE.id WHERE RE.NumberCompany=? AND PR.IDcompanySub=?  AND PR.Referencenumber=?
    )`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};
// حفظ pdf
const UPDATETableSavepdf = (data, typename, type = "Total") => {
  db.run(
    `UPDATE Savepdf SET ${typename}=?, ${type}=?  WHERE  projectID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};

// الارشيف ***************
const UPDATETablecompanySubProjectarchivesFolder = (data) => {
  db.run(
    `UPDATE Archives SET  FolderName=? WHERE ArchivesID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
// الارشيف ***************
const UPDATETablecompanySubProjectarchivesFolderinChildern = (data) => {
  db.run(
    `UPDATE Archives SET children=? WHERE ArchivesID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

//  *********************************************************
//  ************************* الطلبيات *********************

const UPDATETableinRequests = (data) => {
  try {
    db.run(
      `UPDATE Requests SET Type=?,Data=?,InsertBy=?,Image=? WHERE RequestsID=?`,
      data,
      function (err) {
        if (err) {
          console.log(err.message);
        }
        console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const UPDATETableinRequestsDone = (data,type="Done=?,Implementedby=?") => {
  try {
    db.run(
      `UPDATE Requests SET ${type} WHERE RequestsID=?`,
      data,
      function (err) {
        if (err) {
          console.log(err.message);
        }
        console.log(`Row with the ID ${this.lastID} has been inserted.`);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// المنشورات
const UPDATETablePostPublic = (data) => {
  // const data = ["sammy", "blue", 1900];
  db.run(
    `UPDATE Post SET postBy=?,url=?,Type=?,Location=?,StageID=?,ProjectID=?,brunshCommpanyID=?,CommpanyID=? WHERE PostID=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
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
        console.log(err.message);
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
        console.log(err.message);
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
        console.log(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
}
const UPDATETableProjectdataforchat = (data) => {
  db.run(
    `UPDATE Projectdataforchat SET Disabled=? WHERE ProjectID=? AND PhoneNumber=?`,
    data,
    function (err) {
      if (err) {
        console.log(err.message);
      }
      // console.log(`Row with the ID ${this.lastID} has been UPDATEed.`);
    }
  );
};
// Approvingperson=?,ApprovalDate=?,OrderStatus=?
const UPDATETableFinancialCustody = (type,id) => {
  try {
    db.serialize(function () {
      db.run(
        `UPDATE FinancialCustody  SET ${type} WHERE id =${id}`,
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
const UPDATETableprepareOvertimeassignment = (Overtimeassignment,id) => {
  try {
    db.serialize(function () {
      db.run(
        `UPDATE Prepare  SET Overtimeassignment=${Overtimeassignment} WHERE id =${id}`,
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
const UPDATETablecheckPreparation = (checktime,checkfile,id,type1="CheckIntime",type2="CheckInFile",Numberofworkinghours="") => {
  try {
    db.serialize(function () {
      db.run(
        `UPDATE Prepare  SET ${type1}='${checktime}',${type2}=${checkfile} ${Numberofworkinghours}  WHERE id =${id}`,
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

module.exports = {
  UPDATETablecheckPreparation,
  UPDATETableprepareOvertimeassignment,
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
  UPDATETableChateStage,
  UPDATETableChate,
  UpdateTableLoginActivaty,
  UpdateTableinnuberOfcurrentBranchescompany,
  UpdateProjectStartdateinProject,
  UPDATEStopeProjectStageCUST,
  UPDATETablecompanySubProjectarchivesFolderinChildern,
  UPDATETableSavepdf,
  UPDATETableinRequests,
  UPDATETableinRequestsDone,
  UpdateTableLoginActivatyValidityORtoken,
  UpdateTableLoginActivatytoken,
  UpdateTableLinkevaluation,
  UpdateProjectClosorOpen,
  UPDATETableProjectdataforchat,
  UPDATETableFinancialCustody,
  UpdateMoveingDataBranshtoBrinsh,
  UpdateTableuserComppanyValidity,
  UPDATETablecompanySubProjectexpenseapi,
  UPDATETablecompanySubProjectREVENUEapi,
  UPDATETablecompanySubProjectReturnedapi,
  UPDATETablecompanySubProjectFinancial,
  UpdateTablecompanySubProjectapi,
  UpdateTablecompanyRegistration,
  UPDATETablecompanySubProjectexpenseInvoiceNoapi
  
};
