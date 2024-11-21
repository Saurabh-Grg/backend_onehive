// controllers/proposalController.js

const proposalService = require('../services/proposalService');
const Proposal = require('../models/proposalModel');

const submitProposal = async (req, res) => {
    // Extract data from request body
    const { job_id, name, experience, budget, use_escrow } = req.body;
  
    // Ensure that freelancer_id is fetched from the authenticated user
    const freelancer_id = req.user.user_id; // Assuming req.user is set by your auth middleware
  
    // Calculate escrow charge if needed
    const escrow_charge = use_escrow ? budget * 0.05 : 0.0;
  
    try {
      // Create the proposal using the extracted freelancer_id
      const proposal = await Proposal.create({
        job_id,
        freelancer_id, // This should now be populated correctly
        name,
        budget,
        use_escrow,
        escrow_charge,
      });
  
      // Respond with the created proposal
      return res.status(201).json({ proposal });
    } catch (error) {
      console.error('Error submitting proposal:', error);
      return res.status(400).json({ error: error.message });
    }
  };

  const getAllProposals = async (req, res) => {
    try {
      // Fetch all proposals using the service
      const proposals = await proposalService.fetchAllProposals();
      return res.status(200).json({ proposals });
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getProposalsForClient = async (req, res) => {
    const clientId = req.user.user_id; // Get client ID from authenticated user context
  
    try {
      const proposals = await proposalService.fetchProposalsForClient(clientId);
      return res.status(200).json({ proposals });
    } catch (error) {
      console.error('Error fetching proposals for client:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

module.exports = {
  submitProposal,
  getAllProposals,
  getProposalsForClient
};
