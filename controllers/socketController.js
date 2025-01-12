// const socketService = require('../services/socketService');  // Import the socket service

// module.exports = (io) => {
//   io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Emit connected feedback to the client
//     socket.emit('connected', { message: 'Socket connected successfully' });

//     // Handle send_message event
//     socket.on('send_message', async (data) => {
//       const { senderId, receiverId, message } = data;
//       console.log(`Received send_message event: senderId: ${senderId}, receiverId: ${receiverId}, message: ${message}`);
//       await socketService.sendMessage(senderId, receiverId, message, io);
//     });

//     // Handle join_room event
//     socket.on('join_room', (roomId) => {
//       console.log(`Received join_room event: roomId: ${roomId}`);
//       socketService.joinRoom(socket, roomId);
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });

//     // Handle socket error
//     socket.on('error', (error) => {
//       console.error('Socket error:', error);
//     });

//     // Debugging for WebSocket handshake issues
//     socket.on('handshake_error', (error) => {
//       console.error('Handshake error:', error);
//     });
//   });
// };
