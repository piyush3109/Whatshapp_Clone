const mongoose = require('mongoose');

const statusSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaUrl: { type: String, default: '' },
  mediaType: { type: String, enum: ['image', 'video', 'text'], default: 'text' },
  textContent: { type: String, default: '' },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto-delete status after 24 hours
statusSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;
