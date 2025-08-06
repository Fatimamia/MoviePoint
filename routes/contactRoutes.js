const express = require('express'); // Import express
const router = express.Router(); // Create a router
const Contact = require('../models/Contact'); // Import Contact model

// POST / - Save contact form data
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body); // Create new contact entry
    await contact.save(); // Save to database
    res.json({ success: true, message: 'Message stored successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save message.', error: err.message });
  }
});

module.exports = router; // Export router
