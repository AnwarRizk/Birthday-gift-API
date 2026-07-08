require('dotenv').config();
const mongoose = require('mongoose');
const {
  deleteOldBirthdaysAndImagesFromCloudinary
} = require('../utils/cleanup');

const runCleanup = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set');
  }

  await mongoose.connect(process.env.MONGO_URI, {});

  try {
    await deleteOldBirthdaysAndImagesFromCloudinary();
    console.log('Cleanup finished successfully');
  } finally {
    await mongoose.disconnect();
  }
};

runCleanup().catch((err) => {
  console.error('Cleanup failed:', err.message);
  process.exit(1);
});
