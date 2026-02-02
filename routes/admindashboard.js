const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');
const User = require('../models/user');

function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/admin-login');
}

// GET dashboard
router.get('/admin-dashboard', isAdmin, async (req, res) => {
  const uploads = await Upload.find({ status: 'pending' });
  const users = await User.find();
  res.render('admin-dashboard', { uploads, users });
});

// Approve upload
router.post('/admin/approve/:id', isAdmin, async (req, res) => {
  const upload = await Upload.findById(req.params.id);
  if (!upload) return res.status(404).send('Upload not found');

  upload.status = 'approved';
  await upload.save();

  // Optional: Add points to user
  const user = await User.findOne({ username: upload.username });
  if (user) {
    user.points = (user.points || 0) + 10; // Example: +10 points per approval
    await user.save();
  }

  res.redirect('/admin-dashboard');
});

// Reject upload
router.post('/admin/reject/:id', isAdmin, async (req, res) => {
  const upload = await Upload.findById(req.params.id);
  if (!upload) return res.status(404).send('Upload not found');

  upload.status = 'rejected';
  await upload.save();

  res.redirect('/admin-dashboard');
});

module.exports = router;
