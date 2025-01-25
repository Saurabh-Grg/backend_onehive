const { Op } = require("sequelize");
const Message = require("../models/Message");

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle message sending
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, message } = data;
      console.log(
        "Message received from sender:",
        senderId,
        "to receiver:",
        receiverId,
        "Message:",
        message
      );

      try {
        // Save the message to the database
        const savedMessage = await Message.create({
          senderId: senderId,
          receiverId: receiverId,
          message: message,
          messageType: "text", // Modify if it's a media message
        });

        // Emit the message to the receiver
        socket.to(receiverId).emit("receive_message", {
          senderId,
          message: savedMessage.message,
        });

        // Confirm message sent to the sender
        socket.emit("message_sent", { senderId, message: savedMessage.message });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Handle typing events
    socket.on("typing", (data) => {
      const { senderId, receiverId } = data;
      console.log(`User ${senderId} is typing to ${receiverId}`);
      socket.to(receiverId).emit("typing", { senderId, isTyping: true });
    });

    socket.on("stop_typing", (data) => {
      const { senderId, receiverId } = data;
      console.log(`User ${senderId} stopped typing to ${receiverId}`);
      socket.to(receiverId).emit("typing", { senderId, isTyping: false });
    });

    // Join room based on userId
    socket.on("join", async (userId) => {
      console.log(`User ${userId} joined`);
      socket.join(userId);

      // Fetch message history
      const messages = await Message.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      // Emit message history
      socket.emit("message_history", messages);
    });

    // Handle media messages
    socket.on("send_media", (data) => {
      const { senderId, receiverId, fileUrl } = data;
      console.log(
        "Media received from sender:",
        senderId,
        "to receiver:",
        receiverId,
        "File URL:",
        fileUrl
      );
      socket.to(receiverId).emit("receive_media", { senderId, fileUrl });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = initializeSocket;
