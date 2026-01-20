const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true }, // e.g., "Nerul, Navi Mumbai"
    pay: { type: Number, required: true }, // e.g., 300 or 15000
    unit: { type: String, required: true, enum: ['hr', 'day', 'month', 'task'] }, // hr/month
    serviceType: { type: String, required: true, enum: ['Short Term', 'Long Term'] },
    category: { type: String, required: true }, // Cleaning, Cooking, etc.
    duration: { type: String, required: true }, // "2 Hours" or "6 Months"
    description: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The Seeker who posted it
    status: { type: String, default: 'Open', enum: ['Open', 'Accepted', 'Completed'] },
    safetyVerified: { type: Boolean, default: true } // Pink-Shield Status
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;