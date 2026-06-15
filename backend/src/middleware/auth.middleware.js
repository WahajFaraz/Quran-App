const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User.model');
const { verifyFirebaseToken } = require('../config/firebase');

const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token', 'UNAUTHORIZED');
    }

    let user = null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id);
    } catch {
      const firebaseUser = await verifyFirebaseToken(token);
      if (firebaseUser) {
        user = await User.findOne({ firebaseUid: firebaseUser.uid });
      }
    }

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Not authorized', 'UNAUTHORIZED');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
      } catch {
        // optional auth - ignore invalid token
      }
    }
    next();
  } catch {
    next();
  }
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { protect, optionalAuth, generateToken };
