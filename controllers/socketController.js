let users = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on('sendMessage', (messageData) => {
      console.log('Received message:', messageData);

      const receiverSocketId = users[messageData.receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', {
          senderId: messageData.senderId,
          message: messageData.message,
        });
        console.log('Message sent to', messageData.receiverId);
      } else {
        console.log('Receiver is not online');
      }
    });

    socket.on('disconnect', () => {
      Object.keys(users).forEach((userId) => {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} disconnected`);
        }
      });
    });
  });

  // Export the users object for other files to use
  return users;
};
