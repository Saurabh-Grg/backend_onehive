// models/ProposalModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importing the Sequelize instance
const Job = require('./jobPostingModel'); // Import Job model


const Proposal = sequelize.define('Proposal', {
  proposal_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'job_id',
    },
  },
  freelancer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
  // cover_letter: {
  //   type: DataTypes.STRING, // Store the file path or URL for the cover letter PDF
  //   allowNull: true,
  // },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'proposals',
  timestamps: true,
});

// Define association with Job
Proposal.belongsTo(Job, {
  foreignKey: 'job_id',
  as: 'job', // Alias for the association
});


module.exports = Proposal;
