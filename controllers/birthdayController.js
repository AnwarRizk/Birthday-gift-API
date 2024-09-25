const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Birthday = require('../models/birthdayModel');
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

// Function to handle Cloudinary image upload
const uploadImageToCloudinary = (imageBuffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'birthday',
          transformation: [{ width: 600, height: 600, crop: 'limit' }],
          public_id: uuidv4() // Assign unique ID to the image
        },
        (error, result) => {
          if (error) {
            return reject(new Error('Cloudinary upload failed.'));
          }
          resolve(result);
        }
      )
      .end(imageBuffer);
  });

// Generate link and handle image upload
const generateLink = async (req, res) => {
  const { friendName, senderName, message } = req.body;
  const image = req.file;

  // Ensure all fields are provided
  if (!friendName || !senderName || !message || !image) {
    return res.status(400).send('All fields are required!');
  }

  try {
    // Upload the image to Cloudinary
    const result = await uploadImageToCloudinary(image.buffer);

    // Save the details in MongoDB
    const uniqueId = uuidv4(); // Generate a unique ID for the link
    const birthday = new Birthday({
      friendName,
      senderName,
      message,
      imageUrl: result.secure_url, // Store Cloudinary image URL
      uniqueId
    });

    // Save the birthday data to the database
    await birthday.save();

    // Return the generated link
    res.json({
      link: `https://friend-birthday-gift.vercel.app/birthday.html?id=${uniqueId}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('An error occurred while generating the link.');
  }
};

module.exports = { upload, generateLink };
