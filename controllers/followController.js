// controllers/followController.js
const User = require('../models/userModel');
const Follow = require('../models/followModel');

// Follow a freelancer
const followFreelancer = async (followerId, followedId) => {
  try {
    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId }
    });
    if (existingFollow) {
      return { message: 'You are already following this freelancer.' };
    }

    // Create a new follow relationship
    const follow = await Follow.create({ followerId, followedId });
    return { message: 'You are now following this freelancer.', follow };
  } catch (error) {
    console.error('Error following freelancer:', error);
    throw error;
  }
};

// Unfollow a freelancer
const unfollowFreelancer = async (followerId, followedId) => {
  try {
    // Check if the follow relationship exists
    const follow = await Follow.findOne({
      where: { followerId, followedId }
    });
    if (!follow) {
      return { message: 'You are not following this freelancer.' };
    }

    // Destroy the follow relationship
    await follow.destroy();
    return { message: 'You have unfollowed this freelancer.' };
  } catch (error) {
    console.error('Error unfollowing freelancer:', error);
    throw error;
  }
};

// Get follow status (is user following the freelancer?)
const getFollowStatus = async (followerId, followedId) => {
    try {
      // Check if the follow relationship exists
      const follow = await Follow.findOne({
        where: { followerId, followedId }
      });
      return { isFollowing: follow ? true : false }; // Return true if following, false if not
    } catch (error) {
      console.error('Error checking follow status:', error);
      throw error;
    }
  };
  

module.exports = { followFreelancer, unfollowFreelancer , getFollowStatus };
