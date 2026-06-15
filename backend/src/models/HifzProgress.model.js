const mongoose = require('mongoose');

const mistakeNoteSchema = new mongoose.Schema({
  ayahNumber: { type: Number, required: true },
  note: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const revisionEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  ayahsReviewed: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
});

const hifzProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    surahNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['not_started', 'memorizing', 'memorized', 'needs_revision'],
      default: 'not_started',
    },
    memorizedAyahs: [{ type: Number }],
    hiddenAyahs: [{ type: Number }],
    mistakeNotes: [mistakeNoteSchema],
    dailyGoal: { type: Number, default: 5 },
    revisionSchedule: [revisionEntrySchema],
    progressPercent: { type: Number, default: 0 },
    lastRevisedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

hifzProgressSchema.index({ userId: 1, surahNumber: 1 }, { unique: true });

module.exports = mongoose.model('HifzProgress', hifzProgressSchema);
