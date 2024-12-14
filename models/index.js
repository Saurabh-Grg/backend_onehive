// models/index.js
const sequelize = require('../config/db');
const Job = require('./jobPostingModel'); 
const User = require('./userModel'); 
const ClientProfile = require('./clientProfileModel'); 
const LikedJob = require('./likedJobModel');

// Define associations
User.hasMany(Job, {
    foreignKey: 'user_id',
    as: 'jobs', // You can use this alias when including in queries
});

Job.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user', // This is the alias you used in your query
});

User.hasOne(ClientProfile, {
    foreignKey: 'user_id',
    as: 'clientProfile', // This is the alias you used in your query
});

ClientProfile.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

// Associations
LikedJob.belongsTo(Job, { foreignKey: 'job_id', as: 'jobDetails' });
Job.hasMany(LikedJob, { foreignKey: 'job_id' });

module.exports = { Job, User, ClientProfile, LikedJob,sequelize };