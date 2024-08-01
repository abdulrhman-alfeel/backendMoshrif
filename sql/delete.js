const db = require("./sqlite");

const DeleteTablecompany = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const DeleteTablecompanySub = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const DeleteTablecompanySubProject = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const DeleteTablecompanySubProjectphase = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

const DeleteTablecompanySubProjectCovenant = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const DeleteTablecompanySubProjectReturned = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const DeleteTablecompanySubProjectexpense = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const DeleteTablecompanySubProjectarchives = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};
const DeleteTablecompanySubProjectPublic = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

const DeleteTableCommentPostPublic = (data) => {
  db.serialize(function () {
    db.run(
      `Delete FROM Comment WHERE CommentID=?`,
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

const DeleteTablecompanySubProjectChate = () => {
  const data = ["sammy", "blue", 1900];
  db.run(
    `DELETE FROM  sharks WHERE ID=?`,
    data,
    function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row with the ID ${this.lastID} has been inserted.`);
    }
  );
};

module.exports = {
  DeleteTablecompany,
  DeleteTablecompanySub,
  DeleteTablecompanySubProject,
  DeleteTablecompanySubProjectphase,
  DeleteTablecompanySubProjectCovenant,
  DeleteTablecompanySubProjectReturned,
  DeleteTablecompanySubProjectexpense,
  DeleteTablecompanySubProjectarchives,
  DeleteTablecompanySubProjectPublic,
  DeleteTablecompanySubProjectChate,
  DeleteTableLikesPostPublic,
  DeleteTableCommentPostPublic

};
