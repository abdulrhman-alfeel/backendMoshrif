
const sqlite3 = require("sqlite3").verbose();

// open the database
const db = new sqlite3.Database('./mydatabase23.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

// Helper function to run queries with promises
db.query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Helper function to get single row
db.getRow = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to get all rows
db.getAllRows = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Close database connection gracefully
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('❌ خطأ في إغلاق قاعدة البيانات:', err.message);
    } else {
      console.log('✅ تم إغلاق قاعدة البيانات بنجاح');
    }
    process.exit(0);
  });
});

module.exports = db;
