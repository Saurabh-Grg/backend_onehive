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
    type: DataTypes.TEXT,
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
    type: DataTypes.TEXT, // Keep it as TEXT because LONGTEXT maps to TEXT in Sequelize
    allowNull: true,
    get() {
      // Convert the stored string back into a JSON object/array if it is valid JSON
      const value = this.getDataValue('portfolioImages');
      return value ? JSON.parse(value) : []; // Return an empty array if no data
    },
    set(value) {
      // Convert the array or object to a JSON string before storing
      this.setDataValue('portfolioImages', JSON.stringify(value));
    },
  },
  certificates: {
    type: DataTypes.TEXT, // Keep it as TEXT because LONGTEXT maps to TEXT in Sequelize
    allowNull: true,
    get() {
      // Convert the stored string back into a JSON object/array if it is valid JSON
      const value = this.getDataValue('certificates');
      return value ? JSON.parse(value) : []; // Return an empty array if no data
    },
    set(value) {
      // Convert the array or object to a JSON string before storing
      this.setDataValue('certificates', JSON.stringify(value));
    },
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt
});

// models/freelancerProfileModel.js
FreelancerProfile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user', // You can use 'user' to access the user data
});

module.exports = FreelancerProfile;