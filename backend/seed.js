const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // You might need to npm install bcryptjs
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. CLEAR EXISTING DATA
    await User.deleteMany();
    await Job.deleteMany();
    console.log('🧹 Cleared existing data');

    // 2. CREATE PASSWORD HASH
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt); // Default password for everyone

    // 3. CREATE USERS (Seekers & Workers)
    const users = await User.insertMany([
      // --- WORKERS ---
      {
        name: "Savita Devi",
        email: "savita@example.com",
        password: hashedPassword,
        phone: "9876543210",
        role: "worker",
        profession: "Cleaner",
        language: "hi",
        kycVerified: true
      },
      {
        name: "Riya Patel",
        email: "riya@example.com",
        password: hashedPassword,
        phone: "9876543211",
        role: "worker",
        profession: "Electrician",
        language: "en",
        kycVerified: true
      },
      {
        name: "Sunita Sharma",
        email: "sunita@example.com",
        password: hashedPassword,
        phone: "9876543212",
        role: "worker",
        profession: "Cook",
        language: "hi",
        kycVerified: true
      },
      {
        name: "Laxmi Singh",
        email: "laxmi@example.com",
        password: hashedPassword,
        phone: "9876543213",
        role: "worker",
        profession: "Gardener",
        language: "mr", // Marathi
        kycVerified: true
      },

      // --- SEEKERS (Homeowners) ---
      {
        name: "Anjali Gupta",
        email: "anjali@example.com",
        password: hashedPassword,
        phone: "9123456780",
        role: "seeker",
        kycVerified: true
      },
      {
        name: "Priya Nair",
        email: "priya@example.com",
        password: hashedPassword,
        phone: "9123456781",
        role: "seeker",
        kycVerified: true
      }
    ]);

    const seeker1 = users[4]._id; // Anjali
    const seeker2 = users[5]._id; // Priya

    // 4. CREATE JOBS (Short Term & Long Term)
    await Job.insertMany([
      // --- SHORT TERM GIGS ---
      {
        title: "Deep House Cleaning",
        location: "Sector 12, Navi Mumbai",
        pay: 350,
        unit: "hr",
        serviceType: "Short Term",
        category: "Cleaning",
        duration: "4 Hours (Today)",
        description: "Need deep cleaning for 2 BHK apartment before festival.",
        postedBy: seeker1,
        safetyVerified: true
      },
      {
        title: "Fan Repair & Switch Fixing",
        location: "Vashi, Navi Mumbai",
        pay: 500,
        unit: "task",
        serviceType: "Short Term",
        category: "Electrician",
        duration: "1-2 Hours",
        description: "Ceiling fan making noise, one switch board replacement.",
        postedBy: seeker2,
        safetyVerified: true
      },
      {
        title: "Balcony Garden Trimming",
        location: "Nerul, Mumbai",
        pay: 400,
        unit: "hr",
        serviceType: "Short Term",
        category: "Gardener",
        duration: "2 Hours",
        description: "Trimming plants and changing soil for 10 pots.",
        postedBy: seeker1,
        safetyVerified: true
      },
      {
        title: "Utensil Cleaning (One Day)",
        location: "Kharghar, Mumbai",
        pay: 200,
        unit: "hr",
        serviceType: "Short Term",
        category: "Cleaning",
        duration: "1 Hour",
        postedBy: seeker2,
        safetyVerified: false // Verification Pending example
      },

      // --- LONG TERM JOBS ---
      {
        title: "Full-Time Cook (Morning/Evening)",
        location: "Belapur, Mumbai",
        pay: 15000,
        unit: "month",
        serviceType: "Long Term",
        category: "Cooking",
        duration: "6 Months Contract",
        description: "Cooking for family of 4. North Indian food preferred.",
        postedBy: seeker1,
        safetyVerified: true
      },
      {
        title: "Elderly Caretaker (Night Shift)",
        location: "Seawoods, Mumbai",
        pay: 18000,
        unit: "month",
        serviceType: "Long Term",
        category: "Caregiver",
        duration: "1 Year Contract",
        description: "Need female caretaker for elderly mother. 8PM to 8AM.",
        postedBy: seeker2,
        safetyVerified: true
      },
      {
        title: "Daily House Maid",
        location: "Panvel, Mumbai",
        pay: 8000,
        unit: "month",
        serviceType: "Long Term",
        category: "Cleaning",
        duration: "Ongoing",
        description: "Sweeping, mopping, and dusting daily.",
        postedBy: seeker1,
        safetyVerified: true
      }
    ]);

    console.log('🌱 Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();