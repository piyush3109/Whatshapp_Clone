const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { content, chatId, type, fileUrl, replyTo } = req.body;

  if (!content || !chatId) {
    return res.status(400).send({ message: 'Invalid data passed into request' });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    type: type || 'text',
    fileUrl: fileUrl || '',
    replyTo: replyTo || null,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await message.populate('replyTo'); // Vital for UI display
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get('/:chatId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name' }
      });
    res.json(messages);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/reaction', protect, async (req, res) => {
  const { messageId, emoji } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).send({ message: 'Message not found' });

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReactionIndex !== -1) {
      if (message.reactions[existingReactionIndex].emoji === emoji) {
        // Remove if same emoji
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // Update if different emoji
        message.reactions[existingReactionIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ user: req.user._id, emoji });
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
