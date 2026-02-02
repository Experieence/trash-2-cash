const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

// Show the register form
router.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

// Handle form submission
router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // 1. Check if passwords match
  if (password !== confirmPassword) {
    return res.render('register', {
      error: 'Passwords do not match.',
      success: null
    });
  }

  try {
    // 2. Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', {
        error: 'Username is already taken.',
        success: null
      });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save the new user
    const newUser = new User({ username, password: hashedPassword, points: 0});
    await newUser.save();

    // 5. Show success message
    res.render('register', {
      success: 'Registration successful! You can now log in.',
      error: null
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.render('register', {
      error: 'Something went wrong. Please try again.',
      success: null
    });
  }
});

module.exports = router;
