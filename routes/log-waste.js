const express = require('express');
const Upload = require('../models/upload');
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
  res.render('log-waste', { username: req.session.username, points: req.session.points });
});

router.post('/', isAuthenticated, async (req, res) => {
  const { itemType, quantity } = req.body;

  try {
    // 1. Save the new upload
    const newUpload = new Upload({username: req.session.username, itemType: itemType, quantity: quantity, photoUrl: 'testURL'});
    await newUpload.save();

    // 2. Update point total
    const username = req.session.username;
    const user = await User.findOne({ username });

    if(user){
      if(itemType=="plastic_bottle"){
        user.points += quantity*2;
        await user.save();
        req.session.points = user.points;
      } 
      else if(itemType=="glass_bottle"){
        user.points += quantity*3;
        await user.save();
        req.session.points = user.points;
      } 
      else if(itemType=="aluminium_can"){
        user.points += quantity*2;
        await user.save();
        req.session.points = user.points;
      } 
      else if(itemType=="paper"){
        user.points += quantity*1;
        await user.save();
        req.session.points = user.points;
      }
      else if(itemType=="scrap_metal"){
        user.points += quantity*5;
        await user.save();
        req.session.points = user.points;
      }
    }

    // 3. Show success message
    res.render('log-waste', {
      success: 'Upload successful.',
      error: null
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.render('log-waste', {
      error: 'Something went wrong. Please try again.',
      success: null
    });
  }
});

module.exports = router;