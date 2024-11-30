const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // importing sequelize instance
const User = require('./userModel'); 

const FreelancerProfile = sequelize.define('FreelancerProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // This references the User model
      key: 'user_id', // This is the column in the User model to which user_id is related
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  education: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Profile image URL (can be null initially)
  },
  portfolioImages: {
    type: DataTypes.JSON, // Store an array of portfolio image URLs
    allowNull: true,
  },
  certificates: {
    type: DataTypes.JSON, // Store an array of certificates as JSON
    allowNull: true,
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt
});

module.exports = FreelancerProfile;
