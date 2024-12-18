// routes/auth.js
const express = require('express');
const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');

const router = express.Router();

//TODO:TO implment swagger
// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword); // Forgot password route

router.post('/verify-otp', verifyOtp);            // Step 2: Verify OTP
router.post('/reset-password', resetPassword);   // Reset password route

module.exports = router;