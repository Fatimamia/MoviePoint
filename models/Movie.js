const mongoose = require("mongoose"); // Import mongoose

// Define schema for movies
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Movie title (unique)
  genre: { type: String, required: true }, // Movie genre
  description: { type: String, required: true }, // Movie description
  imageUrl: { type: String, required: true }, // Path or URL for movie image

  rating: {
    type: Number, // Rating value (1 to 5)
    min: 1,
    max: 5,
    default: 0
  },
  voters: {
    type: String, // Number of voters (e.g., "500k", "Not Rated")
    default: "Not Rated"
  }

}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model("Movie", movieSchema); // Export Movie model
