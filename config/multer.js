// config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to create directories if they don't exist
const createDirIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Multer configuration for file uploads (profile image)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define folder paths based on the field name
    let folder = 'uploads/others'; // Default folder if no match
    if (file.fieldname === 'profileImage') {
      folder = 'uploads/profile-images';
    } else if (file.fieldname === 'certificates') {
      folder = 'uploads/certificates';
    } else if (file.fieldname === 'portfolioImages') {
      folder = 'uploads/portfolio-images';
    } else if (file.fieldname === 'coverLetter') {
      folder = 'uploads/cover-letters'; // Add cover letter folder
    }

    // Log folder and file info for debugging
    console.log("Uploading to folder:", folder);
    console.log("File info:", file);

    // Ensure the folder exists before proceeding
    createDirIfNotExists(path.join(__dirname, '..', folder));

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Storage configuration for chat file uploads
const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/chat-files';
    createDirIfNotExists(path.join(__dirname, '..', folder));
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


// File filter for allowed file types (images only)
const fileFilter = (req, file, cb) => {
  // Allowed file extensions and MIME types
  const allowedExtensions = ['.jpeg', '.jpg', '.png'];
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/octet-stream'];

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileMimeType = file.mimetype.toLowerCase();

  console.log(`File extension: ${fileExtension}`);
  console.log(`File MIME type: ${fileMimeType}`);

  // Check if the file is an image based on MIME type or extension
  if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(fileMimeType)) {
    cb(null, true);
  } else {
    const errorMsg = `Only images are allowed (jpeg, jpg, png). Received: ${fileMimeType}`;
    console.error(errorMsg);
    cb(new Error(errorMsg));
  }
};

// File filter for cover letter uploads (only PDF)
const coverLetterFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'));
  }
};

// File filter for chat file uploads (Supports images, videos, audio, and documents)
const chatFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png',
    'video/mp4', 'audio/mpeg', 'audio/mp3',
    'application/pdf', 'application/msword'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, audio, and documents are allowed.'));
  }
};

// Define limits for file uploads
const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB size limit per file

const chatLimits = { fileSize: 10 * 1024 * 1024 }; // 10MB for chat files

const coverLetterLimits = { fileSize: 10 * 1024 * 1024 }; // 10MB size limit for cover letter



// Combine the multer configuration with field-specific limits
const upload = multer({
  storage,
  limits,
  fileFilter
}).fields([
  { name: 'profileImage', maxCount: 1 }, // Allow only 1 profile image
  { name: 'certificates', maxCount: 10 }, // Allow up to 5 certificate images
  { name: 'portfolioImages', maxCount: 10 }, // Allow up to 10 portfolio images
  { name: 'coverLetter', maxCount: 1 }, // Allow only 1 cover letter
]);
// console.log("Multer configuration initialized");

const chatUpload = multer({
  storage: chatStorage,
  limits: chatLimits,
  fileFilter: chatFileFilter
}).single('chatFile'); // Accept a single chat file


module.exports = { upload, chatUpload };




//TODO: multiple images uploading is not done


