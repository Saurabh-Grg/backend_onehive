const express = require('express');
const router = express.Router();
const freelancerProfileController = require('../controllers/freelancerProfileController');
const upload = require('../config/multer'); // Assuming multer is used for file uploads
const authenticateUser = require('../middleware/auth');
const FreelancerProfile = require('../models/freelancerProfileModel');

// const upload = multer({ dest: 'uploads/profile-images/' });

// Route for creating freelancer profile
router.post('/create', authenticateUser, upload.single('profileImage'), freelancerProfileController.createFreelancerProfile);

// Route for updating freelancer profile
router.put('/:id',authenticateUser, upload.single('profileImage'), freelancerProfileController.updateFreelancerProfile);

// Route for fetching freelancer profile
router.get('/', authenticateUser, freelancerProfileController.getFreelancerProfile);

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


