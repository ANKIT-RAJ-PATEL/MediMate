const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { createChat, getUserChats, getChatMessages, sendMessage, deleteChat } = require('../controllers/chatController');

router.post('/', protect, createChat);
router.get('/', protect, getUserChats);
router.get('/:id', protect, getChatMessages);
router.post('/:id/message', protect, sendMessage);
router.delete('/:id', protect, deleteChat);

module.exports = router;
