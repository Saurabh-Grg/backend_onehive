// controllers/paymentController.js
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/paymentModel');
const axios = require('axios');
require('dotenv').config();

const initiatePayment = async (req, res) => {
    const { client_id, freelancer_id, job_id, amount } = req.body;

    try {
        // Create a pending payment record
        const payment = await Payment.create({
            client_id,
            freelancer_id,
            job_id,
            amount,
            status: 'pending',
        });

        // Generate unique transaction ID
        const transaction_uuid = uuidv4();

        // Construct payment details
        const paymentDetails = {
            total_amount: amount,
            pid: transaction_uuid,
            scd: process.env.ESEWA_PRODUCT_CODE,
            su: `${process.env.BACKEND_URI}/payment/verify`,
            fu: `${process.env.BACKEND_URI}/payment/failed`,
        };

        res.json({
            success: true,
            esewaRedirectUrl: `${process.env.ESEWA_GATEWAY_URL}/api/epay/main`,
            params: paymentDetails,
        });
    } catch (error) {
        console.error('Error initiating payment:', error.message);
        res.status(500).json({ success: false, error: 'Failed to initiate payment' });
    }
};

const verifyPayment = async (req, res) => {
    const { pid, amt } = req.query;

    try {
        const response = await axios.get(`${process.env.ESEWA_GATEWAY_URL}/epay/transaction`, {
            params: {
                amt,
                scd: process.env.ESEWA_PRODUCT_CODE,
                pid,
            },
        });

        if (response.data.status === 'COMPLETE') {
            await Payment.update({ status: 'released' }, { where: { payment_id: pid } });
            return res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            await Payment.update({ status: 'failed' }, { where: { payment_id: pid } });
            return res.status(400).json({ success: false, error: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Payment verification error:', error.message);
        res.status(500).json({ success: false, error: 'Payment verification failed' });
    }
};

module.exports = { initiatePayment, verifyPayment };


// this page needs to be refactored to use the new payment model
