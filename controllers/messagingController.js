const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Save message to database
    const newMessage = await Message.create({ senderId, receiverId, message });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    // Fetch messages between two users
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [['timestamp', 'ASC']],
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};
