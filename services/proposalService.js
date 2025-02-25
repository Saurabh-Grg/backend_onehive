// services/proposalService.js
const Job = require('../models/jobPostingModel');
const User = require('../models/userModel');
const Proposal = require('../models/proposalModel');

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



// Function to fetch a proposal by its ID
async function fetchProposalById(proposalId) {
  return await Proposal.findByPk(proposalId);
}

  async function acceptProposalService(proposal_id, clientId) {
    // Find the proposal
    const proposal = await Proposal.findByPk(proposal_id);
    if (!proposal) {
        return { error: "Proposal not found." };
    }

    // Fetch the job related to the proposal
    const job = await Job.findByPk(proposal.job_id);

    if (!job) {
        return { error: "Job not found." };
    }

    // Check if the authenticated client is the owner of the job
    if (job.user_id !== clientId) {
        return { error: "You are not authorized to accept this proposal." };
    }

    // Update job status to "ongoing"
    await Job.update({ status: "ongoing" }, { where: { job_id: job.job_id } });

    // Delete the accepted proposal
    await Proposal.destroy({ where: { proposal_id: proposal_id } });

    return { success: true };
}

module.exports = {
  submitProposal,
  fetchAllProposals,
  fetchProposalsForClient,
  fetchTotalProposalsForClient ,
  acceptProposalService,
  fetchProposalById
};
