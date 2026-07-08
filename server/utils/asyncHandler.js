// server/utils/asyncHandler.js
// Wraps async route handlers to catch errors and pass them to Express error middleware.
// Required for Express 5 compatibility where `next` may not be passed to terminal handlers.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
