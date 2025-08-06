const Movie = require('../models/Movie'); // Import Movie model

// GET /MoviePoint/watchlist
exports.getAllMovies = async (req, res) => {
  try {
    const genre = req.query.genre; // Get genre from query
    let query = {};
    if (genre && genre !== "All") query.genre = genre; // Filter by genre if specified
    const movies = await Movie.find(query); // Fetch movies
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /MoviePoint/watchlist/title/:title
exports.getMovieByTitle = async (req, res) => {
  try {
    const title = req.params.title; // Get title from params
    const movie = await Movie.findOne({ title }); // Find movie by title
    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /MoviePoint/watchlist/:id
exports.deleteMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id); // Delete movie by ID
    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    res.json({ msg: "Movie deleted", deleted: movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
