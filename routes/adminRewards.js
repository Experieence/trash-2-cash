const express = require('express');
const router = express.Router();
const Upload = require('../models/upload'); // adjust path if needed

// Admin view to approve rewards
router.get('/admin-rewards', async (req, res) => {
  try {
    const uploads = await Upload.find({ status: 'pending' });
    res.render('admin-rewards', { uploads });
  } catch (err) {
    res.status(500).send("Error fetching uploads.");
  }
});

module.exports = router;
