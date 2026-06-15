const mongoose = require('mongoose');

const hadithSchema = new mongoose.Schema(
  {
    collection: { type: String, required: true },
    bookNumber: { type: Number, required: true },
    bookName: { type: String, required: true },
    bookNameAr: { type: String, default: '' },
    chapterNumber: { type: Number, required: true },
    chapterName: { type: String, required: true },
    hadithNumber: { type: Number, required: true },
    arabic: { type: String, required: true },
    translation: { type: String, required: true },
    narrator: { type: String, default: '' },
    grade: { type: String, default: 'sahih' },
    reference: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

hadithSchema.index({ collection: 1, hadithNumber: 1 });
hadithSchema.index({ collection: 1, bookNumber: 1, chapterNumber: 1 });
hadithSchema.index({ arabic: 'text', translation: 'text', chapterName: 'text' });

module.exports = mongoose.model('Hadith', hadithSchema);
