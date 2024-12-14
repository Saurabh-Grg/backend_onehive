//services/likeJobService.js
const LikedJob = require('../models/likedJobModel');
const Job = require('../models/jobPostingModel');
// const { LikedJob, Job } = require('../models'); // Assuming Job and LikedJob models are defined

const addLike = async (freelancerId, jobId) => {
    try {
        console.log('Toggling like for Freelancer ID:', freelancerId, 'Job ID:', jobId); // Debugging the input parameters

        // Check if the job is already liked by the freelancer
        const existingLike = await LikedJob.findOne({
            where: { freelancer_id: freelancerId, job_id: jobId },
        });

        if (existingLike) {
            console.log('Job is already liked, removing from liked list'); // Debugging before removing
            // If already liked, remove it from the database (unlike)
            await LikedJob.destroy({
                where: { freelancer_id: freelancerId, job_id: jobId },
            });
            return 'removed'; // Job is removed from liked list
        } else {
            console.log('Job is not liked yet, adding to liked list'); // Debugging before adding
            // Add the job to the liked list
            await LikedJob.create({ freelancer_id: freelancerId, job_id: jobId });
            return 'added'; // Job is added to liked list
        }
    } catch (error) {
        console.error('Error in toggleLike service:', error); // Detailed error logging
        throw error; // Rethrow the error for the controller to catch
    }
};

const getLikedJobs = async (freelancerId) => {
    try {
        const likedJobs = await LikedJob.findAll({
            where: { freelancer_id: freelancerId },
            include: [{ model: Job, as: 'jobDetails' }], // Include job details
        });

        return likedJobs;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addLike,
    getLikedJobs,
};
