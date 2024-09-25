const express = require('express');
const { upload, generateLink } = require('../controllers/birthdayController');
const Birthday = require('../models/birthdayModel');

const router = express.Router();

// POST route to generate a link and upload image
router.post('/generate', upload.single('friendImage'), generateLink);

// GET route to retrieve birthday data based on unique ID
router.get('/birthday/:id', async (req, res) => {
  try {
    const birthday = await Birthday.findOne({ uniqueId: req.params.id });

    // Check if birthday data is not found
    if (!birthday) {
      return res.status(404).json({
        status: 'fail',
        message: 'Birthday data not found'
      });
    }

    // Return birthday data as a successful response
    res.status(200).json({
      status: 'success',
      data: birthday
    });
  } catch (error) {
    console.error(`Error fetching birthday data: ${error.message}`);

    // Handle any server errors and send a response
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching birthday data'
    });
  }
});

module.exports = router;
