const FreelancerProfile = require('../models/freelancerProfileModel');

// Create a new freelancer profile
const createFreelancerProfile = async (profileData) => {
  try {
    const newProfile = await FreelancerProfile.create(profileData);
    return newProfile;
  } catch (error) {
    throw new Error('Error creating freelancer profile: ' + error.message);
  }
};

// Fetch the freelancer profile by user ID
const getFreelancerProfile = async (userId) => {
  try {
    const profile = await FreelancerProfile.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new Error('Freelancer profile not found');
    }
    return profile;
  } catch (error) {
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
