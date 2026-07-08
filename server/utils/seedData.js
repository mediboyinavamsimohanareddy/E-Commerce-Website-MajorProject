// server/utils/seedData.js
// Database seeder with realistic e-commerce data

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
  console.log('✅ Connected to MongoDB for seeding');
};

// Categories
const categories = [
  { name: 'Electronics', description: 'Laptops, tablets, and smart devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Fashion', description: 'Clothing, shoes, and accessories for all styles', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home & Living', description: 'Furniture, decor, and home essentials', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
  { name: 'Sports & Outdoors', description: 'Equipment and gear for fitness and adventure', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0a3d?w=400' },
  { name: 'Books', description: 'Bestsellers, fiction, non-fiction, and academic', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  { name: 'Beauty & Health', description: 'Skincare, makeup, wellness, and personal care', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  { name: 'Mobiles', description: 'Latest smartphones from top brands', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { name: 'Mobile Accessories', description: 'Phone cases, chargers, cables, and screen protectors', image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=400' },
  { name: 'Televisions', description: 'OLED, QLED, and 4K smart TVs', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400' },
];

// Users
const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin', phone: '+1-555-0100' },
  { name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'user', phone: '+1-555-0101' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'user123', role: 'user', phone: '+1-555-0102' },
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'user123', role: 'user', phone: '+1-555-0103' },
];

// Products by category
const productsData = [
  // Electronics
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'The most powerful MacBook Pro ever. With the M3 Max chip, up to 128GB unified memory, and a stunning 16-inch Liquid Retina XDR display, it delivers exceptional performance for demanding workflows.',
    price: 2499.99,
    comparePrice: 2799.99,
    stock: 25,
    featured: true,
    brand: 'Apple',
    sku: 'ELEC-001',
    categoryIndex: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', public_id: 'macbook1' },
      { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600', public_id: 'macbook2' },
    ],
    tags: ['laptop', 'apple', 'pro', 'premium'],
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'iPhone 15 Pro Max features a titanium design, the A17 Pro chip, a 48MP camera system with 5x Telephoto, and all-day battery life. Experience the ultimate iPhone.',
    price: 1199.99,
    comparePrice: 1299.99,
    stock: 50,
    featured: true,
    brand: 'Apple',
    sku: 'ELEC-002',
    categoryIndex: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', public_id: 'iphone1' },
    ],
    tags: ['phone', 'apple', 'smartphone'],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours of battery life. Premium comfort with ultra-lightweight design.',
    price: 349.99,
    comparePrice: 399.99,
    stock: 100,
    featured: true,
    brand: 'Sony',
    sku: 'ELEC-003',
    categoryIndex: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', public_id: 'sony1' },
    ],
    tags: ['headphones', 'audio', 'wireless'],
  },
  {
    name: 'Samsung 65" 4K QLED Smart TV',
    description: 'Quantum Dot technology delivers vivid, true-to-life color. 4K AI upscaling, Object Tracking Sound, and Smart TV powered by Tizen for unlimited entertainment.',
    price: 1299.99,
    comparePrice: 1599.99,
    stock: 15,
    featured: false,
    brand: 'Samsung',
    sku: 'ELEC-004',
    categoryIndex: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', public_id: 'tv1' },
    ],
    tags: ['tv', 'samsung', '4k', 'smart'],
  },
  // Fashion
  {
    name: 'Premium Leather Jacket',
    description: 'Handcrafted genuine leather jacket with a modern slim-fit design. Features YKK zippers, quilted lining, and adjustable waist belt. Perfect for casual and semi-formal occasions.',
    price: 299.99,
    comparePrice: 449.99,
    stock: 30,
    featured: true,
    brand: 'Urban Edge',
    sku: 'FASH-001',
    categoryIndex: 1,
    images: [
      { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', public_id: 'jacket1' },
    ],
    tags: ['leather', 'jacket', 'men', 'premium'],
  },
  {
    name: 'Designer Silk Dress',
    description: 'Elegant flowing silk dress with hand-painted floral patterns. Features a flattering A-line silhouette, adjustable straps, and hidden side pockets. Available in multiple sizes.',
    price: 189.99,
    comparePrice: 259.99,
    stock: 40,
    featured: true,
    brand: 'Elegance Co',
    sku: 'FASH-002',
    categoryIndex: 1,
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', public_id: 'dress1' },
    ],
    tags: ['dress', 'women', 'silk', 'designer'],
  },
  {
    name: 'Classic Running Sneakers',
    description: 'Engineered mesh upper for breathability, responsive cushioning technology, and durable rubber outsole. Perfect for daily runs, gym workouts, or casual wear.',
    price: 129.99,
    comparePrice: 159.99,
    stock: 75,
    featured: false,
    brand: 'SwiftStep',
    sku: 'FASH-003',
    categoryIndex: 1,
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', public_id: 'shoe1' },
    ],
    tags: ['shoes', 'running', 'sneakers', 'athletic'],
  },
  {
    name: 'Luxury Chronograph Watch',
    description: 'Swiss-made automatic movement with sapphire crystal glass, 100m water resistance, and genuine leather strap. A timeless statement piece for the modern gentleman.',
    price: 599.99,
    comparePrice: 799.99,
    stock: 20,
    featured: true,
    brand: 'TimeCraft',
    sku: 'FASH-004',
    categoryIndex: 1,
    images: [
      { url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600', public_id: 'watch1' },
    ],
    tags: ['watch', 'luxury', 'accessories'],
  },
  // Home & Living
  {
    name: 'Scandinavian Sofa Set',
    description: 'Minimalist 3-seater sofa with solid oak wood frame, premium linen upholstery, and high-density foam cushions. Designed for comfort and modern aesthetics.',
    price: 1499.99,
    comparePrice: 1899.99,
    stock: 8,
    featured: true,
    brand: 'Nordic Home',
    sku: 'HOME-001',
    categoryIndex: 2,
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', public_id: 'sofa1' },
    ],
    tags: ['sofa', 'furniture', 'living room'],
  },
  {
    name: 'Artisan Ceramic Vase Set',
    description: 'Set of 3 handmade ceramic vases in complementary earth tones. Each piece is unique with a matte finish and organic texture. Perfect as a centerpiece or shelf decor.',
    price: 79.99,
    comparePrice: 99.99,
    stock: 60,
    featured: false,
    brand: 'CraftHaus',
    sku: 'HOME-002',
    categoryIndex: 2,
    images: [
      { url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600', public_id: 'vase1' },
    ],
    tags: ['decor', 'ceramic', 'handmade'],
  },
  {
    name: 'Smart LED Floor Lamp',
    description: 'WiFi-enabled floor lamp with 16 million color options, adjustable brightness, and voice control compatibility. Sleek arc design adds elegance to any room.',
    price: 149.99,
    comparePrice: 199.99,
    stock: 45,
    featured: false,
    brand: 'LumiTech',
    sku: 'HOME-003',
    categoryIndex: 2,
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600', public_id: 'lamp1' },
    ],
    tags: ['lamp', 'smart home', 'lighting'],
  },
  // Sports & Outdoors
  {
    name: 'Professional Yoga Mat',
    description: 'Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material. Features alignment marks, carrying strap, and moisture-resistant surface. Perfect for all yoga styles.',
    price: 49.99,
    comparePrice: 69.99,
    stock: 120,
    featured: false,
    brand: 'ZenFit',
    sku: 'SPRT-001',
    categoryIndex: 3,
    images: [
      { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', public_id: 'yoga1' },
    ],
    tags: ['yoga', 'fitness', 'mat'],
  },
  {
    name: 'Carbon Fiber Mountain Bike',
    description: 'Full carbon fiber frame, 12-speed Shimano drivetrain, hydraulic disc brakes, and Fox suspension fork. Built for serious trail riding and cross-country adventures.',
    price: 2299.99,
    comparePrice: 2699.99,
    stock: 10,
    featured: true,
    brand: 'TrailBlazer',
    sku: 'SPRT-002',
    categoryIndex: 3,
    images: [
      { url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600', public_id: 'bike1' },
    ],
    tags: ['bike', 'cycling', 'mountain'],
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Quick-change weight system from 5 to 52.5 lbs per dumbbell. Replaces 15 pairs of traditional dumbbells. Chrome-finished handles with ergonomic grip.',
    price: 399.99,
    comparePrice: 499.99,
    stock: 35,
    featured: false,
    brand: 'IronCore',
    sku: 'SPRT-003',
    categoryIndex: 3,
    images: [
      { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600', public_id: 'dumbbell1' },
    ],
    tags: ['weights', 'gym', 'fitness'],
  },
  // Books
  {
    name: 'The Art of Innovation',
    description: 'A groundbreaking guide to creative problem-solving from IDEO, the award-winning design firm. Learn the secrets of fostering innovation and building a culture of creativity.',
    price: 24.99,
    comparePrice: 34.99,
    stock: 200,
    featured: false,
    brand: 'HarperBusiness',
    sku: 'BOOK-001',
    categoryIndex: 4,
    images: [
      { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', public_id: 'book1' },
    ],
    tags: ['business', 'innovation', 'bestseller'],
  },
  {
    name: 'JavaScript: The Definitive Guide',
    description: 'The comprehensive reference for JavaScript programmers. Covers ES2023, Node.js, and modern web development patterns. Essential for both beginners and experienced developers.',
    price: 44.99,
    comparePrice: 59.99,
    stock: 80,
    featured: false,
    brand: "O'Reilly Media",
    sku: 'BOOK-002',
    categoryIndex: 4,
    images: [
      { url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', public_id: 'book2' },
    ],
    tags: ['programming', 'javascript', 'tech'],
  },
  // Beauty & Health
  {
    name: 'Luxury Skincare Collection',
    description: 'Complete 5-piece skincare regimen with cleanser, toner, serum, moisturizer, and eye cream. Formulated with hyaluronic acid, vitamin C, and plant-based extracts.',
    price: 159.99,
    comparePrice: 219.99,
    stock: 55,
    featured: true,
    brand: 'GlowLab',
    sku: 'BEAU-001',
    categoryIndex: 5,
    images: [
      { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', public_id: 'skincare1' },
    ],
    tags: ['skincare', 'beauty', 'luxury'],
  },
  {
    name: 'Professional Hair Dryer',
    description: 'Ionic technology reduces frizz and drying time by 50%. Multiple heat and speed settings, cool shot button, and lightweight ergonomic design. Includes concentrator and diffuser.',
    price: 89.99,
    comparePrice: 129.99,
    stock: 65,
    featured: false,
    brand: 'StylePro',
    sku: 'BEAU-002',
    categoryIndex: 5,
    images: [
      { url: 'https://images.unsplash.com/photo-1522338242992-e1a54f0e2ed4?w=600', public_id: 'dryer1' },
    ],
    tags: ['hair', 'beauty', 'tools'],
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'Active noise cancellation, transparency mode, spatial audio, and 30-hour total battery life with the charging case. IPX4 water resistance for workouts.',
    price: 179.99,
    comparePrice: 229.99,
    stock: 90,
    featured: true,
    brand: 'SoundWave',
    sku: 'ELEC-005',
    categoryIndex: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600', public_id: 'earbuds1' },
    ],
    tags: ['earbuds', 'wireless', 'audio'],
  },
  {
    name: 'Smart Fitness Tracker',
    description: 'Advanced health monitoring with heart rate, SpO2, sleep tracking, and stress analysis. 14-day battery life, 5ATM water resistance, and 100+ workout modes.',
    price: 99.99,
    comparePrice: 149.99,
    stock: 110,
    featured: false,
    brand: 'FitPulse',
    sku: 'ELEC-006',
    categoryIndex: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600', public_id: 'tracker1' },
    ],
    tags: ['fitness', 'wearable', 'smart'],
  },
  // Mobiles (categoryIndex: 6)
  {
    name: 'iPhone 15 Pro Max',
    description: 'The titanium-forged flagship from Apple. Powered by the A17 Pro chip, it features a 6.7-inch Super Retina XDR display, a revolutionary 48MP main camera with 5x telephoto zoom, and exceptional battery life.',
    price: 1199.99,
    comparePrice: 1299.99,
    stock: 45,
    featured: true,
    brand: 'Apple',
    sku: 'MOB-001',
    categoryIndex: 6,
    images: [
      { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', public_id: 'iphone15promax' },
    ],
    tags: ['mobile', 'iphone', 'apple', 'smartphone'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'The ultimate Android experience. Boasting a built-in S Pen, Snapdragon 8 Gen 3 for Galaxy, a titanium frame, and a massive 200MP camera system with AI-driven photo editing features.',
    price: 1299.99,
    comparePrice: 1399.99,
    stock: 30,
    featured: true,
    brand: 'Samsung',
    sku: 'MOB-002',
    categoryIndex: 6,
    images: [
      { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', public_id: 's24ultra' },
    ],
    tags: ['mobile', 'samsung', 'galaxy', 'smartphone', 'android'],
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Smooth Beyond Belief. Equipped with the Snapdragon 8 Gen 3, up to 16GB RAM, a gorgeous 2K 120Hz AMOLED display, and blazing-fast 100W SUPERVOOC charging.',
    price: 799.99,
    comparePrice: 899.99,
    stock: 50,
    featured: false,
    brand: 'OnePlus',
    sku: 'MOB-003',
    categoryIndex: 6,
    images: [
      { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600', public_id: 'oneplus12' },
    ],
    tags: ['mobile', 'oneplus', 'smartphone', 'android'],
  },
  // Mobile Accessories (categoryIndex: 7)
  {
    name: 'Spigen Magnetic Phone Case',
    description: 'Ultra hybrid clear magnetic protective case designed for iPhone 15 Pro Max. Features shockproof TPU bumper, rigid PC back, and built-in magnets for seamless MagSafe compatibility.',
    price: 24.99,
    comparePrice: 34.99,
    stock: 150,
    featured: false,
    brand: 'Spigen',
    sku: 'ACC-001',
    categoryIndex: 7,
    images: [
      { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', public_id: 'phonecase' },
    ],
    tags: ['case', 'iphone', 'spigen', 'magsafe', 'accessory'],
  },
  {
    name: 'Anker Nano 30W USB-C Charger',
    description: 'Ultra-compact PIQ 3.0 fast charger. Provides high-speed charging up to 30W for iPhone, iPad, Samsung Galaxy, and other USB-C devices. Folding plug design for maximum portability.',
    price: 19.99,
    comparePrice: 24.99,
    stock: 200,
    featured: true,
    brand: 'Anker',
    sku: 'ACC-002',
    categoryIndex: 7,
    images: [
      { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600', public_id: 'charger' },
    ],
    tags: ['charger', 'anker', 'usbc', 'fast charger', 'accessory'],
  },
  {
    name: 'Tempered Glass Screen Protector (2-Pack)',
    description: 'High-definition tempered glass screen protectors offering 9H hardness, scratch resistance, and oleophobic coating to prevent fingerprints. Bubble-free easy installation frame included.',
    price: 12.99,
    comparePrice: 19.99,
    stock: 300,
    featured: false,
    brand: 'Novexa',
    sku: 'ACC-003',
    categoryIndex: 7,
    images: [
      { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600', public_id: 'screenprotector' },
    ],
    tags: ['screen', 'protector', 'glass', 'accessory'],
  },
  {
    name: 'Belkin BoostCharge 3-in-1 Wireless Charger',
    description: 'Elegant wireless charging stand that fast charges your iPhone, Apple Watch, and AirPods simultaneously. Premium design accents complement any nightstand or desk.',
    price: 119.99,
    comparePrice: 149.99,
    stock: 80,
    featured: true,
    brand: 'Belkin',
    sku: 'ACC-004',
    categoryIndex: 7,
    images: [
      { url: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600', public_id: 'belkincharger' },
    ],
    tags: ['charger', 'wireless', 'belkin', 'magsafe', 'accessory'],
  },
  // Televisions (categoryIndex: 8)
  {
    name: 'Sony Bravia XR 65" OLED TV',
    description: 'Stunning OLED picture quality powered by Cognitive Processor XR. Pure black, peak brightness, and cinematic sound come together for an immersive home theater experience.',
    price: 1999.99,
    comparePrice: 2299.99,
    stock: 12,
    featured: true,
    brand: 'Sony',
    sku: 'TV-001',
    categoryIndex: 8,
    images: [
      { url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600', public_id: 'sonytv' },
    ],
    tags: ['tv', 'television', 'sony', 'oled', '4k'],
  },
  {
    name: 'LG OLED Evo C3 55" 4K Smart TV',
    description: 'The ultimate gaming and cinema TV. Features brightness booster, Dolby Vision & Atmos, and four HDMI 2.1 ports for smooth 120Hz gaming with G-Sync and FreeSync support.',
    price: 1399.99,
    comparePrice: 1699.99,
    stock: 20,
    featured: true,
    brand: 'LG',
    sku: 'TV-002',
    categoryIndex: 8,
    images: [
      { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600', public_id: 'lgtv' },
    ],
    tags: ['tv', 'television', 'lg', 'oled', '4k', 'smart'],
  },
  {
    name: 'Samsung 75" Neo QLED 4K TV',
    description: 'Immensely bright and colorful picture powered by Quantum Mini LEDs. Neo Quantum Processor 4K delivers superb AI upscaling, anti-glare screens, and object tracking sound.',
    price: 2499.99,
    comparePrice: 2999.99,
    stock: 8,
    featured: false,
    brand: 'Samsung',
    sku: 'TV-003',
    categoryIndex: 8,
    images: [
      { url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600', public_id: 'samsungtv' },
    ],
    tags: ['tv', 'television', 'samsung', 'qled', '4k'],
  },
];

// Reviews data
const reviewsData = [
  { rating: 5, comment: 'Absolutely outstanding product! Exceeded all my expectations. Build quality is superb and it performs flawlessly.' },
  { rating: 4, comment: 'Great product overall. Very happy with the purchase. Minor improvement could be made to the packaging.' },
  { rating: 5, comment: 'Best purchase I have made in a long time. The quality is top-notch and delivery was super fast!' },
  { rating: 3, comment: 'Decent product for the price. Does what it is supposed to do, but nothing extraordinary.' },
  { rating: 4, comment: 'Really good quality and value for money. Would definitely recommend to friends and family.' },
  { rating: 5, comment: 'Premium quality! You can tell a lot of thought went into the design. Worth every penny.' },
  { rating: 4, comment: 'Very satisfied with this purchase. Works exactly as described. Customer service was also great.' },
  { rating: 5, comment: 'Incredible product. The attention to detail is remarkable. Will be buying more from this brand.' },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});

    // Seed users
    console.log('👤 Seeding users...');
    const createdUsers = await User.create(users);
    console.log(`   Created ${createdUsers.length} users`);

    // Seed categories
    console.log('📁 Seeding categories...');
    const createdCategories = await Category.create(categories);
    console.log(`   Created ${createdCategories.length} categories`);

    // Seed products
    console.log('📦 Seeding products...');
    const productsToCreate = productsData.map((p) => ({
      ...p,
      category: createdCategories[p.categoryIndex]._id,
      categoryIndex: undefined,
    }));
    const createdProducts = await Product.create(productsToCreate);
    console.log(`   Created ${createdProducts.length} products`);

    // Seed reviews
    console.log('⭐ Seeding reviews...');
    const reviewsToCreate = [];
    const regularUsers = createdUsers.filter((u) => u.role === 'user');

    for (let i = 0; i < createdProducts.length; i++) {
      // Add 1-3 reviews per product
      const numReviews = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numReviews && j < regularUsers.length; j++) {
        const reviewData = reviewsData[(i + j) % reviewsData.length];
        reviewsToCreate.push({
          user: regularUsers[j]._id,
          product: createdProducts[i]._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        });
      }
    }

    const createdReviews = await Review.create(reviewsToCreate);
    console.log(`   Created ${createdReviews.length} reviews`);

    // Update product ratings
    console.log('📊 Updating product ratings...');
    for (const product of createdProducts) {
      const reviews = await Review.find({ product: product._id });
      if (reviews.length > 0) {
        product.numReviews = reviews.length;
        product.rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await product.save();
      }
    }

    console.log('\n✅ Database seeded successfully!\n');
    console.log('📧 Admin Login: admin@example.com / admin123');
    console.log('📧 User Login:  john@example.com / user123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
