const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import your Sequelize instance
const User = require('./userModel'); // Import the User model for foreign key reference

const WithdrawalRequest = sequelize.define('WithdrawalRequest', {
    withdrawal_request_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    freelancer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference the User model
            key: 'user_id',
        },
        onDelete: 'CASCADE', // Ensures cascading delete
        onUpdate: 'CASCADE', // Ensures cascading update
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.ENUM('eSewa', 'Bank Transfer', 'PayPal'),
        defaultValue: 'eSewa',
    },
    status: {
        type: DataTypes.ENUM('pending', 'processed', 'failed'),
        defaultValue: 'pending',
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    processed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: false, // Disable Sequelize's auto timestamps since custom timestamps are defined
    tableName: 'withdrawal_requests', // Match the table name in the database
});

// Associate with the User model
WithdrawalRequest.belongsTo(User, { foreignKey: 'freelancer_id' });

module.exports = WithdrawalRequest;

