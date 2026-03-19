const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  type: { type: String, enum: ['text', 'image', 'video', 'document', 'audio'], default: 'text' },
  fileUrl: { type: String, default: '' },
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String }
    }
  ],
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  deletedForMe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deletedForEveryone: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
