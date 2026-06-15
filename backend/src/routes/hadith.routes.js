const express = require('express');
const {
  getCollections, getBooks, getChapters, getHadith,
  getChapterHadiths, searchHadith,
} = require('../controllers/hadith.controller');

const router = express.Router();

router.get('/collections', getCollections);
router.get('/search', searchHadith);
router.get('/:collection/books', getBooks);
router.get('/:collection/books/:book/chapters', getChapters);
router.get('/:collection/:number', getHadith);
router.get('/:collection/books/:book/chapters/:chapter', getChapterHadiths);

module.exports = router;
