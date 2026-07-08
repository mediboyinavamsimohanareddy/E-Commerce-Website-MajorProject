// server/routes/productRoutes.js
const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getFeaturedProducts,
  getSearchSuggestions,
} = require('../controllers/productController');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Review routes
router.post('/:id/reviews', protect, addReview);
router.get('/:id/reviews', getProductReviews);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/upload', protect, admin, upload.array('images', 5), uploadImages);

module.exports = router;
