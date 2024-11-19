// utils/email.js
const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send password reset email
const sendPasswordResetEmail = (email, token) => {
  const resetLink = `http://localhost:3000/api/auth/reset-password?token=${token}`; // Update the link according to your setup

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
};