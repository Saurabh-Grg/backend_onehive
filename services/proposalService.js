// services/proposalService.js
const Job = require('../models/jobPostingModel');
const User = require('../models/userModel');
const Proposal = require('../models/ProposalModel');

async function submitProposal(data) {
  const { job_id, freelancer_id, name, budget, use_escrow } = data;

  // Calculate escrow charge if escrow is selected
  const escrowCharge = use_escrow ? budget * 0.05 : 0;
  const finalBudget = budget - escrowCharge;

  // Create proposal in the database
  const proposal = await Proposal.create({
    job_id,
    freelancer_id,
    name,
    budget: finalBudget,
    use_escrow,
    escrow_charge: escrowCharge,
  });

  return proposal;
}

// Function to fetch all proposals
async function fetchAllProposals() {
    return await Proposal.findAll();
  }
  
  async function fetchProposalsForClient(clientId) {
    // Fetch jobs posted by the client
    const jobs = await Job.findAll({
      where: { user_id: clientId }, // Filter jobs by the client's ID
    });
  
    // Get the job IDs
    const jobIds = jobs.map(job => job.job_id);
  
    // Fetch proposals for those jobs, including the job title from the Job model
  return await Proposal.findAll({
    where: { job_id: jobIds }, // Get proposals for the specified job IDs
    include: [
      {
        model: Job,
        attributes: ['title'], // Include only the job title
        as: 'job', // Use the alias as defined in the association
      },
    ],
  });
  }

  const fetchTotalProposalsForClient = async (clientId) => {
    const { Op } = require('sequelize'); // Sequelize operators for advanced queries
  
    // Fetch jobs posted by the client
    const jobs = await Job.findAll({
      where: { user_id: clientId }, // Filter jobs by the client's ID
      attributes: ['job_id'], // Only fetch job_id to minimize data load
    });
  
    // Extract job IDs
    const jobIds = jobs.map(job => job.job_id);
  
    // Count total proposals for those job IDs
    const totalProposals = await Proposal.count({
      where: {
        job_id: {
          [Op.in]: jobIds, // Match job IDs in the proposal table
        },
      },
    });
  
    return totalProposals;
  };

module.exports = {
  submitProposal,
  fetchAllProposals,
  fetchProposalsForClient,
  fetchTotalProposalsForClient 
};
