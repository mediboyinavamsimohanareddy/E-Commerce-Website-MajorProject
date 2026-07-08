// server/controllers/productController.js
// Product CRUD operations with search, filter, and pagination

const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');
const ApiFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  let categoryIds = [];
  if (req.query.keyword) {
    const matchingCategories = await Category.find({
      name: { $regex: req.query.keyword, $options: 'i' },
    }).select('_id');
    categoryIds = matchingCategories.map((cat) => cat._id);
  }

  // Count total documents matching filters
  const countQuery = new ApiFeatures(Product.find(), req.query)
    .search(categoryIds)
    .filter();
  const totalProducts = await Product.countDocuments(countQuery.query.getFilter());

  // Get paginated results
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search(categoryIds)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const products = await apiFeatures.query.populate('category', 'name slug');

  const page = apiFeatures.page || 1;
  const limit = apiFeatures.limit || 12;

  res.json({
    success: true,
    data: products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      limit,
    },
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Get reviews for this product
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.json({
    success: true,
    data: { ...product.toObject(), reviews },
  });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: product });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Also delete related reviews
  await Review.deleteMany({ product: req.params.id });

  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Upload product images
// @route   POST /api/products/:id/upload
// @access  Private/Admin
const uploadImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const images = req.files.map((file) => ({
    url: `/uploads/${file.filename}`,
    public_id: file.filename,
  }));

  product.images.push(...images);
  await product.save();

  res.json({ success: true, data: product });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const products = await Product.find({ featured: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort('-createdAt');

  res.json({ success: true, data: products });
});

// @desc    Get search suggestions
// @route   GET /api/products/suggestions
// @access  Public
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.json({ success: true, data: [] });
  }

  const products = await Product.find({
    name: { $regex: q, $options: 'i' },
  })
    .select('name images price')
    .limit(5);

  res.json({ success: true, data: products });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getFeaturedProducts,
  getSearchSuggestions,
};
