const express = require('express');
const {
  getSurahs, getSurah, getParas, getPara, getAyah, searchQuran,
  getTafseer, getQaris, getAudio, createBookmark, getBookmarks,
  deleteBookmark, updateLastReading,
} = require('../controllers/quran.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/surahs', getSurahs);
router.get('/surahs/:number', getSurah);
router.get('/paras', getParas);
router.get('/paras/:number', getPara);
router.get('/ayahs/:surah/:ayah', getAyah);
router.get('/search', searchQuran);
router.get('/tafseer/:surah/:ayah', getTafseer);
router.get('/qaris', getQaris);
router.get('/audio/:qari/:surah/:ayah', getAudio);

router.use(protect);
router.post('/bookmarks', createBookmark);
router.get('/bookmarks', getBookmarks);
router.delete('/bookmarks/:id', deleteBookmark);
router.patch('/last-reading', updateLastReading);

module.exports = router;
