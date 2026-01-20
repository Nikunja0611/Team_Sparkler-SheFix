const Job = require('../models/Job');

// Get all jobs (with filters)
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs };