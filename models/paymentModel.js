// //models/paymentModel.js

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");
// const Job = require("./jobPostingModel"); // Reference to Job model
// const { v4: uuidv4 } = require("uuid"); // Use UUID for unique values

// const Payment = sequelize.define("Payment", {
//     transactionId: { 
//       type: DataTypes.STRING, 
//       unique: true, 
//       primaryKey: true, // Explicitly mark as primary key
//       defaultValue: uuidv4, // Automatically assign a unique ID
//     },
//     pidx: { 
//         type: DataTypes.STRING, 
//         unique: true, 
//         allowNull: true, // Allow NULL values to avoid the error
//       },
//     job_id: { 
//       type: DataTypes.INTEGER, 
//       allowNull: false, 
//       references: {
//         model: Job,
//         key: "job_id",
//       },
//       onDelete: "CASCADE",
//       onUpdate: "CASCADE",
//     },
//     amount: { type: DataTypes.FLOAT, allowNull: false },
//     status: {
//       type: DataTypes.ENUM("success", "pending", "failed"),
//       defaultValue: "pending",
//     },
//     paymentGateway: {
//       type: DataTypes.ENUM("esewa", "khalti", "connectIps"),
//       allowNull: false,
//     },
//     paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   });

// module.exports = Payment;
