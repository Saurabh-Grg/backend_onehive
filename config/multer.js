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

// Define limits for file uploads
const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB size limit per file


// Combine the multer configuration with field-specific limits
const upload = multer({
  storage,
  limits,
  fileFilter
}).fields([
  { name: 'profileImage', maxCount: 1 }, // Allow only 1 profile image
  { name: 'certificates', maxCount: 10 }, // Allow up to 5 certificate images
  { name: 'portfolioImages', maxCount: 10 }, // Allow up to 10 portfolio images
]);
console.log("Multer configuration initialized");

module.exports = upload;




//TODO: multiple images uploading is not done


