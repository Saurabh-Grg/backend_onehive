const Notification = require('../models/notificationModel');

const createNotification = async (userId, message) => {
  try {
    const notification = await Notification.create({ userId, message });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};


module.exports = { createNotification };


// interview question: notification through firebase??