// const { generateEsewaHash } = require("../config/esewaConfig");
// const Payment = require("../models/paymentModel");
// const axios = require("axios");
// const { v4: uuidv4 } = require("uuid");

// const initiatePayment = async (req, res) => {
//   const { job_id, amount } = req.body; // Include job_id for payment association

//   try {
//     // Create a pending payment record
//     const payment = await Payment.create({
//         transactionId: uuidv4(), // Generate unique ID
//       job_id,
//       amount,
//       paymentGateway: "esewa",
//     });

//     // Generate payment hash for eSewa
//     const paymentHash = generateEsewaHash({
//       amount,
//       transaction_uuid: payment.id, // Use Sequelize-generated ID
//     });

//     // Return eSewa payment details
//     res.json({
//       success: true,
//       paymentDetails: {
//         esewaRedirectUrl: `${process.env.ESEWA_GATEWAY_URL}/epay/main`,
//         params: {
//           amt: amount,
//           pid: payment.id, // Unique identifier
//           scd: process.env.ESEWA_PRODUCT_CODE,
//           su: `${process.env.BACKEND_URI}/payment/verify`, // Success callback
//           fu: `${process.env.BACKEND_URI}/payment/failed`, // Failure callback
//           ...paymentHash, // Additional hash parameters
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error initiating payment:", error.message);
//     res.status(500).json({ success: false, error: "Failed to initiate payment" });
//   }
// };

// const verifyPayment = async (req, res) => {
//   const { transaction_uuid, total_amount, transaction_code } = req.query;

//   try {
//     // Fetch the payment record
//     const payment = await Payment.findOne({ where: { id: transaction_uuid } });
//     if (!payment) {
//       return res.status(404).json({ success: false, error: "Payment not found" });
//     }

//     // Verify payment with eSewa API
//     const response = await axios.get(
//       `${process.env.ESEWA_GATEWAY_URL}/epay/transaction/status`,
//       {
//         params: {
//           amt: total_amount,
//           scd: process.env.ESEWA_PRODUCT_CODE,
//           pid: payment.id, // Use payment's unique identifier
//         },
//       }
//     );

//     // Check eSewa's response
//     if (response.data.status === "COMPLETE") {
//       // Update payment status in the database
//       await Payment.update(
//         { status: "success", transactionId: transaction_code, pidx: response.data.pidx },
//         { where: { id: transaction_uuid } }
//       );
//       return res.json({ success: true, message: "Payment verified successfully" });
//     } else {
//       // Update payment status as failed
//       await Payment.update({ status: "failed" }, { where: { id: transaction_uuid } });
//       throw new Error("Payment verification failed");
//     }
//   } catch (error) {
//     console.error("Payment verification error:", error.message);
//     res.status(500).json({ success: false, error: "Payment verification failed" });
//   }
// };

// module.exports = { initiatePayment, verifyPayment };

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
            amt: amount,
            pid: transaction_uuid,
            scd: process.env.ESEWA_PRODUCT_CODE,
            su: `${process.env.BACKEND_URI}/payment/verify`,
            fu: `${process.env.BACKEND_URI}/payment/failed`,
        };

        res.json({
            success: true,
            esewaRedirectUrl: `${process.env.ESEWA_GATEWAY_URL}/epay/main`,
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
