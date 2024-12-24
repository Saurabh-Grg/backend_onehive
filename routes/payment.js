// routes/payment.js
const express = require('express');
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const router = express.Router();

router.post('/initialize', initiatePayment); // Start a new payment
router.get('/verify', verifyPayment); // Verify payment status

module.exports = router;
