//routes/likeJobRoutes.js
const express = require('express');
const router = express.Router();
const { likeJob, getLikedJobs } = require('../controllers/likeJobController');
const authenticateUser = require('../middleware/auth');

// Route to like a job
router.post('/like-job', authenticateUser,likeJob);

// Route to get liked jobs for a freelancer
router.get('/liked-jobs/:freelancerId', authenticateUser, getLikedJobs);

module.exports = router;
