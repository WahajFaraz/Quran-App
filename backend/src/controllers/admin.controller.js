const User = require('../models/User.model');
const Aalim = require('../models/Aalim.model');
const Category = require('../models/Category.model');
const Report = require('../models/Report.model');
const Question = require('../models/Question.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const { sendPushNotification } = require('../config/firebase');

const getDashboard = catchAsync(async (req, res) => {
  const [totalUsers, totalAalims, pendingAalims, openQuestions, pendingReports] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      Aalim.countDocuments({ verificationStatus: 'verified' }),
      Aalim.countDocuments({ verificationStatus: 'pending' }),
      Question.countDocuments({ status: 'open' }),
      Report.countDocuments({ status: 'pending' }),
    ]);

  sendSuccess(res, {
    totalUsers,
    totalAalims,
    pendingAalims,
    openQuestions,
    pendingReports,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  sendSuccess(res, users, null, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const updateUser = catchAsync(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, user, 'User updated');
});

const getPendingAalims = catchAsync(async (req, res) => {
  const aalims = await Aalim.find({ verificationStatus: 'pending' })
    .populate('userId', 'name email avatar');
  sendSuccess(res, aalims);
});

const verifyAalim = catchAsync(async (req, res) => {
  const aalim = await Aalim.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus: 'verified',
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    },
    { new: true }
  ).populate('userId', 'name email fcmToken');

  if (aalim?.userId?.fcmToken) {
    await sendPushNotification(
      aalim.userId.fcmToken,
      'Verification Approved',
      'Your Aalim profile has been verified. You can now answer questions.'
    );
  }

  sendSuccess(res, aalim, 'Aalim verified');
});

const rejectAalim = catchAsync(async (req, res) => {
  const { reason } = req.body;
  const aalim = await Aalim.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'rejected', rejectionReason: reason },
    { new: true }
  );
  sendSuccess(res, aalim, 'Aalim rejected');
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().sort({ order: 1 });
  sendSuccess(res, categories);
});

const createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  sendSuccess(res, category, 'Category created', 201);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  sendSuccess(res, category, 'Category updated');
});

const deleteCategory = catchAsync(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  sendSuccess(res, null, 'Category deleted');
});

const getReports = catchAsync(async (req, res) => {
  const reports = await Report.find({ status: 'pending' })
    .populate('reporterId', 'name email')
    .sort({ createdAt: -1 });
  sendSuccess(res, reports);
});

const resolveReport = catchAsync(async (req, res) => {
  const { status } = req.body;
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status, resolvedBy: req.user._id },
    { new: true }
  );
  sendSuccess(res, report, 'Report resolved');
});

module.exports = {
  getDashboard,
  getUsers,
  updateUser,
  getPendingAalims,
  verifyAalim,
  rejectAalim,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReports,
  resolveReport,
};
