// server/config/cloudinary.js
// Cloudinary configuration for image uploads

const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('☁️  Cloudinary configured');
    return true;
  }
  console.log('📁 Using local file uploads (Cloudinary not configured)');
  return false;
};

module.exports = { cloudinary, configureCloudinary };
