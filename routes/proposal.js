// routes/proposal.js

const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const auth = require('../middleware/auth');

// Route to submit a proposal (requires authentication)
router.post('/submit', auth, proposalController.submitProposal);

// Route to fetch all proposals (can be public or require authentication)
router.get('/', proposalController.getAllProposals); // Change this line as needed

// Route to fetch proposals for jobs posted by the authenticated client
router.get('/client', auth, proposalController.getProposalsForClient); // Add this line


module.exports = router;
