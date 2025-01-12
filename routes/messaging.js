const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');

router.post('/send', messagingController.sendMessage);
router.get('/fetch', messagingController.getMessages);

module.exports = (io) => {
  return router;
};
