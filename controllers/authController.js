// controllers/authController.js
const registerUserService = require('../services/register');
// const passwordResetService = require('../services/passwordReset');
const nodemailer = require('nodemailer');

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
      expiresIn: '30d', // Set your expiration time
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

// Step 1: Generate OTP and send to email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('Email in forgotPassword:', email); 

  try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ message: 'Email not registered' });
      }

      // Generate a random OTP (6 digits)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();


      // Save OTP to the user model or cache for validation
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
      await user.save();

      // Send OTP via email using Nodemailer
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset OTP',
          text: `Dear ${user.username},\n\nYour OTP for password reset is: ${otp}.\n\nThank you,\nOneHive Team`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};


// Step 2: Verify OTP (New route)
const verifyOtp = async (req, res) => {
  console.log('Request body in verifyOtp:', req.body); // Log request body
  const { email, otp } = req.body;
  console.log('Email in verifyOtp:', email, 'OTP:', otp); // Log email and otp

  try {
      const user = await User.findOne({ where: { email } });

      if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // OTP is valid; Clear OTP fields but inform the client that verification was successful
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Step 3: Reset Password (Only after OTP verification)
const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (newPassword !== confirmPassword) {
          console.log('Password mismatch error');
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUserDetails,
  createProfile,
};