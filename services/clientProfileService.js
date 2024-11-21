// services/clientProfileService.js
const ClientProfile = require('../models/clientProfileModel');

const createClientProfile = async (profileData) => {
  try {
    const newProfile = await ClientProfile.create(profileData);
    return newProfile;
  } catch (error) {
    throw new Error('Error creating client profile: ' + error.message);
  }
};

//for fetching the client profile
const getClientProfile = async (userId) => {
  try {
    const profile = await ClientProfile.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new Error('Client profile not found');
    }
    return profile;
  } catch (error) {
    throw new Error('Error fetching client profile: ' + error.message);
  }
};



//this was added
// services/clientProfileService.js

const updateClientProfile = async (profileId, profileData) => {
    try {
        const profile = await ClientProfile.findByPk(profileId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        await profile.update(profileData);
        return profile;
    } catch (error) {
        throw new Error('Error updating client profile: ' + error.message);
    }
};

module.exports = {
    createClientProfile,
    updateClientProfile, // Export the update method
    getClientProfile // Export the new method
};
