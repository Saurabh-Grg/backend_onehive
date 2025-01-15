// routes/followRoutes.js
const express = require('express');
const { followFreelancer, unfollowFreelancer , getFollowStatus , getFollowLists  } = require('../controllers/followController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Route to follow a freelancer
router.post('/follow', async (req, res) => {
  const { followerId, followedId } = req.body;
  try {
    const result = await followFreelancer(followerId, followedId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error following freelancer', error });
  }
});

// Route to unfollow a freelancer
router.post('/unfollow', async (req, res) => {
  const { followerId, followedId } = req.body;
  try {
    const result = await unfollowFreelancer(followerId, followedId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing freelancer', error });
  }
});

// Route to check if the user is following a freelancer
router.get('/status/:followerId/:followedId', async (req, res) => {
    const { followerId, followedId } = req.params;
    try {
      const result = await getFollowStatus(followerId, followedId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error checking follow status', error });
    }
  });

// Route to fetch follow lists
router.get('/follow-lists', authenticateUser, async (req, res) => {
  const userId = req.user?.user_id; // User ID is populated by the middleware
  try {
    const followLists = await getFollowLists(userId);
    res.status(200).json(followLists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follow lists', error: error.message });
  }
});


module.exports = router;
