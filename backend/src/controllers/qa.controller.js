const Category = require('../models/Category.model');
const Question = require('../models/Question.model');
const Answer = require('../models/Answer.model');
const Aalim = require('../models/Aalim.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const { sendPushNotification } = require('../config/firebase');
const User = require('../models/User.model');

const getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 });
  sendSuccess(res, categories);
});

const getQuestions = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.category) filter.categoryId = req.query.category;
  if (req.query.status) filter.status = req.query.status;

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .populate('categoryId', 'name nameAr slug icon')
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Question.countDocuments(filter),
  ]);

  sendSuccess(res, questions, null, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const createQuestion = catchAsync(async (req, res) => {
  const { categoryId, title, body, isAnonymous } = req.body;
  if (!categoryId || !title || !body) {
    throw new ApiError(400, 'Category, title and body are required');
  }

  const question = await Question.create({
    userId: req.user._id,
    categoryId,
    title,
    body,
    isAnonymous: isAnonymous || false,
  });

  sendSuccess(res, question, 'Question submitted', 201);
});

const getQuestion = catchAsync(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate('categoryId', 'name nameAr slug')
    .populate('userId', 'name avatar');

  if (!question) throw new ApiError(404, 'Question not found');

  const answers = await Answer.find({ questionId: question._id })
    .populate({ path: 'aalimId', populate: { path: 'userId', select: 'name avatar' } })
    .sort({ isAccepted: -1, helpfulCount: -1, createdAt: 1 });

  sendSuccess(res, { question, answers });
});

const getMyQuestions = catchAsync(async (req, res) => {
  const questions = await Question.find({ userId: req.user._id })
    .populate('categoryId', 'name nameAr')
    .sort({ createdAt: -1 });
  sendSuccess(res, questions);
});

const createAnswer = catchAsync(async (req, res) => {
  const aalim = await Aalim.findOne({ userId: req.user._id, verificationStatus: 'verified' });
  if (!aalim) throw new ApiError(403, 'Only verified Aalims can answer');

  const { body, references } = req.body;
  const answer = await Answer.create({
    questionId: req.params.id,
    aalimId: aalim._id,
    body,
    references: references || [],
  });

  await Question.findByIdAndUpdate(req.params.id, { status: 'answered' });
  await Aalim.findByIdAndUpdate(aalim._id, { $inc: { answeredCount: 1 } });

  const question = await Question.findById(req.params.id);
  const questionUser = await User.findById(question.userId);
  if (questionUser?.fcmToken) {
    await sendPushNotification(
      questionUser.fcmToken,
      'Your question was answered',
      'An Aalim has answered your Islamic question'
    );
  }

  sendSuccess(res, answer, 'Answer posted', 201);
});

const acceptAnswer = catchAsync(async (req, res) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) throw new ApiError(404, 'Answer not found');

  const question = await Question.findById(answer.questionId);
  if (question.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only question author can accept answers');
  }

  await Answer.updateMany({ questionId: answer.questionId }, { isAccepted: false });
  answer.isAccepted = true;
  await answer.save();

  sendSuccess(res, answer, 'Answer accepted');
});

const markHelpful = catchAsync(async (req, res) => {
  const answer = await Answer.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  );
  sendSuccess(res, answer, 'Marked as helpful');
});

module.exports = {
  getCategories,
  getQuestions,
  createQuestion,
  getQuestion,
  getMyQuestions,
  createAnswer,
  acceptAnswer,
  markHelpful,
};
