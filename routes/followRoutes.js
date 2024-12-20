// routes/followRoutes.js
const express = require('express');
const { followFreelancer, unfollowFreelancer , getFollowStatus } = require('../controllers/followController');

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

module.exports = router;
