// controllers/followController.js
const User = require('../models/userModel');
const Follow = require('../models/followModel');
const { createNotification } = require('../utils/notificationHelper');
const FreelancerProfile = require('../models/freelancerProfileModel'); // Adjust path as needed
const ClientProfile = require('../models/clientProfileModel');

// Follow a freelancer
const followFreelancer = async (followerId, followedId) => {
  try {
    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId }
    });
    if (existingFollow) {
      return { message: 'You are already following this user.' };
    }

    // Create a new follow relationship
    const follow = await Follow.create({ followerId, followedId });

    // Fetch the follower's username
    const follower = await User.findByPk(followerId, { attributes: ['username'] });

    // Create a notification for the followed user
    const message = `${follower.username} started following you.`;
    await createNotification(followedId, message);

    return { message: 'You are now following this user.', follow };
  } catch (error) {
    console.error('Error following freelancer:', error);
    throw error;
  }
};

//TODO: do isRead functionality

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


  const getFollowLists = async (userId) => {
    try {
      // Fetch users the logged-in user is following
      const following = await Follow.findAll({
        where: { followerId: userId },
        include: [
          {
            model: User,
            as: 'followedUser',
            attributes: ['user_id', 'username', 'email', 'city', 'role'], // Fetch user details
            include: [
              {
                model: FreelancerProfile,
                as: 'freelancerProfile', // Include freelancer profile
                attributes: ['profileImageUrl'], // Fetch profile image
              },
              {
                model: ClientProfile,
                as: 'clientProfile', // Include client profile
                attributes: ['profileImageUrl'], // Fetch profile image
              },
            ],
          },
        ],
      });
  
      // Fetch users who are following the logged-in user
      const followers = await Follow.findAll({
        where: { followedId: userId },
        include: [
          {
            model: User,
            as: 'followerUser',
            attributes: ['user_id', 'username', 'email', 'city', 'role'], // Fetch user details
            include: [
              {
                model: FreelancerProfile,
                as: 'freelancerProfile', // Include freelancer profile
                attributes: ['profileImageUrl'], // Fetch profile image
              },
              {
                model: ClientProfile,
                as: 'clientProfile', // Include client profile
                attributes: ['profileImageUrl'], // Fetch profile image
              },
            ],
          },
        ],
      });
  
      // Transform the data for the response
      const followingList = following.map(f => {
        const user = f.followedUser.dataValues;
        return {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          city: user.city,
          role: user.role,
          profileImageUrl: user.role === 'freelancer'
            ? user.freelancerProfile?.profileImageUrl || null
            : user.clientProfile?.profileImageUrl || null,
        };
      });
      
      const followerList = followers.map(f => {
        const user = f.followerUser.dataValues;
        return {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          city: user.city,
          role: user.role,
          profileImageUrl: user.role === 'freelancer'
            ? user.freelancerProfile?.profileImageUrl || null
            : user.clientProfile?.profileImageUrl || null,
        };
      });
  
      return {
        following: followingList,
        followers: followerList,
      };
    } catch (error) {
      console.error('Error fetching follow lists:', error);
      throw new Error('Unable to fetch follow lists.');
    }
  };
  
  module.exports = { followFreelancer, unfollowFreelancer, getFollowStatus, getFollowLists };
  