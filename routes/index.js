const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { username: req.session.username });
});

function isAuthenticated(req, res, next) {
  if (req.session.username) {
    next(); // proceed to the dashboard
  } else {
    res.redirect('/login');
  }
}

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { username: req.session.username });
});


module.exports = router;
