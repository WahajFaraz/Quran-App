const Hadith = require('../models/Hadith.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');

const COLLECTIONS = [
  { id: 'bukhari', name: 'Sahih al-Bukhari', nameAr: 'صحيح البخاري', author: 'Imam Bukhari', totalHadith: 7563 },
  { id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم', author: 'Imam Muslim', totalHadith: 7563 },
  { id: 'abudawud', name: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', author: 'Imam Abu Dawud', totalHadith: 5274 },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', author: 'Imam Tirmidhi', totalHadith: 3956 },
  { id: 'nasai', name: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', author: "Imam an-Nasa'i", totalHadith: 5761 },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', author: 'Ibn Majah', totalHadith: 4341 },
];

const getCollections = catchAsync(async (req, res) => {
  sendSuccess(res, COLLECTIONS);
});

const getBooks = catchAsync(async (req, res) => {
  const books = await Hadith.aggregate([
    { $match: { collection: req.params.collection } },
    {
      $group: {
        _id: '$bookNumber',
        bookName: { $first: '$bookName' },
        bookNameAr: { $first: '$bookNameAr' },
        hadithCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        bookNumber: '$_id',
        bookName: 1,
        bookNameAr: 1,
        hadithCount: 1,
        _id: 0,
      },
    },
  ]);
  sendSuccess(res, books);
});

const getChapters = catchAsync(async (req, res) => {
  const chapters = await Hadith.aggregate([
    {
      $match: {
        collection: req.params.collection,
        bookNumber: parseInt(req.params.book),
      },
    },
    {
      $group: {
        _id: '$chapterNumber',
        chapterName: { $first: '$chapterName' },
        hadithCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        chapterNumber: '$_id',
        chapterName: 1,
        hadithCount: 1,
        _id: 0,
      },
    },
  ]);
  sendSuccess(res, chapters);
});

const getHadith = catchAsync(async (req, res) => {
  const hadith = await Hadith.findOne({
    collection: req.params.collection,
    hadithNumber: parseInt(req.params.number),
  });
  if (!hadith) throw new ApiError(404, 'Hadith not found');
  sendSuccess(res, hadith);
});

const getChapterHadiths = catchAsync(async (req, res) => {
  const hadiths = await Hadith.find({
    collection: req.params.collection,
    bookNumber: parseInt(req.params.book),
    chapterNumber: parseInt(req.params.chapter),
  }).sort({ hadithNumber: 1 });
  sendSuccess(res, hadiths);
});

const searchHadith = catchAsync(async (req, res) => {
  const { q, collection } = req.query;
  if (!q || q.length < 2) throw new ApiError(400, 'Search query too short');

  const filter = { $text: { $search: q } };
  if (collection) filter.collection = collection;

  const results = await Hadith.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);

  sendSuccess(res, results);
});

module.exports = {
  getCollections,
  getBooks,
  getChapters,
  getHadith,
  getChapterHadiths,
  searchHadith,
};
