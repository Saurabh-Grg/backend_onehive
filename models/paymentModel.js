// models/paymentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel'); // Assume this exists
const Job = require('./jobPostingModel'); // Assume this exists

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    freelancer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job,
            key: 'job_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'released', 'refunded', 'failed'),
        defaultValue: 'pending',
    },
    escrow_enabled: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

Payment.belongsTo(User, { as: 'Client', foreignKey: 'client_id' });
Payment.belongsTo(User, { as: 'Freelancer', foreignKey: 'freelancer_id' });
Payment.belongsTo(Job, { foreignKey: 'job_id' });

module.exports = Payment;
