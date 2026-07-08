// server/routes/paymentRoutes.js
const express = require('express');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, processPayment);
router.get('/:orderId', protect, getPaymentStatus);

module.exports = router;
