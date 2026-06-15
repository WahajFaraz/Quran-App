const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    status: { type: String, enum: ['open', 'answered', 'closed'], default: 'open' },
    isAnonymous: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

questionSchema.index({ status: 1, createdAt: -1 });
questionSchema.index({ categoryId: 1 });

module.exports = mongoose.model('Question', questionSchema);
