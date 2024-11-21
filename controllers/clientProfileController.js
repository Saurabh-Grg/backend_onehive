// controllers/clientProfileController.js
const clientProfileService = require('../services/clientProfileService');

const createClientProfile = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log incoming request body

    const user = req.user;

    console.log("User in request:", user); // Log the user object

    // Ensure user is authenticated
    if (!user || !user.user_id) {
      console.log(req.user)
      return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
    }

    // Initialize profileData with the incoming request body
    const profileData = req.body;

    // Set user_id to the authenticated user's ID
    profileData.user_id = req.user.user_id;

    // Check if a file is uploaded
    if (req.file) {
      const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
      profileData.profileImageUrl = `${serverUrl}/uploads/profile-images/${req.file.filename}`; // Store the complete URL
    }

    const newProfile = await clientProfileService.createClientProfile(profileData);
    res.status(201).json({
      message: 'Client profile created successfully',
      data: newProfile
    });
  } catch (error) {
    console.error("Error in profile creation:", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


//this was added
// controllers/clientProfileController.js
const updateClientProfile = async (req, res) => {
  try {
      const user = req.user;
      const profileId = req.params.id;

      if (!user || !user.user_id) {
          return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
      }

      // Initialize profile data with incoming request body
      const profileData = req.body;

      // Check if a new file is uploaded
      if (req.file) {
          const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
          profileData.profileImageUrl = `${serverUrl}/api/uploads/profile-images/${req.file.filename}`; // Store the complete URL
      }

      const profile = await clientProfileService.updateClientProfile(profileId, profileData);
      res.status(200).json({
          message: 'Client profile updated successfully',
          data: profile
      });
  } catch (error) {
      console.error("Error in profile update:", error.message);
      res.status(500).json({
          message: error.message
      });
  }
};


//profile fetch
const getClientProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.user_id) {
      return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
    }

    const profile = await clientProfileService.getClientProfile(user.user_id);
    res.status(200).json({
      message: 'Client profile fetched successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error fetching client profile:', error.message);
    res.status(500).json({
      message: error.message
    });
  }
};



module.exports = {
  createClientProfile,
  updateClientProfile,
  getClientProfile  // Export the update function
};
