const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
  friendName: { type: String, required: true },
  senderName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  uniqueId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '3d' }
});

module.exports = mongoose.model('Birthday', birthdaySchema);
