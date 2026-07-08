// server/middleware/admin.js
// Admin authorization middleware — must be used after protect middleware

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied — admin privileges required',
    });
  }
};

module.exports = { admin };
