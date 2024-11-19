const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Import the User model

// Function to register a new user
const registerUser = async (username, email, password, role, city) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database using the User model
    const newUser = await User.create({
      username: username, // Assuming full_name is used as username
      email,
      password: hashedPassword,
      role,
      city,
    });

    return newUser; // Return the newly created user
  } catch (err) {
    throw err; // Propagate the error to be handled in the controller
  }
};

module.exports = {
  registerUser,
};