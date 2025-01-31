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
    socket.on("join_chat", async (data) => {
      const { senderId, receiverId } = data;
      console.log(`User ${senderId} joined chat with ${receiverId}`);
  
      socket.join(`${senderId}-${receiverId}`);
      socket.join(`${receiverId}-${senderId}`); // Ensure both users are in the same chat room
  
      try {
          const messages = await Message.findAll({
              where: {
                  [Op.or]: [
                      { senderId: senderId, receiverId: receiverId },
                      { senderId: receiverId, receiverId: senderId },
                  ],
              },
              order: [["createdAt", "ASC"]], // Sort messages in order
          });
  
          // Emit only relevant messages
          socket.emit("message_history", messages);
      } catch (error) {
          console.error("Error retrieving message history:", error);
          socket.emit("error", { message: "Failed to load messages." });
      }
  });
  
  

    // Handle media messages
    socket.on("send_media", async (data) => {
      const { senderId, receiverId, fileUrl, messageType } = data;
      
      console.log(`Media received from sender: ${senderId} to receiver: ${receiverId}, File: ${fileUrl}`);
    
      try {
        // Save media message in database
        const savedMessage = await Message.create({
          senderId,
          receiverId,
          fileUrl,
          messageType, // 'image', 'video', 'audio', 'document'
          message: ''  // Empty since it's a media file
        });
    
        // Emit media message to receiver
        io.to(`${senderId}-${receiverId}`).emit("receive_media", {
          senderId,
          receiverId,
          fileUrl,
          messageType
        });
    
        // Confirm message sent to sender
        socket.emit("media_sent", { senderId, fileUrl, messageType });
      } catch (error) {
        console.error("Error saving media message:", error);
      }
    });
    

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.leave(room);
            console.log(`User left room: ${room}`);
          }
        });
      });      
  });
}

module.exports = initializeSocket;
