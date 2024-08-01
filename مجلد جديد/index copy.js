const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});
// let db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the chinook database.');
// });

// create table
db.run(`CREATE TABLE IF NOT EXISTS sharks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  weight INTEGER NOT NULL
)`);

// insert data
const data = ['sammy', 'blue', 1900];
db.run(`INSERT INTO sharks (name, color, weight) VALUES (?, ?, ?)`, data, function(err) {
  if (err) {
    console.error(err.message);
  }
  console.log(`Row with the ID ${this.lastID} has been inserted.`);
});
db.get(`SELECT * FROM sharks`, function(err,result) {
  if (err) {
    console.error(err.message);
  }
  console.log(result)
//   console.log(`Row with the ID ${result} has been inserted.`);
});

// close the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});




/*



*/