
// //services/freelancerProfileService.js
// const FreelancerProfile = require('../models/freelancerProfileModel');

// // Create a new freelancer profile
// const createFreelancerProfile = async (profileData) => {
//   try {
//     // Make sure portfolioImages and certificates are arrays, not strings
//     if (typeof profileData.portfolioImages === 'string') {
//       profileData.portfolioImages = JSON.parse(profileData.portfolioImages);
//     }
//     if (typeof profileData.certificates === 'string') {
//       profileData.certificates = JSON.parse(profileData.certificates);
//     }

//     const newProfile = await FreelancerProfile.create(profileData);
//     return newProfile;
//   } catch (error) {
//     throw new Error('Error creating freelancer profile: ' + error.message);
//   }
// };

// const getFreelancerProfile = async (userId) => {
//   try {
//     const profile = await FreelancerProfile.findOne({
//       where: { user_id: userId },
//       attributes: [
//         'id',
//         'user_id',
//         'name',
//         'bio',
//         'skills',
//         'experience',
//         'education',
//         'profileImageUrl',
//         'portfolioImages',
//         'certificates',
//         'createdAt',
//         'updatedAt'
//       ]
//     });

//     // TODO: handle the parsing error , still in the String "portfolioImages and certificates"

//     if (!profile) {
//       throw new Error('Freelancer profile not found');
//     }

//     const parsedProfile = profile.get({ plain: true });

//     // If portfolioImages and certificates are stored as strings, parse them into arrays
//     if (typeof parsedProfile.portfolioImages === 'string') {
//       parsedProfile.portfolioImages = JSON.parse(parsedProfile.portfolioImages);
//     }

//     if (typeof parsedProfile.certificates === 'string') {
//       parsedProfile.certificates = JSON.parse(parsedProfile.certificates);
//     }

//     return parsedProfile;
//   } catch (error) {
//     console.error('Error fetching freelancer profile:', error);
//     throw new Error('Error fetching freelancer profile: ' + error.message);
//   }
// };




// // Update the freelancer profile
// const updateFreelancerProfile = async (profileId, profileData) => {
//   try {
//     // Find the profile by ID
//     const profile = await FreelancerProfile.findByPk(profileId);
//     if (!profile) {
//       throw new Error('Profile not found');
//     }

//     // Update the profile with the new data
//     await profile.update(profileData);
//     return profile;
//   } catch (error) {
//     throw new Error('Error updating freelancer profile: ' + error.message);
//   }
// };

// module.exports = {
//   createFreelancerProfile,
//   updateFreelancerProfile,
//   getFreelancerProfile,
// };

const FreelancerProfile = require('../models/freelancerProfileModel');

// Create a new freelancer profile
const createFreelancerProfile = async (profileData) => {
  try {
    // Ensure portfolioImages and certificates are arrays, not strings
    if (typeof profileData.portfolioImages === 'string') {
      profileData.portfolioImages = JSON.parse(profileData.portfolioImages);
    }
    if (typeof profileData.certificates === 'string') {
      profileData.certificates = JSON.parse(profileData.certificates);
    }

    const newProfile = await FreelancerProfile.create(profileData);
    return newProfile;
  } catch (error) {
    throw new Error('Error creating freelancer profile: ' + error.message);
  }
};

const getFreelancerProfile = async (userId) => {
  try {
    const profile = await FreelancerProfile.findOne({
      where: { user_id: userId },
      attributes: [
        'id',
        'user_id',
        'name',
        'bio',
        'skills',
        'experience',
        'education',
        'profileImageUrl',
        'portfolioImages',
        'certificates',
        'createdAt',
        'updatedAt'
      ]
    });

    if (!profile) {
      throw new Error('Freelancer profile not found');
    }

    const parsedProfile = profile.get({ plain: true });

    // Parse portfolioImages and certificates if they're stored as strings
    if (typeof parsedProfile.portfolioImages === 'string') {
      parsedProfile.portfolioImages = JSON.parse(parsedProfile.portfolioImages);
    }

    if (typeof parsedProfile.certificates === 'string') {
      parsedProfile.certificates = JSON.parse(parsedProfile.certificates);
    }

    return parsedProfile;
  } catch (error) {
    console.error('Error fetching freelancer profile:', error);
    throw new Error('Error fetching freelancer profile: ' + error.message);
  }
};

// Update the freelancer profile
const updateFreelancerProfile = async (profileId, profileData) => {
  try {
    // Find the profile by ID
    const profile = await FreelancerProfile.findByPk(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Make sure portfolioImages and certificates are arrays before saving
    if (profileData.portfolioImages && typeof profileData.portfolioImages === 'string') {
      profileData.portfolioImages = JSON.parse(profileData.portfolioImages);
    }

    if (profileData.certificates && typeof profileData.certificates === 'string') {
      profileData.certificates = JSON.parse(profileData.certificates);
    }

    // Update the profile with the new data
    await profile.update(profileData);
    return profile;
  } catch (error) {
    throw new Error('Error updating freelancer profile: ' + error.message);
  }
};

module.exports = {
  createFreelancerProfile,
  updateFreelancerProfile,
  getFreelancerProfile,
};
