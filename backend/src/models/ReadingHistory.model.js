const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    surahNumber: { type: Number, required: true },
    ayahNumber: { type: Number, required: true },
    paraNumber: { type: Number, default: null },
    duration: { type: Number, default: 0 },
    readAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

readingHistorySchema.index({ userId: 1, readAt: -1 });

module.exports = mongoose.model('ReadingHistory', readingHistorySchema);
