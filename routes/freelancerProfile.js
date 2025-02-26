const express = require('express');
const router = express.Router();

const { Sequelize } = require('sequelize'); // Import Sequelize from the config
const sequelize = require('../config/db'); // Import the sequelize instance from the db.js file

const freelancerProfileController = require('../controllers/freelancerProfileController');
const { upload } = require('../config/multer'); // Assuming multer is used for file uploads
const authenticateUser = require('../middleware/auth');
const FreelancerProfile = require('../models/freelancerProfileModel'); // Adjust path as needed
const JobPosting = require('../models/jobPostingModel'); // Import JobPosting model
const Proposal = require('../models/proposalModel'); // Import Proposal model
const User = require('../models/userModel');

// Route for creating freelancer profile
router.post('/create', authenticateUser, upload, freelancerProfileController.createFreelancerProfile);

// Route for updating freelancer profile
// router.put('/:id', upload.single('profileImage'), freelancerProfileController.updateFreelancerProfile);
router.put('/:id',authenticateUser, upload, freelancerProfileController.updateFreelancerProfile);

// Route for freelancers to fetch their own profile
router.get('/my-profile', authenticateUser, freelancerProfileController.getFreelancerOwnProfile);

// Route for fetching freelancer profile with proposal check
router.get('/freelancer-profile/:freelancer_id/:job_id', authenticateUser, async (req, res) => {
    const clientId = req.user.user_id; // Get the logged-in client ID from the token
    console.log("Client ID from token:", clientId); // Debugging log
    const freelancerId = req.params.freelancer_id; // Get freelancer ID from the request
    const jobId = req.params.job_id; // Get the job ID from the request

    try {
        // Check if the client has posted the job
        const job = await JobPosting.findOne({
            where: {
                job_id: jobId,
                user_id: clientId, // Correct column name 'user_id' instead of 'client_id'
            },
        });

        if (!job) {
            return res.status(403).json({
                message: 'You are not authorized to view this freelancer profile for this job.',
            });
        }

        // Check if the freelancer has submitted a proposal for this job
        const proposal = await Proposal.findOne({
            where: {
                job_id: jobId,
                freelancer_id: freelancerId,
            },
        });

        if (!proposal) {
            return res.status(403).json({
                message: 'Freelancer has not applied for this job.',
            });
        }

        // Fetch the freelancer profile along with the city and createdAt from the User model
        const freelancerProfile = await FreelancerProfile.findOne({
            where: { user_id: freelancerId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: [
                        'city',
                        'createdAt', // Format createdAt as 'YYYY-MM-DD'
                    ],
                },
            ],
        });

        if (freelancerProfile) {
            return res.status(200).json({ profile: freelancerProfile });
        } else {
            return res.status(404).json({ message: 'Freelancer profile not found' });
        }
    } catch (error) {
        console.error('Error fetching freelancer profile:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.get('/check-profile/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const profile = await FreelancerProfile.findOne({ where: { user_id: user_id } });
        if (profile) {
            return res.status(200).json({ profileExists: true });
        } else {
            return res.status(200).json({ profileExists: false });
        }
    } catch (error) {
        console.error("Error checking profile existence:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;


