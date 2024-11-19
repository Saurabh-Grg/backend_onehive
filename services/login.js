const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Import the database connection
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Your secret key from .env

// Function to login a user
const loginUser = (email, password, callback) => {
  // Check if the user exists in the database
  const query = 'SELECT email, role, username, password FROM users WHERE email = ?'; // Ensure you're selecting email and role
  db.query(query, [email], (err, result) => {
    if (err) return callback(err, null);
    
    if (result.length === 0) {
      return callback(new Error('User does not exist'), null);
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) return callback(err, null);

      if (!isMatch) {
        return callback(new Error('Invalid password'), null);
      }

      // Generate a token
      const token = jwt.sign({
        email: result[0].email,
        role: result[0].role,
        username: result[0].username,
        user_id: result[0].user_id,
      }, JWT_SECRET, { expiresIn: '1h' });

      // Return user data (excluding the password) and token
      const { password, ...user } = result[0]; // Exclude the password from the user object
      user.token = token; // Add the token to the user object
      callback(null, user);
    });
  });
};

module.exports = {
  loginUser,
};