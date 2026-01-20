const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['worker', 'customer'], required: true },
  isVerified: { type: Boolean, default: false },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  language: { type: String, default: 'en' }, // 'en', 'hi', 'mr'
  skills: [String], // Only for workers
  trustScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);