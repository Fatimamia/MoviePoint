const express = require('express'); // Import express
const router = express.Router(); // Create a router
const {
  getAllMovies,
  getMovieByTitle,
  deleteMovieById // Import delete function
} = require('../controllers/movieController');

// GET / - Fetch all movies
router.get('/', getAllMovies);

// GET /title/:title - Fetch movie by title
router.get('/title/:title', getMovieByTitle);

// DELETE /:id - Delete movie by ID
router.delete('/:id', deleteMovieById);

module.exports = router; // Export router
