// controllers/clientProfileController.js
const clientProfileService = require('../services/clientProfileService');

const createClientProfile = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log incoming request body
    console.log("Uploaded files:", req.files);  // Log uploaded files to verify if 'profileImage' exists

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

    // Check if the profileImage file is uploaded
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
      profileData.profileImageUrl = `${serverUrl}/uploads/profile-images/${req.files.profileImage[0].filename}`; // Store the complete URL
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

    // Ensure user is authenticated
    if (!user || !user.user_id) {
      return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
    }

    // Extract the profile data from the request body
    const profileData = req.body;

    // Check if a new file is uploaded and update the profile image URL
    if (req.file) {
      const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
      profileData.profileImageUrl = `${serverUrl}/uploads/profile-images/${req.file.filename}`;
    }

    // Update the client profile
    const updatedProfile = await clientProfileService.updateClientProfile(profileId, profileData);

    // Return a success response
    res.status(200).json({
      message: 'Client profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error in profile update:', error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getClientProfile = async (req, res) => {
  try {
    const user = req.user;

    // Debugging: Log the user object
    console.log("User in request:", user);

    // Ensure user is authenticated
    if (!user || !user.user_id) {
      return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
    }

    // Fetch the profile from the service
    const profile = await clientProfileService.getClientProfile(user.user_id);
    
    // Debugging: Log the raw profile data fetched from the database
    console.log("Fetched Profile Data:", profile);

    // Check if the profile is found
    if (!profile || !profile.profileImageUrl) {
      console.warn("No profile image URL found in fetched profile.");
    }

    // Log the final response before sending it
    console.log("Response being sent:", {
      message: 'Client profile fetched successfully',
      data: profile
    });

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
