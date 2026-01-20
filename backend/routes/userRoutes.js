const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getWorkers } = require('../controllers/userController');
// 1. Existing Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/workers', getWorkers);

// 2. ADD THIS NEW ROUTE (The Fix)
router.post('/kyc', (req, res) => {
    console.log("KYC Data Received:", req.body);
    
    // Simulate a successful verification response
    res.status(200).json({ 
        success: true, 
        message: "KYC Verified Successfully",
        user: { isVerified: true }
    });
});

// 3. Placeholder for Translation (Optional, prevents 404s later)
router.post('/translate', (req, res) => {
    res.json({ translatedText: "This is a dummy translation." });
});

module.exports = router;