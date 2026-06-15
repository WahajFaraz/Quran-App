const Aalim = require('../models/Aalim.model');
const Question = require('../models/Question.model');
const Answer = require('../models/Answer.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');

const getProfile = catchAsync(async (req, res) => {
  const aalim = await Aalim.findOne({ userId: req.user._id });
  if (!aalim) throw new ApiError(404, 'Aalim profile not found');
  sendSuccess(res, aalim);
});

const updateProfile = catchAsync(async (req, res) => {
  const allowed = ['fullName', 'qualifications', 'specialization', 'bio'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const aalim = await Aalim.findOneAndUpdate({ userId: req.user._id }, updates, { new: true });
  sendSuccess(res, aalim, 'Profile updated');
});

const uploadCertificates = catchAsync(async (req, res) => {
  const { sanadCertificate, degreeCertificate } = req.body;
  const aalim = await Aalim.findOneAndUpdate(
    { userId: req.user._id },
    { sanadCertificate, degreeCertificate, verificationStatus: 'pending' },
    { new: true }
  );
  sendSuccess(res, aalim, 'Certificates uploaded');
});

const getPendingQuestions = catchAsync(async (req, res) => {
  const questions = await Question.find({ status: 'open' })
    .populate('categoryId', 'name nameAr')
    .populate('userId', 'name')
    .sort({ createdAt: 1 })
    .limit(50);
  sendSuccess(res, questions);
});

const getAnsweredQuestions = catchAsync(async (req, res) => {
  const aalim = await Aalim.findOne({ userId: req.user._id });
  const answers = await Answer.find({ aalimId: aalim._id })
    .populate({ path: 'questionId', populate: { path: 'categoryId', select: 'name' } })
    .sort({ createdAt: -1 });
  sendSuccess(res, answers);
});

const getPublicProfile = catchAsync(async (req, res) => {
  const aalim = await Aalim.findById(req.params.id)
    .populate('userId', 'name avatar');
  if (!aalim || aalim.verificationStatus !== 'verified') {
    throw new ApiError(404, 'Aalim not found');
  }
  sendSuccess(res, aalim);
});

module.exports = {
  getProfile,
  updateProfile,
  uploadCertificates,
  getPendingQuestions,
  getAnsweredQuestions,
  getPublicProfile,
};
