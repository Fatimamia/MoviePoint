const express = require('express'); // Import express framework
const mongoose = require('mongoose'); // Import mongoose for MongoDB
const cors = require('cors'); // Import CORS middleware
const multer = require('multer'); // Import multer for file uploads
const path = require('path'); // Import path module for handling file paths

// Models & Routes
const Movie = require('./models/Movie'); // Movie model
const movieRoutes = require('./routes/movieRoutes'); // Movie routes
const mylistRoutes = require('./routes/mylistRoutes'); // MyList routes
const contactRoutes = require('./routes/contactRoutes');  // Contact routes

const app = express();
const PORT = 8090;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/netflixDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads folder

// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // Set upload directory
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const base = path.basename(file.originalname, ext); // Get file basename
    cb(null, `${base}-${Date.now()}${ext}`); // Set unique filename
  }
});
const upload = multer({ storage });

app.use('/MoviePoint/watchlist', movieRoutes); // Mount movie routes
app.use('/MoviePoint/mylist', mylistRoutes); // Mount mylist routes
app.use('/MoviePoint/contact', contactRoutes); // Mount contact routes

// POST /MoviePoint/watchlist/upload - Upload movie with image and details
app.post('/MoviePoint/watchlist/upload', upload.single('image'), async (req, res) => {
  const { title, genre, description, rating, voters, adminPassword } = req.body;

  if (adminPassword !== 'admin123') { // Simple admin auth check
    return res.status(401).json({ msg: 'Unauthorized: Invalid password' });
  }

  if (!req.file) return res.status(400).json({ msg: 'Image upload required' }); // Ensure image is uploaded

  const imageUrl = '/uploads/' + req.file.filename; // Construct image URL

  try {
    const movie = new Movie({
      title,
      genre,
      description,
      imageUrl,
      rating: parseInt(rating),   // Convert rating to number
      voters                      // Store voters as string (e.g., '500k')
    });

    await movie.save(); // Save movie to DB
    res.json({ msg: 'Movie added successfully', movie });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add movie', error: err.message });
  }
});

require('dotenv').config();
 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" Connected to MongoDB Atlas"))
.catch((err) => console.error(" MongoDB connection error:", err));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
