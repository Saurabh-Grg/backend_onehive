// controllers/authController.js
const registerUserService = require('../services/register');
const passwordResetService = require('../services/passwordReset');
const emailService = require('../utils/email');
const db = require('../config/db');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const bcrypt = require('bcrypt');

// Registration controller
const registerUser = async (req, res) => {
  const { username, email, password, role, city } = req.body;

  // Check for required fields
  if (!username || !email || !password || !role || !city) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    // Call the register service to create a new user
    const user = await registerUserService.registerUser(username, email, password, role, city);
    
    res.status(201).json({ message: 'User registered successfully', user_id: user.user_id });
  } catch (err) {
    if (err.message === 'User already exists') {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User does not exist' });
    }

    // Compare the provided password with the stored password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid password' });
    }

    // If login is successful, generate a JWT token
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Set your expiration time
    });


    // Log the role being sent back
    console.log('User Role:', user.role); // Add this line

    // Return the user details and JWT token
    res.status(200).json({
      status: 'success',
      user: {
        email: user.email, // User's email
        role: user.role,   // User's role (freelancer or client)
        username: user.username,
        user_id: user.user_id,
      },
      token: token, // JWT token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Request password reset
// const requestPasswordReset = (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: 'Please provide an email address' });
//   }

//   const token = passwordResetService.generateResetToken(email);

//   // Send email with the reset token
//   emailService.sendPasswordResetEmail(email, token)
//     .then(() => res.status(200).json({ message: 'Password reset email sent' }))
//     .catch(err => res.status(500).json({ message: 'Error sending email', error: err.message }));
// };
// Request password reset
// const requestPasswordReset = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: 'Please provide an email address' });
//   }

//   try {
//     const token = await passwordResetService.generateResetToken(email); // Await the token here

//     // Send email with the reset token
//     await emailService.sendPasswordResetEmail(email, token);
    
//     res.status(200).json({ message: 'Password reset email sent' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error processing password reset', error: err.message });
//   }
// };

// // Reset password
// const resetPassword = (req, res) => {
//   const { token, newPassword } = req.body;

//   if (!token || !newPassword) {
//     return res.status(400).json({ message: 'Please provide token and new password' });
//   }

//   passwordResetService.resetPassword(token, newPassword, (err, message) => {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }
//     res.status(200).json({ message });
//   });
// };

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address' });
  }

  try {
    const token = await passwordResetService.generateResetToken(email);

    // Send email with the reset token
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await emailService.sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing password reset', error: err.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Please provide a token and a new password' });
  }

  try {
    const message = await passwordResetService.resetPassword(token, newPassword);
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};



// Fetch user details after login to display role-based options
const getUserDetails = (req, res) => {
  const { email } = req.body; // Assume you're sending the email from frontend

  const getUserQuery = 'SELECT role FROM users WHERE email = ?';
  db.query(getUserQuery, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.length > 0) {
      return res.status(200).json({ role: result[0].role });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
};



const createProfile = (req, res) => {
  const { user_id, full_name, bio, skills, work_experience, education, certificates, portfolio_images } = req.body; // Extract data from request
  const profile_picture = req.file ? req.file.filename : null; // Handle uploaded profile picture

  // Validate required fields
  if (!user_id || !full_name || !bio || !skills || !work_experience || !education || !portfolio_images) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  // Call the profile service to create the profile
  profileService.createProfile(user_id, profile_picture, full_name, bio, skills, work_experience, education, certificates, portfolio_images, (err, profileId) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({ message: 'Profile created successfully', profileId });
  });
};



module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  getUserDetails,
  createProfile,
};