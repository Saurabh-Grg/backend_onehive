const express = require('express');
const Notification = require('../models/notificationModel');

const router = express.Router();

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

  // Mark all notifications for a user as read
  router.put('/user/:userId/readAll', async (req, res) => {
    const { userId } = req.params;
  
    try {
      await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } } // Only update unread notifications
      );
  
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking notifications as read', error });
    }
  });
  

module.exports = router;

// // Mark a single notification as read
// router.put('/:notificationId/read', async (req, res) => {
//     const { notificationId } = req.params;
  
//     try {
//       const notification = await Notification.findByPk(notificationId);
  
//       if (!notification) {
//         return res.status(404).json({ message: 'Notification not found' });
//       }
  
//       notification.isRead = true;
//       await notification.save();
  
//       res.status(200).json({ message: 'Notification marked as read', notification });
//     } catch (error) {
//       res.status(500).json({ message: 'Error marking notification as read', error });
//     }
//   });
  
