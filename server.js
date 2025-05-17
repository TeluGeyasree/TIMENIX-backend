const db = require('./database');
const { checkAge, getLimitFromGroup } = require('./ageCheck');
const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Screen Time Control Server Working!');
});
const PORT = 9999;   //SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const users = [
  { id: 1, username: 'parent', password: 'parent123', role: 'parent' },
  { id: 2, username: 'child', password: 'child123', role: 'child' }
];
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if(user) {
    res.json({ success: true, role: user.role });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post('/age-check', (req, res) => {
  const { detectedAge } = req.body;
  
  if(typeof detectedAge!== "number") {
    return res.status(400).json({ error: "Age missing" });
  }
  
  const result = checkAge(detectedAge);
  res.json({ accessLevel: result });
});

app.post('/add-user', (req, res) => {
  const { username, password, role, age_group } = req.body;
  db.run(
    'INSERT INTO users (username, password, role, age_group) VALUES (?, ?, ?, ?)',
    [username, password, role, age_group],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ success: true, userId: this.lastID });
    }
  );
});

const cron = require('node-cron');
cron.schedule('0 0 * * *', () => {
  db.run("UPDATE users SET usage_minutes = 0");
  console.log('Daily usage reset');
});

app.post('/log-usage', (req, res) => {
  const { username, minutesUsed } = req.body;

  if (!username || !minutesUsed) {
    return res.status(400).json({ error: "Missing data" });
  }

  db.get('SELECT usage_minutes, age_group FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const limit = getLimitFromGroup(user.age_group);
    const currentUsage = user.usage_minutes || 0;
    const total = currentUsage + Number(minutesUsed);

    if (total > limit) {
      return res.json({ success: false, message: "Limit reached" });
    }

    db.run('UPDATE users SET usage_minutes = ? WHERE username = ?', [total, username], (err) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      res.json({ success: true, newUsage: total });
    });
  });
});


