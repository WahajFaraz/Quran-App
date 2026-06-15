const express = require('express');
const {
  getCategories, getQuestions, createQuestion, getQuestion,
  getMyQuestions, createAnswer, acceptAnswer, markHelpful,
} = require('../controllers/qa.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestion);

router.use(protect);
router.post('/questions', createQuestion);
router.get('/questions/my/list', getMyQuestions);
router.post('/questions/:id/answers', restrictTo('aalim', 'admin'), createAnswer);
router.patch('/answers/:id/accept', acceptAnswer);
router.post('/answers/:id/helpful', markHelpful);

module.exports = router;
