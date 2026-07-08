// server/utils/generateToken.js
// Generate JWT token for authentication

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'ecommerce_jwt_secret_key_2024', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
