const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ['worker', 'seeker'] },
    profession: { type: String }, // e.g., 'Electrician' (only for workers)
    language: { type: String, default: 'en' },
    kycVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false, },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;