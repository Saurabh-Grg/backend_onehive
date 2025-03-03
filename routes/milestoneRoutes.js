const express = require("express");
const router = express.Router();
const milestoneController = require("../controllers/milestoneController");
const authenticateUser = require('../middleware/auth');

// Create a milestone
router.post("/", authenticateUser,milestoneController.createMilestone);

// Get milestones by accepted job ID
router.get("/:accepted_job_id", milestoneController.getMilestonesByAcceptedJob);

// Update milestone
router.put("/:milestone_id", milestoneController.updateMilestone);

// Delete milestone
router.delete("/:milestone_id", milestoneController.deleteMilestone);

module.exports = router;
