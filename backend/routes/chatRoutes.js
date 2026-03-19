const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).send({ message: 'UserId not sent' });

  // check if chat with this user exists
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    const chats = await User.populate(results, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });
    res.status(200).send(chats);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post('/group', protect, async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please Fill all the fields' });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send({ message: 'More than 2 users are required to form a group chat' });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
