const mongoose = require('mongoose');

const aalimSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    qualifications: { type: String, default: '' },
    specialization: [{ type: String }],
    sanadCertificate: { type: String, default: null },
    degreeCertificate: { type: String, default: null },
    bio: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
    answeredCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Aalim', aalimSchema);
