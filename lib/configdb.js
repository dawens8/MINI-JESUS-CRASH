const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'botdata.db');
const db = new sqlite3.Database(dbPath);

// Ensure table exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
});

module.exports = {
  getConfig: (key) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT value FROM config WHERE key = ?", [key], (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.value : null);
      });
    });
  },
  setConfig: (key, value) => {
    return new Promise((resolve, reject) => {
      db.run("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", [key, value], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },
  getAllConfig: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM config", [], (err, rows) => {
        if (err) return reject(err);
        resolve(Object.fromEntries(rows.map(row => [row.key, row.value])));
      });
    });
  }
};
