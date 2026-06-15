const HifzProgress = require('../models/HifzProgress.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const quranService = require('../services/quran.service');

const getAllProgress = catchAsync(async (req, res) => {
  const progress = await HifzProgress.find({ userId: req.user._id }).sort({ surahNumber: 1 });
  sendSuccess(res, progress);
});

const getSurahProgress = catchAsync(async (req, res) => {
  let progress = await HifzProgress.findOne({
    userId: req.user._id,
    surahNumber: parseInt(req.params.surah),
  });

  if (!progress) {
    progress = await HifzProgress.create({
      userId: req.user._id,
      surahNumber: parseInt(req.params.surah),
    });
  }

  sendSuccess(res, progress);
});

const updateProgress = catchAsync(async (req, res) => {
  const surahNumber = parseInt(req.params.surah);
  const progress = await HifzProgress.findOneAndUpdate(
    { userId: req.user._id, surahNumber },
    req.body,
    { new: true, upsert: true }
  );
  sendSuccess(res, progress, 'Progress updated');
});

const markAyahsMemorized = catchAsync(async (req, res) => {
  const surahNumber = parseInt(req.params.surah);
  const { ayahNumbers } = req.body;

  const progress = await HifzProgress.findOneAndUpdate(
    { userId: req.user._id, surahNumber },
    {
      $addToSet: { memorizedAyahs: { $each: ayahNumbers } },
      status: 'memorizing',
    },
    { new: true, upsert: true }
  );

  const surah = quranService.getSurah(surahNumber);
  const totalAyahs = surah?.ayahs?.length || surah?.numberOfAyahs || 1;
  progress.progressPercent = Math.round((progress.memorizedAyahs.length / totalAyahs) * 100);

  if (progress.progressPercent >= 100) {
    progress.status = 'memorized';
  }

  await progress.save();
  sendSuccess(res, progress, 'Ayahs marked as memorized');
});

const setHiddenAyahs = catchAsync(async (req, res) => {
  const progress = await HifzProgress.findOneAndUpdate(
    { userId: req.user._id, surahNumber: parseInt(req.params.surah) },
    { hiddenAyahs: req.body.ayahNumbers },
    { new: true, upsert: true }
  );
  sendSuccess(res, progress, 'Hidden ayahs updated');
});

const addMistakeNote = catchAsync(async (req, res) => {
  const { ayahNumber, note } = req.body;
  const progress = await HifzProgress.findOneAndUpdate(
    { userId: req.user._id, surahNumber: parseInt(req.params.surah) },
    {
      $push: { mistakeNotes: { ayahNumber, note } },
      status: 'needs_revision',
    },
    { new: true, upsert: true }
  );
  sendSuccess(res, progress, 'Mistake note added');
});

const getDashboard = catchAsync(async (req, res) => {
  const allProgress = await HifzProgress.find({ userId: req.user._id });
  const memorized = allProgress.filter((p) => p.status === 'memorized').length;
  const inProgress = allProgress.filter((p) => p.status === 'memorizing').length;
  const needsRevision = allProgress.filter((p) => p.status === 'needs_revision').length;
  const totalProgress = allProgress.reduce((sum, p) => sum + p.progressPercent, 0);
  const avgProgress = allProgress.length ? Math.round(totalProgress / allProgress.length) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRevision = allProgress.reduce((sum, p) => {
    const entry = p.revisionSchedule.find(
      (r) => new Date(r.date).toDateString() === today.toDateString()
    );
    return sum + (entry?.ayahsReviewed || 0);
  }, 0);

  sendSuccess(res, {
    memorizedSurahs: memorized,
    inProgressSurahs: inProgress,
    needsRevisionSurahs: needsRevision,
    averageProgress: avgProgress,
    todayAyahsReviewed: todayRevision,
    dailyGoal: allProgress[0]?.dailyGoal || 5,
    surahProgress: allProgress,
  });
});

const setDailyGoal = catchAsync(async (req, res) => {
  const { dailyGoal } = req.body;
  await HifzProgress.updateMany({ userId: req.user._id }, { dailyGoal });
  sendSuccess(res, { dailyGoal }, 'Daily goal updated');
});

module.exports = {
  getAllProgress,
  getSurahProgress,
  updateProgress,
  markAyahsMemorized,
  setHiddenAyahs,
  addMistakeNote,
  getDashboard,
  setDailyGoal,
};
