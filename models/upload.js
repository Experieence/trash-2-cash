const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  username: String,
  itemType: String,
  quantity: Number,
  date: { type: Date, default: Date.now },
  photoUrl: String,
  status: { type: String, default: 'pending' }, // 'approved', 'rejected'
});

module.exports = mongoose.model('Upload', uploadSchema);
