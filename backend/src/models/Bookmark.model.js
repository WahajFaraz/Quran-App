const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['ayah', 'hadith', 'surah'], required: true },
    surahNumber: { type: Number, default: null },
    ayahNumber: { type: Number, default: null },
    hadithId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hadith', default: null },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, type: 1 });
bookmarkSchema.index(
  { userId: 1, surahNumber: 1, ayahNumber: 1 },
  { unique: true, partialFilterExpression: { type: 'ayah' } }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
