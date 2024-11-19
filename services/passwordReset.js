const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Import the User model
const { Op } = require('sequelize');

// Function to generate a password reset token
const generateResetToken = async (email) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiration = Date.now() + 3600000; // 1 hour from now

  try {
    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      throw new Error('User not found');
    }

    await User.update(
      { reset_password_token: token, reset_password_expires: expiration },
      { where: { email } }
    );
  } catch (err) {
    throw new Error('Database error: ' + err.message);
  }

  return token;
};

// Function to reset the password
const resetPassword = async (token, newPassword) => {
  // Check if the token is valid and not expired
  const user = await User.findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: {
        [Op.gt]: Date.now(), // Ensure the expiration is still valid
      },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token
  await User.update(
    {
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    },
    {
      where: { reset_password_token: token },
    }
  );

  return 'Password reset successful';
};

module.exports = {
  generateResetToken,
  resetPassword,
};