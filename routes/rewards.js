const express = require('express');
const router = express.Router();
const User = require('../models/user');

function isAuthenticated(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', isAuthenticated, (req, res) => {
  res.render('rewards', { username: req.session.username, points: req.session.points });
});

router.post('/redeem', isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;
    const cost = parseInt(req.body.cost);
    const user = await User.findOne({ username });

    //Check if current user found
    if(user){
      //Check if the user has enough points for transaction
      if(user.points >= cost){
        user.points -= cost;
        await user.save();

        req.session.points = user.points;

        res.render('rewards', {
        points: req.session.points,
        success: 'Redemption successful!',
        error: null
        });
      } else {
        res.render('rewards', {
          error: 'Not enough points',
          success: null
        });
      }
    }
  } catch (err) {
    console.error('Redemption error:', err);
    res.render('rewards', {
      error: 'Something went wrong. Please try again.',
      success: null
    });
  }
});

module.exports = router;