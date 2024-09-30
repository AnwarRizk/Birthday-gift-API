/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const cloudinary = require('cloudinary').v2;
const Birthday = require('../models/birthdayModel');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Function to delete old birthdays and images from Cloudinary and MongoDB
const deleteOldBirthdaysAndImagesFromCloudinary = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // Subtract 3 days from the current date

  console.log('Deleting birthdays older than:', threeDaysAgo);

  try {
    // Find all birthdays older than 3 days
    const oldBirthdays = await Birthday.find({
      createdAt: { $lte: threeDaysAgo }
    });

    // Delete images from Cloudinary and remove their records from the database
    for (const birthday of oldBirthdays) {
      const { imageUrl } = birthday;

      // Check if imageUrl exists and is not null
      if (imageUrl) {
        const publicId = extractPublicIdFromUrl(imageUrl);

        if (publicId) {
          try {
            // Delete the image from Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === 'ok') {
              console.log(`Deleted image with public ID: ${publicId}`);
            } else {
              console.error(
                `Failed to delete image with public ID: ${publicId}`
              );
            }
          } catch (cloudErr) {
            console.error(
              'Error deleting image from Cloudinary:',
              cloudErr.message
            );
          }
        }
      }

      // Remove the birthday record from MongoDB
      await Birthday.findByIdAndDelete(birthday._id);
    }

    return true;
  } catch (err) {
    console.error('Error deleting old images:', err);
    throw err;
  }
};

// Helper function to extract Cloudinary public ID from the URL
const extractPublicIdFromUrl = (url) => {
  if (!url) return null; // Ensure the URL is valid

  // Split the URL by '/' and get the last part (the file name with extension)
  const publicIdWithExtension = url.split('/').slice(-2).join('/'); // This will give 'birthday/32842e83-...fc5.jpg'

  // Remove the file extension (e.g., .jpg, .png)
  const publicId = publicIdWithExtension.split('.')[0]; // This will give 'birthday/32842e83-...fc5'

  return publicId;
};

module.exports = { deleteOldBirthdaysAndImagesFromCloudinary };
