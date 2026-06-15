const express = require('express');
const {
  getProfile, updateProfile, uploadCertificates,
  getPendingQuestions, getAnsweredQuestions, getPublicProfile,
} = require('../controllers/aalim.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/public/:id', getPublicProfile);

router.use(protect, restrictTo('aalim', 'admin'));
router.get('/profile/me', getProfile);
router.patch('/profile/me', updateProfile);
router.post('/certificates', uploadCertificates);
router.get('/questions/pending', getPendingQuestions);
router.get('/questions/answered', getAnsweredQuestions);

module.exports = router;
