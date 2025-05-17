const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('parental_control.db');

db.serialize(() => {
 db.run('DROP TABLE IF EXISTS users');
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('parent', 'child')) NOT NULL,
      age_group TEXT,
      usage_minutes INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      device_name TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS usage_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id INTEGER,
      app_name TEXT,
      start_time TEXT,
      end_time TEXT,
      FOREIGN KEY(device_id) REFERENCES devices(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS app_restrictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id INTEGER,
      app_name TEXT,
      is_blocked INTEGER DEFAULT 0,
      FOREIGN KEY(device_id) REFERENCES devices(id)
    )
  `);

  db.run(`INSERT OR IGNORE INTO users (id, username, password, role, age_group, usage_minutes) VALUES 
    (1, 'parent1', 'pass123', 'parent', 'limit-7h', 0),
    (2, 'child1', 'pass456', 'child', 'limit-3h', 0),
    (3, 'child2', 'pass789', 'child', 'limit-3h', 0)
  `);

  db.run(`INSERT OR IGNORE INTO devices (id, user_id, device_name) VALUES 
    (1, 1, 'Parent Phone'),
    (2, 2, 'Child1 Tablet'),
    (3, 3, 'Child2 Laptop')
  `);

  db.run(`INSERT OR IGNORE INTO usage_logs (device_id, app_name, start_time, end_time) VALUES 
    (2, 'YouTube', '2025-05-17T10:00:00', '2025-05-17T11:00:00'),
    (2, 'Instagram', '2025-05-17T11:30:00', '2025-05-17T12:00:00'),
    (3, 'Minecraft', '2025-05-17T15:00:00', '2025-05-17T16:30:00')
  `);

  db.run(`INSERT OR IGNORE INTO app_restrictions (device_id, app_name, is_blocked) VALUES 
    (2, 'Instagram', 1),
    (3, 'Minecraft', 0)
  `);
});

module.exports = db;
