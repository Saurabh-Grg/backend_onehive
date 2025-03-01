const express = require('express');
const router = express.Router();
const acceptedJobController = require('../controllers/acceptedJobController');
const authenticateUser = require('../middleware/auth');

// Route to fetch all accepted jobs (requires authentication)
router.get('/client/fetch', authenticateUser, acceptedJobController.getAcceptedJobs);

// Route for freelancers to fetch jobs they were accepted for
router.get('/freelancer/fetch', authenticateUser, acceptedJobController.getAcceptedJobsForFreelancer);


module.exports = router;
