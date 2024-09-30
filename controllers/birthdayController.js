const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
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

// Helper function to convert HEIC to JPEG using sharp
const convertHEICtoJPEG = async (buffer) => {
  try {
    const convertedImageBuffer = await sharp(buffer)
      .toFormat('jpeg')
      .toBuffer();
    return convertedImageBuffer;
  } catch (error) {
    throw new Error('Failed to convert HEIC image.');
  }
};

// Generate link and handle image upload
const generateLink = async (req, res) => {
  const { friendName, senderName, message } = req.body;
  const image = req.file;

  // Ensure all fields are provided except image
  if (!friendName || !senderName || !message) {
    return res.status(400).send('All required fields are missing!');
  }

  try {
    let imageUrl = null;

    if (image) {
      let imageBuffer = image.buffer;

      // Check if the uploaded image is HEIC format
      if (image.mimetype === 'image/heic') {
        // Convert HEIC to JPEG
        imageBuffer = await convertHEICtoJPEG(imageBuffer);
      }

      // Upload the image to Cloudinary
      const result = await uploadImageToCloudinary(imageBuffer);
      imageUrl = result.secure_url; // Store Cloudinary image URL
    }

    // Save the details in MongoDB
    const uniqueId = uuidv4(); // Generate a unique ID for the link
    const birthday = new Birthday({
      friendName,
      senderName,
      message,
      imageUrl, // Save image URL if it exists, otherwise null
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
