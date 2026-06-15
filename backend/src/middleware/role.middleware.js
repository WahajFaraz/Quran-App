const ApiError = require('../utils/ApiError');

const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission', 'FORBIDDEN'));
  }
  next();
};

module.exports = { restrictTo };
