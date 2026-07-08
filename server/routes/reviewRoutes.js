// server/routes/reviewRoutes.js
const express = require('express');
const { deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Delete review (owner or admin)
router.delete('/:id', protect, deleteReview);

module.exports = router;
