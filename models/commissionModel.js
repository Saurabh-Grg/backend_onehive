const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Transaction = require('./transactionModel');
const User = require('./userModel');
const Job = require('./jobPostingModel');

const Commission = sequelize.define('Commission', {
    commission_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Transaction,
            key: 'transaction_id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job,
            key: 'job_id',
        },
    },
    commission_type: {
        type: DataTypes.ENUM('client_fee', 'freelancer_fee'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'commissions',
});

module.exports = Commission;
