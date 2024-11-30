const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const EscrowTransaction = require('./escrowTransactionModel');

const RefundRequest = sequelize.define('RefundRequest', {
    refund_request_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    escrow_transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EscrowTransaction,
            key: 'escrow_transaction_id',
        },
    },
    requested_by: {
        type: DataTypes.ENUM('client', 'freelancer'),
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
}, {
    timestamps: true,
    tableName: 'refund_requests',
});

module.exports = RefundRequest;
