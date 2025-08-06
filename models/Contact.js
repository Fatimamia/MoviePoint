const mongoose = require('mongoose'); // Import mongoose

// Define schema for contact form
const contactSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  message: String,
  date: {
    type: Date,
    default: Date.now // Automatically set current date
  }
});

module.exports = mongoose.model('Contact', contactSchema); // Export Contact model
