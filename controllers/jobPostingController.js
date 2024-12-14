//controllers/jobPostingController.js
const jobPostingService = require('../services/jobPostingService');
const jwt = require('jsonwebtoken');
// const Job = require('../models/userModel');
// const User = require('../models/jobPostingModel');
// const ClientProfile = require('../models/clientProfileModel'); // Ensure this path is correct
const { Job, User, ClientProfile } = require('../models'); // Ensure you import correctly


const storeTempJobDetails = (req, res) => {
    try {
        const { title, description, category, user_id } = req.body;

        // Temporary job details stored in a token payload
        const tempJobDetails = { title, description, category, user_id };

        // Create a JWT token with the job details
        const token = jwt.sign(tempJobDetails, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('storetempjobdetails Generated JWT:', token); // Log the generated token

        // Send the token back to the client
        res.status(200).json({ success: true, token, message: 'Common job details stored in token' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to store job details', error });
    }
};


const submitBackendJob = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

        // Verify the token and extract the job details
        const tempJobDetails = jwt.verify(token, process.env.JWT_SECRET);

        // Log the extracted job details
        console.log('Extracted Job Details:', tempJobDetails);

        // Proceed with job submission
        const { backendDetails } = req.body;

         // Log the backendDetails for debugging
         console.log('Backend Details:', backendDetails);

        // Save common job details first
        const newJob = await jobPostingService.createCommonJob(tempJobDetails);

        // Save backend-specific job details
        await jobPostingService.createBackendJob(newJob.job_id, backendDetails);

         // Fetch the updated job posting count for the user
         const totalJobPostings = await Job.count({
            where: { user_id: tempJobDetails.user_id }
        }); 

        // Send response including the updated count
        res.status(201).json({ 
            success: true, 
            message: 'Job successfully posted', 
            totalJobPostings 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Job posting failed', error });
    }
};

const submitFrontendJob = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

        // Verify the token and extract the job details
        const tempJobDetails = jwt.verify(token, process.env.JWT_SECRET);

        // Log the extracted job details
        console.log('Extracted Job Details:', tempJobDetails);

        // Proceed with job submission
        const { frontendDetails } = req.body;

         // Log the backendDetails for debugging
         console.log('Frontend Details:', frontendDetails);

        // Save common job details first
        const newJob = await jobPostingService.createCommonJob(tempJobDetails);

        // Save frontend-specific job details
        await jobPostingService.createFrontendJob(newJob.job_id, frontendDetails);

        // Fetch updated count
        const totalJobPostings = await Job.count({
            where: { user_id: tempJobDetails.user_id }
        });

        res.status(201).json({ 
            success: true, 
            message: 'Job successfully posted', 
            totalJobPostings 
        });
    } catch (error) {
        console.error('Job posting failed with error:', error);
        res.status(500).json({ success: false, message: 'Job posting failed', error: error.message || error });
    }
};

const submitFullStackJob = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

        // Verify the token and extract the job details
        const tempJobDetails = jwt.verify(token, process.env.JWT_SECRET);

        // Log the extracted job details
        console.log('Extracted Job Details:', tempJobDetails);

        // Proceed with job submission
        const { fullStackDetails } = req.body;

         // Log the backendDetails for debugging
         console.log('Full stack Details:', fullStackDetails);

        // Save common job details first
        const newJob = await jobPostingService.createCommonJob(tempJobDetails);

        // Save fullstack-specific job details
        await jobPostingService.createFullStackJob(newJob.job_id, fullStackDetails);

        // Fetch updated count
        const totalJobPostings = await Job.count({
            where: { user_id: tempJobDetails.user_id }
        });

        res.status(201).json({ 
            success: true, 
            message: 'Job successfully posted', 
            totalJobPostings 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Job posting failed', error });
    }
};

// Add more category-specific methods if needed (Frontend, Full-Stack, etc.)

const getTotalJobPostings = async (req, res) => {
    try {
      const user_id = req.params.user_id;
      // Count the number of job postings for the given client ID
      const totalJobPostings = await Job.count({
        where: { user_id: user_id }
      });
  
      res.status(200).json({ success: true, totalJobPostings });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch job postings', error });
    }
};

const getJobs = async (req, res) => {
    try {
        // Get the client (user) ID from request parameters
        const user_id = req.params.user_id;

        // Fetch jobs where user_id matches the client's ID
        const jobs = await Job.findAll({
            where: { user_id: user_id }
        });

        // If no jobs found, return a message
        if (!jobs.length) {
            return res.status(404).json({ success: false, message: 'No job postings found for this client' });
        }

        // Send the job postings as a response
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ success: false, message: 'Error fetching jobs', error });
    }
};

// Controller to fetch job details by job_id
const getJobDetails = async (req, res) => {
    try {
        const { job_id } = req.params;

        // Fetch the job details (including category-specific details)
        const jobDetails = await jobPostingService.getJobDetailsById(job_id);

        if (!jobDetails) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Send the combined job details as a response
        res.status(200).json({ success: true, jobDetails });
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch job details', error: error.message });
    }
};

// const getAllJobs = async (req, res) => {
//     try {
//         // Fetch all jobs without filtering by user_id
//         const jobs = await Job.findAll();

//         // If no jobs are found, return a message
//         if (!jobs.length) {
//             return res.status(404).json({ success: false, message: 'No job postings found' });
//         }

//         // Send the job postings as a response
//         res.status(200).json({ success: true, jobs });
//     } catch (error) {
//         console.error('Error fetching all jobs:', error);
//         res.status(500).json({ success: false, message: 'Error fetching jobs', error });
//     }
// };

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            include: [
                {
                    model: User,
                    as: 'user', // Match the alias used in Job model
                    include: [
                        {
                            model: ClientProfile,
                            as: 'clientProfile', // Match the alias used in User model
                            attributes: ['id', 'contactPerson', 'profileImageUrl'], // Specify fields you want to retrieve
                        }
                    ],
                }
            ],
        });

        if (!jobs.length) {
            return res.status(404).json({ success: false, message: 'No job postings found' });
        }

        // Format jobs to include client info
        const formattedJobs = jobs.map(job => ({
            job_id: job.job_id,
            title: job.title,
            description: job.description,
            category: job.category,
            client_id: job.user?.clientProfile?.id || null, // Get client profile id
            client_name: job.user?.clientProfile?.contactPerson || 'Unknown', // Get client name
            client_profile_picture: job.user?.clientProfile?.profileImageUrl || '', // Get client profile picture
        }));

        res.status(200).json({ success: true, jobs: formattedJobs });
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        res.status(500).json({ success: false, message: 'Error fetching jobs', error });
    }
};

const deleteJob = async (req, res) => {
    const { job_id } = req.params;
  
    try {
      const job = await Job.findByPk(job_id);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      if (job.user_id !== req.user.user_id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await job.destroy();
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  


module.exports = {
    storeTempJobDetails,
    submitBackendJob,
    submitFrontendJob,
    submitFullStackJob,
    getTotalJobPostings,
    getJobs,
    getJobDetails,
    getAllJobs,  // New function to fetch all jobs
    deleteJob
};


