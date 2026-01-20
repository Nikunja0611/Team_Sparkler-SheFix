const express = require('express');
const router = express.Router();
const { registerUser, verifyKYC, translateUI } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/kyc', verifyKYC);
router.post('/translate', translateUI);

module.exports = router;