const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Job = require('./jobPostingModel');

const BackendJob = sequelize.define('BackendJob', {
    backend_job_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, // Make this the primary key
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
    selected_backend_framework: {
        type: DataTypes.STRING,
    },
    database_type: {
        type: DataTypes.STRING,
    },
    complexity: {
        type: DataTypes.ENUM('Simple', 'Moderate', 'Complex'),
    },
    start_date: {
        type: DataTypes.DATE,
    },
    end_date: {
        type: DataTypes.DATE,
    },
    payment_type: {
        type: DataTypes.ENUM('Fixed Price', 'Hourly'),
    },
    budget_range: {
        type: DataTypes.STRING,
    },
    experience_level: {
        type: DataTypes.ENUM('Entry-Level', 'Intermediate', 'Expert'),
    },
    attached_files: {
        type: DataTypes.TEXT,
    },
    communication_channel: {
        type: DataTypes.STRING,
    },
    communication_frequency: {
        type: DataTypes.STRING,
    },
    additional_notes: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
    tableName: 'backend_jobs'
});

module.exports = BackendJob;
