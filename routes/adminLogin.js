const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); 

router.get('/admin-login', (req, res) => {
  res.render('adminlogin'); 
});

router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin || admin.password !== password) {
    return res.send('Invalid username or password');
  }

  req.session.admin = username;
  res.redirect('/admin-dashboard');
});

module.exports = router;
