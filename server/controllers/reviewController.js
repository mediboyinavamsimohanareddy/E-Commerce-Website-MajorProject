// server/controllers/reviewController.js
// Product review operations

const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Check if user already reviewed
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product',
    });
  }

  // Create review
  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  // Update product rating
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await product.save();

  const populated = await Review.findById(review._id).populate('user', 'name avatar');

  res.status(201).json({ success: true, data: populated });
});

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.json({ success: true, data: reviews });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  // Only review owner or admin can delete
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const productId = review.product;
  await Review.findByIdAndDelete(req.params.id);

  // Recalculate product rating
  const reviews = await Review.find({ product: productId });
  const product = await Product.findById(productId);
  if (product) {
    product.numReviews = reviews.length;
    product.rating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await product.save();
  }

  res.json({ success: true, message: 'Review deleted successfully' });
});

module.exports = { addReview, getProductReviews, deleteReview };
