const AcceptedJob = require('../models/acceptedJobModel');
const Job = require('../models/jobPostingModel');
const User = require('../models/userModel');

const getAcceptedJobs = async (req, res) => {
  try {
    // Get the authenticated client's user_id
    const clientId = req.user.user_id;  // Assuming `req.user.user_id` is set by authenticateUser middleware

    const acceptedJobs = await AcceptedJob.findAll({
      include: [
        {
          model: Job,
          attributes: ['title', 'category', 'description', 'payment_status', ], // Fetch job title & description
          as: 'job',
          where: { user_id: clientId }
        },
        {
          model: User,
          attributes: ['user_id','username'], // Fetch client name
          as: 'client',
        },
        {
          model: User,
          attributes: ['user_id','username'], // Fetch freelancer name
          as: 'freelancer',
        },
      ],
      attributes: [
        'budget',
        'use_escrow',
        'escrow_charge',
        'status',
        'createdAt',
        'updatedAt'
      ], // Fetch budget, escrow details, and status
    });

    return res.status(200).json({ acceptedJobs });
  } catch (error) {
    console.error("Error fetching accepted jobs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAcceptedJobs };
