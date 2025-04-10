const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/users.json');


// Helper: read users from file
function readUsers() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper: write users to file
function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

// Route: POST /auth/signup
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log('POST /auth/signup', req.body);

  let users = readUsers();

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  users.push({ name, email, password });
  writeUsers(users);

  res.status(200).json({ message: 'Signup success' });
});

// Route: POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('POST /auth/login', req.body);

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const fakeToken = 'abc123token';
  res.status(200).json({ message: 'Login success', token: fakeToken });
});

module.exports = router;
