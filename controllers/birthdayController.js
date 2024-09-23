const Birthday = require('../models/birthdayModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Configure multer for file upload (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Generate link and handle image upload
const generateLink = async (req, res) => {
  const { friendName, senderName } = req.body;
  const image = req.file;

  // Ensure all fields are provided
  if (!friendName || !senderName || !image) {
    return res.status(400).send('All fields are required!');
  }

  try {
    // Upload and resize the image to Cloudinary using the image buffer
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'birthday',
          transformation: [{ width: 500, height: 500, crop: 'limit' }],
          public_id: uuidv4()
        },
        async (error, result) => {
          if (error) {
            return res.status(500).send('Cloudinary upload failed.');
          }

          // Save the details in MongoDB
          const uniqueId = uuidv4(); // Generate a unique ID for the link
          const birthday = new Birthday({
            friendName,
            senderName,
            imageUrl: result.secure_url,
            uniqueId
          });

          // Save the birthday data to the database
          await birthday.save();

          // Return the generated link
          res.json({
            link: `${req.protocol}://${req.get('host')}/api/birthday/${uniqueId}`
          });
        }
      )
      .end(image.buffer); // Use image buffer instead of streaming
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { upload, generateLink };
