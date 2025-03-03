// models/milestoneModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AcceptedJob = require("./acceptedJobModel");

const Milestone = sequelize.define("Milestone", {
  milestone_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  accepted_job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "accepted_jobs",
      key: "accepted_job_id",
    },
    onDelete: "CASCADE",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
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
  tableName: "milestones",
  timestamps: true,
});

// Associations
AcceptedJob.hasMany(Milestone, { foreignKey: "accepted_job_id", onDelete: "CASCADE" });
Milestone.belongsTo(AcceptedJob, { foreignKey: "accepted_job_id" });

module.exports = Milestone;
