const mongoose = require('mongoose');

const callSchema = mongoose.Schema({
  caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isGroupCall: { type: Boolean, default: false },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  type: { type: String, enum: ['audio', 'video'], required: true },
  status: { type: String, enum: ['missed', 'completed', 'ongoing', 'rejected'], default: 'ongoing' },
  duration: { type: Number, default: 0 }, // in seconds
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
}, { timestamps: true });

const Call = mongoose.model('Call', callSchema);
module.exports = Call;
