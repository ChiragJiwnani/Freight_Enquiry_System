// File: server/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// JWT generation utility
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("❌ Registration error:", err); // 👈 log full error
    res.status(400).json({ error: err.message || "Registration failed" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

module.exports = router;
