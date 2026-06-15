const express = require('express');
const {
  getAllProgress, getSurahProgress, updateProgress, markAyahsMemorized,
  setHiddenAyahs, addMistakeNote, getDashboard, setDailyGoal,
} = require('../controllers/hifz.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.get('/progress', getAllProgress);
router.get('/progress/:surah', getSurahProgress);
router.post('/progress', updateProgress);
router.patch('/progress/:surah', updateProgress);
router.patch('/progress/:surah/ayahs', markAyahsMemorized);
router.patch('/progress/:surah/hidden', setHiddenAyahs);
router.post('/progress/:surah/mistakes', addMistakeNote);
router.get('/dashboard', getDashboard);
router.patch('/daily-goal', setDailyGoal);

module.exports = router;
