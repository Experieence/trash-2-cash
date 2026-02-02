const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Login failed. <a href="/login">Try again</a>.');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
