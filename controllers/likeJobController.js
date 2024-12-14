const LikeJobService = require('../services/likeJobService');

// Like a job
const likeJob = async (req, res) => {
    const { freelancerId, jobId } = req.body;

    if (!freelancerId || !jobId) {
        return res.status(400).json({ message: 'Freelancer ID and Job ID are required' });
    }

    try {
        const result = await LikeJobService.addLike(freelancerId, jobId);

        if (result === 'added') {
            return res.status(201).json({ message: 'Job successfully added to your liked jobs list.' });
        } else if (result === 'removed') {
            return res.status(200).json({ message: 'Job removed from your liked jobs list.' });
        } else {
            console.error('Unexpected result:', result); // Log unexpected results for debugging
            return res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while liking/unliking the job.' });
    }
};

// Get liked jobs for a freelancers
const getLikedJobs = async (req, res) => {
    const { freelancerId } = req.params;

    if (!freelancerId) {
        return res.status(400).json({ message: 'Freelancer ID is required' });
    }

    try {
        const likedJobs = await LikeJobService.getLikedJobs(freelancerId);
        res.status(200).json(likedJobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving liked jobs.' });
    }
};

module.exports = {
    likeJob,
    getLikedJobs,
};
