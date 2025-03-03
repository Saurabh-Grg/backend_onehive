const Milestone = require("../models/milestoneModel");
const AcceptedJob = require("../models/acceptedJobModel");

const createMilestone = async (req, res) => {
    try {
      const { accepted_job_id, title, description } = req.body;
  
      // Check if the accepted job exists
      const acceptedJob = await AcceptedJob.findByPk(accepted_job_id);
      if (!acceptedJob) {
        return res.status(404).json({ message: "Accepted job not found" });
      }
  
      // Count existing milestones for this job
      const existingMilestones = await Milestone.count({ where: { accepted_job_id } });
  
      // If more than 4 milestones exist, request final submission
      if (existingMilestones >= 4) {
        return res.status(400).json({
          message: "You have already submitted 4 milestones. Please do the final submission."
        });
      }
  
      // Calculate new progress
      let newProgress = (existingMilestones + 1) * 20; // Each milestone increases by 20%
      if (newProgress > 100) newProgress = 100; // Cap progress at 100%
  
      // Create the milestone
      const milestone = await Milestone.create({
        accepted_job_id,
        title,
        description,
        progress: newProgress,
      });
  
      // Update job progress
      await acceptedJob.update({ progress: newProgress });
  
      res.status(201).json({
        message: "Milestone created successfully",
        milestone,
        job_progress: newProgress
      });
    } catch (error) {
      console.error("Error creating milestone:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Get all milestones for a specific accepted job
const getMilestonesByAcceptedJob = async (req, res) => {
  try {
    const { accepted_job_id } = req.params;
    
    const milestones = await Milestone.findAll({
      where: { accepted_job_id },
    });

    res.status(200).json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update milestone status and progress
const updateMilestone = async (req, res) => {
  try {
    const { milestone_id } = req.params;
    const { status, progress } = req.body;

    const milestone = await Milestone.findByPk(milestone_id);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    milestone.status = status || milestone.status;
    milestone.progress = progress !== undefined ? progress : milestone.progress;
    await milestone.save();

    res.status(200).json({ message: "Milestone updated successfully", milestone });
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a milestone
const deleteMilestone = async (req, res) => {
  try {
    const { milestone_id } = req.params;

    const milestone = await Milestone.findByPk(milestone_id);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    await milestone.destroy();
    res.status(200).json({ message: "Milestone deleted successfully" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createMilestone,
  getMilestonesByAcceptedJob,
  updateMilestone,
  deleteMilestone,
};
