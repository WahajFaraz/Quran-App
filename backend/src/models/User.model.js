const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: null },
    role: { type: String, enum: ['user', 'aalim', 'admin'], default: 'user' },
    language: { type: String, default: 'en' },
    darkMode: { type: Boolean, default: false },
    fcmToken: { type: String, default: null },
    lastReading: {
      surahNumber: { type: Number, default: 1 },
      ayahNumber: { type: Number, default: 1 },
      paraNumber: { type: Number, default: 1 },
      pageNumber: { type: Number, default: 1 },
      updatedAt: { type: Date, default: Date.now },
    },
    preferences: {
      mushafLayout: { type: String, enum: ['15', '16', '17', '21'], default: '15' },
      qariId: { type: String, default: 'abdul_basit' },
      showTranslation: { type: Boolean, default: true },
      showTafseer: { type: Boolean, default: false },
      fontSize: { type: Number, default: 24 },
      prayerCalculationMethod: { type: Number, default: 2 },
      azanNotifications: { type: Boolean, default: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
