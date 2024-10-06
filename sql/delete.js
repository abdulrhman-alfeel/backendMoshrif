const db = require("./sqlite");

const DeleteTablecompany = () => {};
const DeleteTablecompanySub = () => {};
const DeleteTablecompanySubProject = () => {};
const DeleteTablecompanySubProjectphase = (id) => {
  db.run(`DELETE FROM  StagesCUST WHERE ProjectID=?`, [id], function (err) {
    if (err) {
      console.error(err.message);
    }
    // console.log(`Row with the ID ${this.lastID} has been inserted.`);
  });
};

const DeleteTablecompanySubProjectCovenant = () => {};
const DeleteTablecompanySubProjectReturned = () => {};
const DeleteTableNotifcation = () => {
  db.serialize(function () {
    db.run(
      `DELETE FROM Navigation  WHERE DateDay < CURRENT_DATE`,
      function (err) {
        // console.log(`Row with the ID has been inserted.`);
      }
    );
  });
};

const DELETETableLoginActivaty = (data) => {
  db.serialize(function () {
    db.run(
      `DELETE FROM LoginActivaty  WHERE PhoneNumber=?`,
      data,
      function (err) {
        // console.log(`Row with the ID has been inserted.`);
      }
    );
  });
};
const DeleteTablecompanySubProjectarchives = (id) => {
  console.log(id);
  db.run(`DELETE FROM Archives WHERE ArchivesID=?`, [id], function (err) {
    if (err) {
      console.error(err);
    }
    // console.log(`Row with the ID ${this.lastID} has been inserted.`);
  });
};
const sqlDropOldTable = (tableName) => {
  const sqlDropOldTable = `DROP TABLE ${tableName};`;
  db.serialize(() => {
    // Create a temporary table with the structure of the original table
    db.run(sqlDropOldTable, (err) => {
      if (err) {
        console.error("Error creating temporary table:", err.message);
        callback(err);
        return;
      }
    });
  });
};
const DeletTableuserComppanyCorssUpdateActivationtoFalse = (
  data,
  type = "usersCompany"
) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        db.run(
          ` DELETE FROM  ${type} WHERE PhoneNumber=?`,
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

const DeleteTablecompanySubProjectPublic = () => {};

const DeleteTableCommentPostPublic = (data) => {
  db.serialize(function () {
    db.run(`Delete FROM Comment WHERE CommentID=?`, data, function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been Deleteed.`);
    });
  });
};
const DeleteTableLikesPostPublic = (data) => {
  db.serialize(function () {
    db.run(
      `Delete FROM Likes WHERE PostId=? AND userName=?`,
      data,
      function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(`Row with the ID ${this.lastID} has been Deleteed.`);
      }
    );
  });
};

const DeleteTablecompanySubProjectChate = () => {};

module.exports = {
  DeleteTablecompany,
  DeleteTablecompanySub,
  DeleteTablecompanySubProject,
  DeleteTablecompanySubProjectphase,
  DeleteTablecompanySubProjectCovenant,
  DeleteTablecompanySubProjectReturned,
  DeleteTablecompanySubProjectarchives,
  DeleteTablecompanySubProjectPublic,
  DeleteTablecompanySubProjectChate,
  DeleteTableLikesPostPublic,
  DeleteTableCommentPostPublic,
  DELETETableLoginActivaty,
  DeleteTableNotifcation,
  DeletTableuserComppanyCorssUpdateActivationtoFalse,
};
