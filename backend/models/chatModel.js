const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  chatName: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  groupIcon: { type: String, default: 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg' },
  groupDescription: { type: String, default: '' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  groupAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  archivedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
