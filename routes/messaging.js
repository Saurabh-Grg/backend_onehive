const express = require('express');
const router = express.Router();

// Store the io object from server.js to emit WebSocket events here
let io;
let users;  // Declare users variable

module.exports = (socketIoInstance, usersObject) => {
  io = socketIoInstance;  // Assign the passed io instance
  users = usersObject;  // Assign the passed users object

  router.post('/sendMessage', (req, res) => {
    const { senderId, receiverId, message } = req.body;

    if (users[receiverId]) {
      // Emit message to receiver using WebSocket
      io.to(users[receiverId]).emit('newMessage', {
        senderId,
        receiverId,
        message,
      });

      return res.status(200).json({ message: 'Message sent' });
    } else {
      return res.status(404).json({ error: 'Receiver not connected' });
    }
  });

  return router;
};
