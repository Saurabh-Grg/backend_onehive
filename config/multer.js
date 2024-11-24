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

//TODO: multiple images uploading is not done

module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Different folders for different fields
//     if (file.fieldname === 'profileImage') {
//       cb(null, 'uploads/profile-images'); // Directory for profile images
//     } else if (file.fieldname === 'portfolioImages') {
//       cb(null, 'uploads/portfolio-images'); // Directory for portfolio images
//     } else if (file.fieldname === 'certificates') {
//       cb(null, 'uploads/certificates'); // Directory for certificates
//     } else {
//       cb(new Error('Unexpected field')); // Error if an unexpected field is encountered
//     }
//   },
//   filename: (req, file, cb) => {
//     // Generate unique filenames
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // File filter to allow only images
// const fileFilter = (req, file, cb) => {
//   const allowedExtensions = ['.jpeg', '.jpg', '.png'];
//   const fileExtension = path.extname(file.originalname).toLowerCase();

//   if (allowedExtensions.includes(fileExtension)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
//   }
// };

// // Multer configuration
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit per file
//   fileFilter
// });

// // Export the upload configuration with fields for multiple inputs
// const multiUpload = upload.fields([
//   { name: 'profileImage', maxCount: 1 },       // Single profile image
//   { name: 'portfolioImages', maxCount: 10 },  // Up to 10 portfolio images
//   { name: 'certificates', maxCount: 10 }      // Up to 10 certificate images
// ]);

// module.exports = multiUpload;


