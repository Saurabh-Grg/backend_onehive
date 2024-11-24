// routes/clientProfile.js
const express = require('express');
const router = express.Router();
const clientProfileController = require('../controllers/clientProfileController');
const authenticateUser = require('../middleware/auth'); // Import the auth middleware
const ClientProfile = require('../models/clientProfileModel');
const upload = require('../config/multer');

// POST request to create client profile with image upload
router.post('/client-profile', authenticateUser, upload.single('profileImage'), clientProfileController.createClientProfile);


//this was added
// routes/clientProfile.js
// router.put('/client-profile/:id', authenticateUser, upload.single('profileImage'), clientProfileController.updateClientProfile);
// PUT request to update client profile with image upload
router.put('/client-profile/update/:id', authenticateUser, upload.single('profileImage'), clientProfileController.updateClientProfile);


// GET request to fetch client profile
router.get('/client-profile', authenticateUser, clientProfileController.getClientProfile);

router.get('/check-profile/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const profile = await ClientProfile.findOne({ where: { user_id: user_id } });
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

// PUT request to update client profile with image upload
router.put('/client-profile/update/:id', authenticateUser, upload.single('profileImage'), clientProfileController.updateClientProfile);


module.exports = router;


// const express = require('express');
// const router = express.Router();
// const clientProfileController = require('../controllers/clientProfileController');
// const authenticateUser = require('../middleware/auth'); // Import the auth middleware
// const ClientProfile = require('../models/clientProfileModel');
// const multiUpload = require('../config/multer'); // Updated multer configuration

// // POST request to create client profile with image upload
// router.post(
//   '/client-profile',
//   authenticateUser,
//   multiUpload, // Use the updated multer configuration
//   clientProfileController.createClientProfile
// );

// // PUT request to update client profile with image upload
// router.put(
//   '/client-profile/:id',
//   authenticateUser,
//   multiUpload, // Use the updated multer configuration
//   clientProfileController.updateClientProfile
// );

// // GET request to fetch client profile
// router.get('/client-profile', authenticateUser, clientProfileController.getClientProfile);

// // GET request to check if a profile exists for a user
// router.get('/check-profile/:user_id', async (req, res) => {
//   const user_id = req.params.user_id;
//   try {
//     const profile = await ClientProfile.findOne({ where: { user_id: user_id } });
//     if (profile) {
//       return res.status(200).json({ profileExists: true });
//     } else {
//       return res.status(200).json({ profileExists: false });
//     }
//   } catch (error) {
//     console.error('Error checking profile existence:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
