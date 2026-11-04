
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find authenticated user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'User not found. Please log in again.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token.'
    });
  }
};


// Only boss@gmail.com can access admin routes
const admin = (req, res, next) => {

  if (
    req.user &&
    req.user.email === 'boss@gmail.com' &&
    req.user.role === 'admin'
  ) {
    return next();
  }

  return res.status(403).json({
    message: 'Access forbidden. Only authorized admin can access.'
  });
};

module.exports = { protect, admin };
