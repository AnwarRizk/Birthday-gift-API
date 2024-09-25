const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema(
  {
    friendName: {
      type: String,
      required: [true, 'Please provide the name of the friend']
    },
    senderName: {
      type: String,
      required: [true, 'Please provide your name']
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide the image URL']
    },
    message: {
      type: String,
      required: [true, 'Please provide the message for the friend']
    },
    uniqueId: {
      type: String,
      required: [true, 'Please provide the unique ID']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Birthday', birthdaySchema);
