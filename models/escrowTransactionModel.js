//models/escrowTransactionModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the configured Sequelize instance
const User = require('./userModel'); // Import the User model
const Job = require('./jobPostingModel'); // Import the Job model

const EscrowTransaction = sequelize.define('EscrowTransaction', {
    escrow_transaction_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    freelancer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Job,
            key: 'job_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'released', 'refunded'),
        allowNull: true,
        defaultValue: 'pending',
    },
    created_at: {
        type: DataTypes.TIMESTAMP,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: DataTypes.TIMESTAMP,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
    escrow_enabled: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
    },
    security_charge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
    },
}, {
    timestamps: false, // Disable Sequelize auto-timestamps since we use custom fields
    tableName: 'escrow_transactions',
});

// Associations
EscrowTransaction.belongsTo(User, { as: 'Client', foreignKey: 'client_id' });
EscrowTransaction.belongsTo(User, { as: 'Freelancer', foreignKey: 'freelancer_id' });
EscrowTransaction.belongsTo(Job, { foreignKey: 'job_id' });

module.exports = EscrowTransaction;
