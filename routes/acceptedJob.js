const express = require('express');
const router = express.Router();
const acceptedJobController = require('../controllers/acceptedJobController');
const authenticateUser = require('../middleware/auth');

// Route to fetch all accepted jobs (requires authentication)
router.get('/fetch', authenticateUser, acceptedJobController.getAcceptedJobs);

module.exports = router;
