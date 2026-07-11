// server/config/db.js
// MongoDB connection configuration using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Event listeners for robust error handling
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected!');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected!');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    // Support both MONGODB_URI and MONGO_URI from .env
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    
    const conn = await mongoose.connect(uri);
    
    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ Initial MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
