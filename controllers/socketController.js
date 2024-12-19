// controllers/socketController.js
const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel'); // Import the Message model

class SocketController {
  constructor(io) {
    this.io = io;
    this.users = {}; // Store users and their socket IDs
    this.initializeSocket();
  }

  // controllers/socketController.js

initializeSocket() {
  const socketUrl = `ws://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
  console.log(`Socket server is listening at ${socketUrl}`);

  // Middleware for authenticating socket connections
  this.io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error("Socket connection error: No token provided.");
      return next(new Error("Authentication error: No token provided."));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user info to the socket instance
      console.log(`User authenticated: ${socket.user.user_id}`);
      next();
    } catch (err) {
      console.error("Socket authentication error:", err.message);
      next(new Error("Authentication error: Invalid token."));
    }
  });

  // Handle connections
  this.io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.user_id}, socket ID: ${socket.id}`);
    this.users[socket.user.user_id] = socket.id; // Register the user

    // Log all connected users
    console.log('Connected users:', this.users);

    // Handle message sending
    socket.on('sendMessage', async ({ to, message }) => {
      try {
        console.log(`Message received from ${socket.user.user_id}: ${message} to ${to}`);
        console.log('Currently connected users:', this.users);

        // Save the message to the database
        const newMessage = await Message.create({
          sender_id: socket.user.user_id,
          receiver_id: to,
          message,
        });

        // Emit the message to the recipient
        if (this.users[to]) {
          this.io.to(this.users[to]).emit('receiveMessage', newMessage);
          console.log(`Message sent from ${socket.user.user_id} to ${to}: ${message}`);
        } else {
          console.error(`Receiver ${to} is not online`);
        }
      } catch (err) {
        console.error("Error sending message:", err.message);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.user_id}, socket ID: ${socket.id}`);
      delete this.users[socket.user.user_id]; // Clean up user on disconnect
    });
  });
}

}

// Export the controller as a function to initialize the socket
module.exports = (io) => new SocketController(io);
