// const Message = require('../models/messageModel');  // Import the message model

// // Send a message to a specific receiver and save it to the database
// const sendMessage = async (senderId, receiverId, message, io) => {
//   try {
//     // Save the message to the database
//     const newMessage = await Message.create({ senderId, receiverId, message });
//     console.log('Message saved:', newMessage);

//     // Emit the message to the receiver
//     io.to(receiverId).emit('receive_message', newMessage);
//     console.log(`Message sent to receiver: ${receiverId}`);
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// };

// // Join a specific room (useful for group chats or topic-based rooms)
// const joinRoom = (socket, roomId) => {
//   console.log(`User joined room: ${roomId}`);
//   socket.join(roomId);
// };

// // Send a notification to all connected clients (broadcast to all users)
// const broadcastNotification = (io, message) => {
//   io.emit('notification', { message });
// };

// // Add more socket-related functionalities as needed...

// module.exports = {
//   sendMessage,
//   joinRoom,
//   broadcastNotification,
// };
