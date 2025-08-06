const MyList = require('../models/MyList'); // Import MyList model

// GET /MoviePoint/mylist
exports.getMyList = async (req, res) => {
  try {
    const list = await MyList.find(); // Get all movies from list
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /MoviePoint/mylist
exports.addToMyList = async (req, res) => {
  try {
    const { title, genre, description, imageUrl, status = "Not Started" } = req.body; // Extract data from request body

    const exists = await MyList.findOne({ title }); // Check if movie already exists
    if (exists) return res.status(400).json({ msg: "Already in your list" });

    const entry = new MyList({ title, genre, description, imageUrl, status }); // Create new list entry
    await entry.save();
    res.json({ msg: "Added to list", movie: entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /MoviePoint/mylist/:title
exports.removeFromMyList = async (req, res) => {
  try {
    const title = req.params.title; // Get title from params
    const deleted = await MyList.findOneAndDelete({ title }); // Delete movie by title
    if (!deleted) return res.status(404).json({ msg: "Movie not found in your list" });
    res.json({ msg: "Removed from list", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /MoviePoint/mylist/:title/status
exports.updateStatus = async (req, res) => {
  try {
    const title = req.params.title; // Get title from params
    const { status } = req.body; // Get new status from body

    const updated = await MyList.findOneAndUpdate(
      { title },
      { status },
      { new: true } // Return updated document
    );

    if (!updated) return res.status(404).json({ msg: "Movie not found" });
    res.json({ msg: "Status updated", movie: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
