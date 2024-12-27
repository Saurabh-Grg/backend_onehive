// routes/payment.js
const express = require('express');
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const router = express.Router();
const authenticateUser = require('../middleware/auth');


router.post('/initialize', authenticateUser, initiatePayment); // Start a new payment
router.get('/verify', verifyPayment); // Verify payment status

module.exports = router;
