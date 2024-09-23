const express = require('express');
const { upload, generateLink } = require('../controllers/birthdayController');
const Birthday = require('../models/birthdayModel');
const router = express.Router();

router.post('/generate', upload.single('friendImage'), generateLink);
router.get('/birthday/:id', async (req, res) => {
  try {
    const birthday = await Birthday.findOne({ uniqueId: req.params.id });
    if (!birthday) {
      return res.status(404).send('Page not found');
    }
    res.sendFile(path.join(__dirname, '../public/birthday.html'));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
