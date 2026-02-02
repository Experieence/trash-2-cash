const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', isAuthenticated, (req, res) => {
  res.render('dashboard', { username: req.session.username });
});

module.exports = router;
