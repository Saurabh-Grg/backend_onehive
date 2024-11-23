// config/multer.js
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads (profile image)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-images'); // Directory to save the profile images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: file size limit (5MB here)
  fileFilter: (req, file, cb) => {
    // Allowed file extensions and MIME types
    const allowedExtensions = ['.jpeg', '.jpg', '.png'];
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/octet-stream'];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileMimeType = file.mimetype.toLowerCase();

    // Log file details for debugging
    console.log(`File extension: ${fileExtension}`);
    console.log(`File MIME type: ${fileMimeType}`);

    // Check if the file is an image based on either MIME type or extension
    if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(fileMimeType)) {
      cb(null, true);
    } else {
      const errorMsg = `Only images are allowed (jpeg, jpg, png). Received: ${fileMimeType}`;
      console.error(errorMsg);
      cb(new Error(errorMsg));
    }
  }
});

module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// // Helper function to get storage configuration for different file types
// const getStorageConfig = (folder) => multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `uploads/${folder}`); // Save to the respective folder
//   },
//   filename: (req, file, cb) => {
//     // Add timestamp to filename to avoid name collisions
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // General file filter for validating image extensions and MIME types
// const fileFilter = (req, file, cb) => {
//   const allowedExtensions = ['.jpeg', '.jpg', '.png'];
//   const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

//   const fileExtension = path.extname(file.originalname).toLowerCase();
//   const fileMimeType = file.mimetype.toLowerCase();

//   // Validate file type
//   if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(fileMimeType)) {
//     cb(null, true);
//   } else {
//     const errorMsg = `Only images are allowed (jpeg, jpg, png). Received: ${fileMimeType}`;
//     cb(new Error(errorMsg));
//   }
// };

// // Multer instance for uploading profile images
// const uploadProfileImage = multer({
//   storage: getStorageConfig('profile-images'),
//   limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
//   fileFilter,
// });

// // Multer instance for uploading multiple portfolio images
// const uploadPortfolioImages = multer({
//   storage: getStorageConfig('portfolio-images'),
//   limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per image
//   fileFilter,
// }).array('portfolioImages', 5); // Limit to 5 files, adjust as necessary

// // Multer instance for uploading multiple certificates
// const uploadCertificates = multer({
//   storage: getStorageConfig('certificates'),
//   limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per image
//   fileFilter,
// }).array('certificateImages', 5); // Limit to 5 files, adjust as necessary

// module.exports = {
//   uploadProfileImage,
//   uploadPortfolioImages,
//   uploadCertificates
// };
