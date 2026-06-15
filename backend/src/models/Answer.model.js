const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    aalimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Aalim', required: true },
    body: { type: String, required: true },
    references: [{ type: String }],
    isAccepted: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

answerSchema.index({ questionId: 1 });

module.exports = mongoose.model('Answer', answerSchema);
