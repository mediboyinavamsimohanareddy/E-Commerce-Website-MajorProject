// server/controllers/paymentController.js
// Mock payment processing

const Payment = require('../models/Payment');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Process payment (mock)
// @route   POST /api/payments
// @access  Private
const processPayment = asyncHandler(async (req, res) => {
  const { orderId, method = 'card' } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  // Mock payment processing
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const payment = await Payment.create({
    order: orderId,
    user: req.user._id,
    amount: order.totalPrice,
    method,
    status: 'completed',
    transactionId,
  });

  // Update order payment status
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'processing';
  order.paymentResult = {
    id: transactionId,
    status: 'completed',
    update_time: new Date().toISOString(),
    email_address: req.user.email,
  };
  await order.save();

  res.json({ success: true, data: payment });
});

// @desc    Get payment status
// @route   GET /api/payments/:orderId
// @access  Private
const getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ order: req.params.orderId });
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.json({ success: true, data: payment });
});

module.exports = { processPayment, getPaymentStatus };
