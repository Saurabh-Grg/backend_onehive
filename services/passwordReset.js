// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// const User = require('../models/userModel'); // Import the User model
// const { Op } = require('sequelize');

// // Function to generate a password reset token
// const generateResetToken = async (email) => {
//   const token = crypto.randomBytes(32).toString('hex');
//   const expiration = Date.now() + 3600000; // 1 hour from now

//   try {
//     // Check if user exists
//     const userExists = await User.findOne({ where: { email } });
//     if (!userExists) {
//       throw new Error('User not found');
//     }

//     await User.update(
//       { reset_password_token: token, reset_password_expires: expiration },
//       { where: { email } }
//     );
//   } catch (err) {
//     throw new Error('Database error: ' + err.message);
//   }

//   return token;
// };

// // Function to reset the password
// const resetPassword = async (token, newPassword) => {
//   // Check if the token is valid and not expired
//   const user = await User.findOne({
//     where: {
//       reset_password_token: token,
//       reset_password_expires: {
//         [Op.gt]: Date.now(), // Ensure the expiration is still valid
//       },
//     },
//   });

//   if (!user) {
//     throw new Error('Invalid or expired token');
//   }

//   // Hash the new password
//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   // Update the user's password and clear the reset token
//   await User.update(
//     {
//       password: hashedPassword,
//       reset_password_token: null,
//       reset_password_expires: null,
//     },
//     {
//       where: { reset_password_token: token },
//     }
//   );

//   return 'Password reset successful';
// };

// module.exports = {
//   generateResetToken,
//   resetPassword,
// };


const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/userModel'); // User model

// Generate a password reset token
const generateResetToken = async (email) => {
  const token = crypto.randomBytes(32).toString('hex'); // Generate a random token
  const expiration = Date.now() + 3600000; // Token valid for 1 hour

  // Check if the user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  // Store the token and expiration in the database
  await User.update(
    {
      reset_password_token: token,
      reset_password_expires: expiration,
    },
    { where: { email } }
  );

  return token;
};

const resetPassword = async (token, newPassword) => {
  // Ensure the token and newPassword are valid before proceeding
  if (!token || !newPassword) {
    throw new Error('Token and new password are required');
  }

  // Check if the token is valid and not expired
  const user = await User.findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: {
        [Op.gt]: Date.now(), // Ensure the expiration is still valid
      },
    },
  });

  // If no user is found or token is expired
  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token
  await User.update(
    {
      password: hashedPassword,
      reset_password_token: null, // Clear the reset token after successful password reset
      reset_password_expires: null, // Clear the expiration field
    },
    {
      where: { user_id: user.user_id }, // Make sure to use the correct field for the WHERE clause
    }
  );

  return 'Password reset successful';
};

module.exports = {
  generateResetToken,
  resetPassword,
};
