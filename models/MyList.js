const mongoose = require('mongoose'); // Import mongoose

// Define schema for user's movie list
const myListSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Movie title (unique)
  genre: { type: String, required: true }, // Movie genre
  description: { type: String, required: true }, // Movie description
  imageUrl: { type: String, required: true }, // Image URL or path
  status: { type: String, default: "Not Started" } // Watch status
});

module.exports = mongoose.model('MyList', myListSchema); // Export MyList model
