// models/clientProfileModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // importing sequelize instance
const User = require('./userModel'); 

const ClientProfile = sequelize.define('ClientProfile', {
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
        onDelete: 'CASCADE', // Optional: Deletes the client profile if the associated user is deleted
        onUpdate: 'CASCADE', // Optional: Updates the client profile if the associated user's ID changes
      },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  website: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  profileImageUrl: {
    type: DataTypes.STRING, // This stores the file path of the uploaded image
    allowNull: true
  }
}, {
  timestamps: true // automatically includes createdAt and updatedAt
});


module.exports = ClientProfile;
