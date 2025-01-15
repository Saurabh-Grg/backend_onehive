// const http = require('http'); // Add this line to import the http module
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const session = require('express-session');  // Add this
// const { swaggerDocs, swaggerUi } = require("./config/swagger");
// const { Server } = require("socket.io");

// // Load environment variables
// dotenv.config();

// // Initialize the app
// const app = express();

// const server = http.createServer(app);
// const io = new Server(server);  // Socket.io server instance
// io.on('connection', (socket) => {
//   console.log("A new connection has been established", socket.id);
// });


// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // Middleware
// // app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your Flutter web app's URL
//   credentials: true
// }));

// app.use(bodyParser.json());

// // Configure session
// app.use(session({
//     secret: process.env.JWT_SECRET, // replace with your own secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false, // Set to true if using HTTPS
//         maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
// }));

// // Set static folder for serving uploaded images
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Import Routes
// const authRoutes = require('./routes/auth');
// const clientProfileRoutes = require('./routes/clientProfile');
// const freelancerProfileRoutes = require('./routes/freelancerProfile');
// const jobPostingRoutes = require('./routes/jobPosting'); // Import job posting routes
// const upload  = require('./config/multer'); // Multer configuration imported here
// const proposalRoutes = require('./routes/proposal');  // Import proposal routes
// const likedJobsRoutes = require('./routes/likeJobRoutes');
// const followRoutes = require('./routes/followRoutes');
// // Import routes
// const messagingRoutes = require('./routes/messaging'); 
//  // Import messages routes
// const SocketController = require('./controllers/socketController');

// const notificationsRoutes = require('./routes/notificationRoutes');

// // Initialize real-time messaging
// SocketController(io);

// const paymentRoutes = require('./routes/payment');

// app.use('/payment', paymentRoutes);


// // Use Routes
// app.use('/api/auth', authRoutes); // Authentication endpoints
// app.use('/api/clientProfile', clientProfileRoutes); // Client profile creation endpoints
// app.use('/api/freelancerProfile', freelancerProfileRoutes);
// app.use('/api/jobPosting', jobPostingRoutes); // Job posting endpoints
// app.use('/api/proposals', proposalRoutes); // Register proposal routes
// app.use('/api/liked-jobs', likedJobsRoutes);
// // Use follow routes
// app.use('/api/follow', followRoutes);
// // Register message routes
// app.use('/api/messages', messagingRoutes);

// app.use('/api/notifications', notificationsRoutes); 


// app.post('/uploads/profile-image', upload, (req, res) => {
//   if (req.file) {
//     // If a file was uploaded
//     return res.json({ profileImageUrl: `/uploads/profile-images/${req.file.filename}` });
//   }
//   // If no file was uploaded, return a success response without the image URL
//   return res.json({ message: 'No image uploaded', profileImageUrl: null });
// });

// app.use(express.static(path.resolve("./public"))); 

// app.get("/", (req, res) => {
//   return res.sendFile("/public/index.html");
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Swagger Docs are available at http://localhost:${PORT}/api-docs`);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });


const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Create the HTTP server
const server = http.createServer(app);
const io = socketIo(server);           // Initialize Socket.io with the server
// const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your Flutter web app's URL
  credentials: true
}));
app.use(bodyParser.json());

// Configure session
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,  // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24,  // 1 day
  }
}));

// Set static folder for serving uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes and use them
const authRoutes = require('./routes/auth');
const clientProfileRoutes = require('./routes/clientProfile');
const freelancerProfileRoutes = require('./routes/freelancerProfile');
const jobPostingRoutes = require('./routes/jobPosting');
const proposalRoutes = require('./routes/proposal');
const likedJobsRoutes = require('./routes/likeJobRoutes');
const followRoutes = require('./routes/followRoutes');
const notificationsRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/payment');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message'); 

// Use Routes
app.use('/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clientProfile', clientProfileRoutes);
app.use('/api/freelancerProfile', freelancerProfileRoutes);
app.use('/api/jobPosting', jobPostingRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/liked-jobs', likedJobsRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messageRoutes);

// Swagger Documentation
const { swaggerDocs, swaggerUi } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Handle file uploads
const upload = require('./config/multer');
app.post('/uploads/profile-image', upload, (req, res) => {
  if (req.file) {
    return res.json({ profileImageUrl: `/uploads/profile-images/${req.file.filename}` });
  }
  return res.json({ message: 'No image uploaded', profileImageUrl: null });
});

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Server-side: socket.io event to handle message sending
socket.on('send_message', async (data) => {
    const { senderId, receiverId, message } = data;
    console.log('Message received from sender:', senderId, 'to receiver:', receiverId, 'Message:', message);
  
    try {
      // Save the message to the database
      const savedMessage = await Message.create({
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        messageType: 'text', // You can modify this if it's a media message
      });
  
      // Emit the message to the receiver only
      socket.to(receiverId).emit('receive_message', {
        senderId,
        message: savedMessage.message, // Use the message from the database
      });
  
      // Emit back to the sender (optional, for confirmation)
      socket.emit('message_sent', { senderId, message: savedMessage.message });
  
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Join room for the user based on their userId
  socket.on('join', (userId) => {
    console.log(`User ${userId} joined`);
    socket.join(userId); // Join a room with userId as the room name
  });

  // Handle media messages (image, audio, video)
  socket.on('send_media', (data) => {
    const { senderId, receiverId, fileUrl } = data;
    console.log('Media received from sender:', senderId, 'to receiver:', receiverId, 'File URL:', fileUrl);

    // Emit the media to the specific receiver only
    socket.to(receiverId).emit('receive_media', { senderId, fileUrl });
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs are available at http://localhost:${PORT}/api-docs`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
