const Bookmark = require('../models/Bookmark.model');
const ReadingHistory = require('../models/ReadingHistory.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const quranService = require('../services/quran.service');

const getSurahs = catchAsync(async (req, res) => {
  sendSuccess(res, quranService.getSurahs());
});

const getSurah = catchAsync(async (req, res) => {
  const surah = quranService.getSurah(parseInt(req.params.number));
  if (!surah) throw new ApiError(404, 'Surah not found');
  sendSuccess(res, surah);
});

const getParas = catchAsync(async (req, res) => {
  sendSuccess(res, quranService.getParas());
});

const getPara = catchAsync(async (req, res) => {
  const para = quranService.getPara(parseInt(req.params.number));
  sendSuccess(res, para);
});

const getAyah = catchAsync(async (req, res) => {
  const ayah = quranService.getAyah(
    parseInt(req.params.surah),
    parseInt(req.params.ayah)
  );
  if (!ayah) throw new ApiError(404, 'Ayah not found');
  sendSuccess(res, ayah);
});

const searchQuran = catchAsync(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) throw new ApiError(400, 'Search query too short');
  const results = quranService.searchQuran(q);
  sendSuccess(res, results.slice(0, 50));
});

const getTafseer = catchAsync(async (req, res) => {
  const tafseer = quranService.getTafseer(
    parseInt(req.params.surah),
    parseInt(req.params.ayah)
  );
  sendSuccess(res, tafseer);
});

const getQaris = catchAsync(async (req, res) => {
  sendSuccess(res, quranService.getQaris());
});

const getAudio = catchAsync(async (req, res) => {
  const audio = quranService.getAudioUrl(
    req.params.qari,
    parseInt(req.params.surah),
    parseInt(req.params.ayah)
  );
  sendSuccess(res, audio);
});

const createBookmark = catchAsync(async (req, res) => {
  const { type, surahNumber, ayahNumber, hadithId, note } = req.body;
  const bookmark = await Bookmark.create({
    userId: req.user._id,
    type,
    surahNumber,
    ayahNumber,
    hadithId,
    note,
  });
  sendSuccess(res, bookmark, 'Bookmark created', 201);
});

const getBookmarks = catchAsync(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.type) filter.type = req.query.type;
  const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
  sendSuccess(res, bookmarks);
});

const deleteBookmark = catchAsync(async (req, res) => {
  const bookmark = await Bookmark.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!bookmark) throw new ApiError(404, 'Bookmark not found');
  sendSuccess(res, null, 'Bookmark removed');
});

const updateLastReading = catchAsync(async (req, res) => {
  const { surahNumber, ayahNumber, paraNumber, pageNumber } = req.body;
  const lastReading = {
    surahNumber,
    ayahNumber,
    paraNumber,
    pageNumber,
    updatedAt: new Date(),
  };

  await User.findByIdAndUpdate(req.user._id, { lastReading });
  await ReadingHistory.create({
    userId: req.user._id,
    surahNumber,
    ayahNumber,
    paraNumber,
    duration: req.body.duration || 0,
  });

  sendSuccess(res, lastReading, 'Reading position saved');
});

module.exports = {
  getSurahs,
  getSurah,
  getParas,
  getPara,
  getAyah,
  searchQuran,
  getTafseer,
  getQaris,
  getAudio,
  createBookmark,
  getBookmarks,
  deleteBookmark,
  updateLastReading,
};
