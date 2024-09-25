const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const birthdayRoutes = require('./routes/birthdayRoutes');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB with error handling
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if the connection fails
  });

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Test route working'
  });
});

// Use birthday routes
app.use('/api', birthdayRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
