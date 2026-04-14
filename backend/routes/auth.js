const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = process.env.JWT_SECRET || 'your_secret_key_change_this';

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Email already exists.' });
          }
          return res.status(500).json({ error: err.message });
        }

        const token = jwt.sign({ id: this.lastID, email }, SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, email });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Incorrect password.' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
    res.json({ token, email: user.email });
  });
});

module.exports = router;