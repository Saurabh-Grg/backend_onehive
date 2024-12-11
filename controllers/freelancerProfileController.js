// //controllers/freelancerProfileController.js
// const freelancerProfileService = require('../services/freelancerProfileService');

// // Create freelancer profile
// const createFreelancerProfile = async (req, res) => {
//   try {
//     console.log("Incoming request body:", req.body); // Log incoming request body

//     const user = req.user;

//     // Ensure user is authenticated
//     if (!user || !user.user_id) {
//       return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
//     }

//     // Initialize profileData with the incoming request body
//     const profileData = req.body;

//     // Set user_id to the authenticated user's ID
//     profileData.user_id = req.user.user_id;

//     // Check if a profile image is uploaded
//     if (req.files && req.files.profileImage) {
//       const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
//       profileData.profileImageUrl = `${serverUrl}/uploads/profile-images/${req.files.profileImage[0].filename}`; // Store the complete URL
//     }

//     // Check if portfolio images are uploaded
//     if (req.files && req.files.portfolioImages) {
//       const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
//       profileData.portfolioImages = req.files.portfolioImages.map(file => `${serverUrl}/uploads/portfolio-images/${file.filename}`);
//     }

//     // Check if certificates are uploaded
//     if (req.files && req.files.certificates) {
//       const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
//       profileData.certificates = req.files.certificates.map(file => `${serverUrl}/uploads/certificates/${file.filename}`);
//     }

//     const newProfile = await freelancerProfileService.createFreelancerProfile(profileData);
//     res.status(201).json({
//       message: 'Freelancer profile created successfully',
//       data: newProfile
//     });
//   } catch (error) {
//     console.error("Error in profile creation:", error.message);
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };

// // Update freelancer profile
// const updateFreelancerProfile = async (req, res) => {
//   try {
//     const user = req.user;
//     const profileId = req.params.id;

//     // Ensure user is authenticated
//     if (!user || !user.user_id) {
//       return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
//     }

//     // Extract the profile data from the request body
//     const profileData = req.body;

//     // Check if a new file is uploaded and update the profile image URL
//     if (req.file) {
//       const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
//       profileData.profileImageUrl = `${serverUrl}/uploads/profile-images/${req.file.filename}`;
//     }

//     // Update the freelancer profile
//     const updatedProfile = await freelancerProfileService.updateFreelancerProfile(profileId, profileData);

//     // Return a success response
//     res.status(200).json({
//       message: 'Freelancer profile updated successfully',
//       data: updatedProfile,
//     });
//   } catch (error) {
//     console.error('Error in profile update:', error.message);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // Fetch freelancer profile
// const getFreelancerProfile = async (req, res) => {
//   try {
//     console.log('Incoming request to fetch freelancer profile:', req.user);

//     const user = req.user;

//     if (!user || !user.user_id) {
//       return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
//     }

//     const profile = await freelancerProfileService.getFreelancerProfile(user.user_id);

//     console.log('Profile fetched:', profile);

//     res.status(200).json({
//       message: 'Freelancer profile fetched successfully',
//       data: profile
//     });
//   } catch (error) {
//     console.error('Error fetching freelancer profile:', error.message);
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };


// module.exports = {
//   createFreelancerProfile,
//   updateFreelancerProfile,
//   getFreelancerProfile,
// };

// controllers/freelancerProfileController.js
const freelancerProfileService = require('../services/freelancerProfileService');

// Create freelancer profile
const createFreelancerProfile = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log incoming request body

    const user = req.user;

    // Ensure user is authenticated
    if (!user || !user.user_id) {
      return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
    }

    // Initialize profileData with the incoming request body
    const profileData = req.body;

    // Set user_id to the authenticated user's ID
    profileData.user_id = req.user.user_id;

    // Check if a profile image is uploaded
    if (req.files && req.files.profileImage) {
      const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
      profileData.profileImageUrl = `${serverUrl}/uploads/profile-images/${req.files.profileImage[0].filename}`; // Store the complete URL
    }

    // Check if portfolio images are uploaded
    if (req.files && req.files.portfolioImages) {
      const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
      profileData.portfolioImages = req.files.portfolioImages.map(file => `${serverUrl}/uploads/portfolio-images/${file.filename}`);
    }

    // Check if certificates are uploaded
    if (req.files && req.files.certificates) {
      const serverUrl = 'http://localhost:3000'; // Replace with your server's base URL
      profileData.certificates = req.files.certificates.map(file => `${serverUrl}/uploads/certificates/${file.filename}`);
    }

    const newProfile = await freelancerProfileService.createFreelancerProfile(profileData);
    res.status(201).json({
      message: 'Freelancer profile created successfully',
      data: newProfile
    });
  } catch (error) {
    console.error("Error in profile creation:", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

// Update freelancer profile
const updateFreelancerProfile = async (req, res) => {
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

    // Update the freelancer profile
    const updatedProfile = await freelancerProfileService.updateFreelancerProfile(profileId, profileData);

    // Return a success response
    res.status(200).json({
      message: 'Freelancer profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error in profile update:', error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Fetch freelancer profile
const getFreelancerProfile = async (req, res) => {
  try {
    console.log('Incoming request to fetch freelancer profile:', req.user);

    const user = req.user;

    if (!user || !user.user_id) {
      return res.status(401).json({ message: 'Unauthorized: No user logged in.' });
    }

    const profile = await freelancerProfileService.getFreelancerProfile(user.user_id);

    console.log('Profile fetched:', profile);

    res.status(200).json({
      message: 'Freelancer profile fetched successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error fetching freelancer profile:', error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createFreelancerProfile,
  updateFreelancerProfile,
  getFreelancerProfile,
};
