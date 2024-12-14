//services/jobPostingService.js
const Job = require('../models/jobPostingModel');
const BackendJob = require('../models/backendDevJobModel');
const FrontendDevJob = require('../models/frontendDevJobModel');
const FullStackDevJob = require('../models/fullStackDevJobModel');

// Function to create common job entry
const createCommonJob = async (tempJobDetails) => {
    return await Job.create({
        title: tempJobDetails.title,
        description: tempJobDetails.description,
        category: tempJobDetails.category,
        user_id: tempJobDetails.user_id,
    });
};

// Function to create Backend job entry
const createBackendJob = async (job_id, backendDetails) => {
    return await BackendJob.create({
        job_id, // Link to the job created in 'jobs' table
        selected_backend_framework: backendDetails.selected_backend_framework,
        database_type: backendDetails.database_type,
        complexity: backendDetails.complexity,
        start_date: backendDetails.start_date,
        end_date: backendDetails.end_date,
        payment_type: backendDetails.payment_type,
        budget_range: backendDetails.budget_range,
        experience_level: backendDetails.experience_level,
        attached_files: backendDetails.attached_files,
        communication_channel: backendDetails.communication_channel,
        communication_frequency: backendDetails.communication_frequency,
        additional_notes: backendDetails.additional_notes,
    });
};

// Function to create Frontend job entry
const createFrontendJob = async (job_id, frontendDetails) => {
    return await FrontendDevJob.create({
        job_id, // Link to the job created in 'jobs' table
        selected_framework: frontendDetails.selected_framework,
        design_tool: frontendDetails.design_tool,
        complexity: frontendDetails.complexity,
        start_date: frontendDetails.start_date,
        end_date: frontendDetails.end_date,
        payment_type: frontendDetails.payment_type,
        budget_range: frontendDetails.budget_range,
        experience_level: frontendDetails.experience_level,
        attached_files: frontendDetails.attached_files,
        communication_channel: frontendDetails.communication_channel,
        communication_frequency: frontendDetails.communication_frequency,
        additional_notes: frontendDetails.additional_notes,
    });
};

// Function to create Frontend job entry
const createFullStackJob = async (job_id, fullStackDetails) => {
    return await FullStackDevJob.create({
        job_id, // Link to the job created in 'jobs' table
        selected_frontend_framework: fullStackDetails.selected_frontend_framework,
        selected_backend_framework: fullStackDetails.selected_backend_framework,
        database_type: fullStackDetails.database_type,
        complexity: fullStackDetails.complexity,
        start_date: fullStackDetails.start_date,
        end_date: fullStackDetails.end_date,
        payment_type: fullStackDetails.payment_type,
        budget_range: fullStackDetails.budget_range,
        experience_level: fullStackDetails.experience_level,
        attached_files: fullStackDetails.attached_files,
        communication_channel: fullStackDetails.communication_channel,
        communication_frequency: fullStackDetails.communication_frequency,
        additional_notes: fullStackDetails.additional_notes,
    });
};

const getJobs = async () => {
    return await Job.findAll({
      attributes: ['title', 'description', 'category']
    });
  };

// Function to fetch job details based on the job's category
const getJobDetailsById = async (job_id) => {
    // Fetch common job details
    const jobDetails = await Job.findOne({ where: { job_id } });

    if (!jobDetails) {
        throw new Error('Job not found');
    }

    let categorySpecificDetails;

    // Fetch category-specific details based on the category
    switch (jobDetails.category) {
        case 'Backend Development':
            categorySpecificDetails = await BackendJob.findOne({ where: { job_id } });
            break;
        case 'Frontend Development':
            categorySpecificDetails = await FrontendDevJob.findOne({ where: { job_id } });
            break;
        case 'Full-Stack Development':
            categorySpecificDetails = await FullStackDevJob.findOne({ where: { job_id } });
            break;
        default:
            throw new Error('Invalid job category');
    }

    return {
        ...jobDetails.dataValues,
        categoryDetails: categorySpecificDetails ? categorySpecificDetails.dataValues : null
    };
};

module.exports = {
    createCommonJob,
    createBackendJob,
    createFrontendJob,
    createFullStackJob,
    getJobs,
    getJobDetailsById,
};
