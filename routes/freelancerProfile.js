const express = require('express');
const router = express.Router();
const freelancerProfileController = require('../controllers/freelancerProfileController');
const upload = require('../config/multer'); // Assuming multer is used for file uploads
const authenticateUser = require('../middleware/auth');

// const upload = multer({ dest: 'uploads/profile-images/' });

// Route for creating freelancer profile
router.post('/create', authenticateUser, upload.single('profileImage'), freelancerProfileController.createFreelancerProfile);

// Route for updating freelancer profile
router.put('/:id', upload.single('profileImage'), freelancerProfileController.updateFreelancerProfile);

// Route for fetching freelancer profile
router.get('/', freelancerProfileController.getFreelancerProfile);

module.exports = router;
