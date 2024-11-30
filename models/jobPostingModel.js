//models/jobPostingModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Job = sequelize.define(
  "Job",
  {
    job_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        "Backend Development",
        "Frontend Development",
        "Full-Stack Development",
        "Mobile App Development",
        "API Development & Integration",
        "Database Design & Management",
        "UI/UX Design",
        "Graphic Design & Branding"
      ),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // This references the User model
        key: "user_id", // This is the column in the User model to which user_id is related
      },
      onDelete: "CASCADE", // Optional: Deletes the client profile if the associated user is deleted
      onUpdate: "CASCADE", // Optional: Updates the client profile if the associated user's ID changes
    },
    payment_status: {
      type: DataTypes.ENUM("unpaid", "paid", "escrowed"),
    },
  },
  {
    timestamps: true,
    tableName: "jobs",
  }
);

module.exports = Job;
