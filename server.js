const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');  // Add this
const { swaggerDocs, swaggerUi } = require("./config/swagger");


// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your Flutter web app's URL
  credentials: true
}));

app.use(bodyParser.json());

// Configure session
app.use(session({
    secret: process.env.JWT_SECRET, // replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Set static folder for serving uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/auth');
const clientProfileRoutes = require('./routes/clientProfile');
const freelancerProfileRoutes = require('./routes/freelancerProfile');
const jobPostingRoutes = require('./routes/jobPosting'); // Import job posting routes
const upload  = require('./config/multer'); // Multer configuration imported here
const proposalRoutes = require('./routes/proposal');  // Import proposal routes

// const paymentRoutes = require("./routes/payment");
// app.use("/payment", paymentRoutes);

// Use Routes
app.use('/api/auth', authRoutes); // Authentication endpoints
app.use('/api/clientProfile', clientProfileRoutes); // Client profile creation endpoints
app.use('/api/freelancerProfile', freelancerProfileRoutes);
app.use('/api/jobPosting', jobPostingRoutes); // Job posting endpoints
app.use('/api/proposals', proposalRoutes); // Register proposal routes

app.post('/uploads/profile-image', upload, (req, res) => {
  if (req.file) {
    // If a file was uploaded
    return res.json({ profileImageUrl: `/uploads/profile-images/${req.file.filename}` });
  }
  // If no file was uploaded, return a success response without the image URL
  return res.json({ message: 'No image uploaded', profileImageUrl: null });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs are available at http://localhost:${PORT}/api-docs`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/test.html");
});