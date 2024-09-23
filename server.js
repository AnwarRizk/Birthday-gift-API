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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Test route working'
  });
});

// ROUTES
app.use('/api', birthdayRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
