// routes/auth.js
const express = require('express');
const { registerUser, loginUser, requestPasswordReset, resetPassword } = require('../controllers/authController');

const router = express.Router();

//TODO:TO implment swagger
// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Request password reset route
router.post('/request-password-reset', requestPasswordReset);

// Reset password route
router.post('/reset-password', resetPassword);


module.exports = router;