const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
// User Model for online updates
const User = require('./models/userModel');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/whatsapp-clone');
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.log('Starting in-memory MongoDB fallback...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-memory MongoDB Connected at: ${mongoUri}`);
    } catch (fallbackErr) {
      console.error('Failed to start in-memory MongoDB fallback:', fallbackErr);
    }
  }
};
connectDB();

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

let onlineUsers = new Map(); // userId => socketId

io.on('connection', (socket) => {
  console.log('Connected to socket.io:', socket.id);

  socket.on('setup', async (userData) => {
    socket.join(userData._id);
    onlineUsers.set(userData._id, socket.id);
    await User.findByIdAndUpdate(userData._id, { isOnline: true });
    socket.broadcast.emit('user online', userData._id); // tell others
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach(user => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageReceived);
    });
  });

  // Reactions & Deletions
  socket.on('message reaction', (data) => {
    socket.in(data.chatId).emit('reaction updated', data);
  });
  
  socket.on('message read', (data) => {
    socket.in(data.senderId).emit('message status update', { messageId: data.messageId, status: 'read' });
  });

  socket.on('message deleted', (data) => {
    socket.in(data.chatId).emit('message removed', data);
  });

  // WebRTC Calling signaling
  socket.on('call user', (data) => {
    socket.in(data.userToCall).emit('incoming call', { signal: data.signalData, from: data.from, type: data.callType });
  });

  socket.on('answer call', (data) => {
    socket.in(data.to).emit('call accepted', data.signal);
  });
  
  socket.on('end call', (data) => {
    socket.in(data.to).emit('call ended');
  });

  socket.on('disconnect_user', async (userId) => {
    if (userId) {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: Date.now() });
      socket.broadcast.emit('user offline', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
