// models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importing the Sequelize instance
const Message = require('./messageModel'); // Import the Message model



const User = sequelize.define('User', {
  // Define the fields for the User model
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50], // Username must be between 3 and 50 characters
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // Password must be at least 6 characters long
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensures the email format is valid
    }
  },
  role: {
    type: DataTypes.ENUM('client', 'freelancer'), // Role can be either 'client' or 'freelancer'
    allowNull: false,
  },
  city: { // Adding the city column
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt fields
});


module.exports =  User ; // Export the User model