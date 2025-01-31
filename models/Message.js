const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel'); // Import User model

// Define the Message model
const Message = sequelize.define('Message', {
  messageId: {  // Define messageId as primary key
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'audio', 'video', 'document'),
    allowNull: false,
    defaultValue: 'text',
  },
  senderId: {  // Define senderId
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {  // Define receiverId
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

// Define associations (Message belongs to a User)
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
User.hasMany(Message, { foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'receiverId' });

// Sync the model with the database (creates the table if it doesn't exist)
Message.sync();

module.exports = Message;