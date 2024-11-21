const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming db.js is your database connection file
const Job = require('./jobPostingModel'); // Assuming this is the model for the 'jobs' table

const FrontendDevJob = sequelize.define('FrontendDevJob', {
    frontend_job_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job, // 'jobs' table reference
            key: 'job_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', 
    },
    selected_framework: {
        type: DataTypes.STRING,
        allowNull: false
    },
    design_tool: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complexity: {
        type: DataTypes.ENUM('Simple', 'Moderate', 'Complex'),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    payment_type: {
        type: DataTypes.ENUM('Fixed Price', 'Hourly'),
        allowNull: false
    },
    budget_range: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience_level: {
        type: DataTypes.ENUM('Entry-Level', 'Intermediate', 'Expert'),
        allowNull: false
    },
    communication_channel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    communication_frequency: {
        type: DataTypes.ENUM('Daily Updates', 'Weekly Updates', 'Milestone-Based Updates', 'On Completion'),
        allowNull: false
    },
    additional_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    attached_files: {
        type: DataTypes.TEXT, // Store as a comma-separated string or JSON array
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'frontend_jobs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

FrontendDevJob.associate = (models) => {
    FrontendDevJob.belongsTo(models.Job, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE'
    });
};

module.exports = FrontendDevJob;