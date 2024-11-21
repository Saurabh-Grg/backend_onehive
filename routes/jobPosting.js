const express = require('express');
const router = express.Router();
const { storeTempJobDetails, submitBackendJob, submitFrontendJob, submitFullStackJob , getTotalJobPostings, getJobs, getJobDetails, getAllJobs } = require('../controllers/jobPostingController');

// Step 1: Temporarily store common job details
router.post('/store-temp-job', storeTempJobDetails);

// Step 2: Submit Backend job details
router.post('/submit-backend-job', submitBackendJob);

// Step 3: Submit frontend job details
router.post('/submit-frontend-job', submitFrontendJob);

// Step 3: Submit frontend job details
router.post('/submit-fullStack-job', submitFullStackJob);

// Add more routes for other categories if needed (Frontend, Full-Stack, etc.)

// Route to get the total number of job postings for a client
router.get('/totalJobPostings/:user_id', getTotalJobPostings);

router.get('/get-temp-job-details', (req, res) => {
    res.status(200).json(req.session.tempJobDetails || { message: 'No temp job data found' });
});

// Route to get job data (title, description, category)
router.get('/jobs/:user_id', getJobs);

// Route to get job data (title, description, category)
router.get('/jobs', getAllJobs);

// Fetch common job and category-specific details by job_id
router.get('/jobDetails/:job_id', getJobDetails);

module.exports = router;
