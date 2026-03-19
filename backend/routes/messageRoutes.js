const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).send({ message: 'Invalid data passed into request' });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    type: req.body.type || 'text',
    fileUrl: req.body.fileUrl || '',
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
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
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
