//models/acceptedJobModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Job = require('./jobPostingModel');
const User = require('./userModel');

const AcceptedJob = sequelize.define('AcceptedJob', {
  accepted_job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'jobs', key: 'job_id' },
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' },
  },
  freelancer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' },
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  use_escrow: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  escrow_charge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM("ongoing", "completed", "disputed"),
    defaultValue: "ongoing",
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'accepted_jobs',
  timestamps: true,
});

// Define associations
AcceptedJob.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
AcceptedJob.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
AcceptedJob.belongsTo(User, { foreignKey: 'freelancer_id', as: 'freelancer' });

module.exports = AcceptedJob;
