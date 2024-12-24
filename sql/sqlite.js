
const sqlite3 = require("sqlite3").verbose();

// open the database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

module.exports = db;
