const express = require('express'); // Import express
const mylistController = require('../controllers/mylistController'); // Import mylist controller

const router = express.Router(); // Create router
const {
  getMyList,
  addToMyList,
  removeFromMyList
} = require('../controllers/mylistController'); // Destructure functions from controller

router.get('/', getMyList); // GET / - Get all items in my list
router.post('/', addToMyList); // POST / - Add item to my list
router.delete('/:title', removeFromMyList); // DELETE /:title - Remove item by title
router.put('/status/:title', mylistController.updateStatus); // PUT /status/:title - Update status by title

module.exports = router; // Export router
