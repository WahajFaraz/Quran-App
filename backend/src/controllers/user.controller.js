const User = require('../models/User.model');
const ReadingHistory = require('../models/ReadingHistory.model');
const Notification = require('../models/Notification.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');

const getMe = catchAsync(async (req, res) => {
  sendSuccess(res, req.user);
});

const updateMe = catchAsync(async (req, res) => {
  const allowed = ['name', 'avatar', 'language', 'darkMode'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  sendSuccess(res, user, 'Profile updated');
});

const updatePreferences = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { preferences: { ...req.user.preferences, ...req.body } },
    { new: true }
  );
  sendSuccess(res, user.preferences, 'Preferences updated');
});

const updateFcmToken = catchAsync(async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) throw new ApiError(400, 'FCM token required');
  await User.findByIdAndUpdate(req.user._id, { fcmToken });
  sendSuccess(res, null, 'FCM token updated');
});

const getReadingHistory = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    ReadingHistory.find({ userId: req.user._id }).sort({ readAt: -1 }).skip(skip).limit(limit),
    ReadingHistory.countDocuments({ userId: req.user._id }),
  ]);

  sendSuccess(res, history, null, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ sentAt: -1 })
    .limit(50);
  sendSuccess(res, notifications);
});

const markNotificationRead = catchAsync(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true }
  );
  sendSuccess(res, null, 'Notification marked as read');
});

module.exports = {
  getMe,
  updateMe,
  updatePreferences,
  updateFcmToken,
  getReadingHistory,
  getNotifications,
  markNotificationRead,
};
