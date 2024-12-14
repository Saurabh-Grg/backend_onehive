// models/likedJobModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming `db.js` exports the Sequelize instance

const LikedJob = sequelize.define('LikedJob', {
    liked_job_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    freelancer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    liked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'liked_jobs',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['freelancer_id', 'job_id'],
        },
    ],
});

module.exports = LikedJob;
