const express = require('express');
const path = require('path');
const { upload, generateLink } = require('../controllers/birthdayController');
const Birthday = require('../models/birthdayModel');

const router = express.Router();

router.post('/generate', upload.single('friendImage'), generateLink);

router.get('/birthday/:id', async (req, res) => {
  // Find the birthday data in MongoDB and send json response
  const birthday = await Birthday.findOne({ uniqueId: req.params.id });
  if (!birthday) {
    return res.status(404).json({
      status: 'fail',
      message: 'Birthday data not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: birthday
  });
});

module.exports = router;
