// models/followModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importing the Sequelize instance
const User = require('./userModel'); // Import the User model

// Define the Follow model
const Follow = sequelize.define('Follow', {
  follow_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE', // Automatically delete follow relationship if user is deleted
  },
  followedId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE', // Automatically delete follow relationship if user is deleted
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt fields
});

// Export the Follow model
module.exports = Follow;
