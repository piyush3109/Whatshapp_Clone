import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, MoreVertical } from 'lucide-react';
import Message from './Message';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5001';
var socket, selectedChatCompare;

const ChatBox = () => {
  const { user, selectedChat, messages, setMessages } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${ENDPOINT}/api/message/${selectedChat._id}`, config);
      setMessages(data);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const messageHandler = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Notification logic later
      } else {
        const { messages, setMessages } = useStore.getState();
        setMessages([...messages, newMessageReceived]);
      }
    };
    
    if (socket) {
      socket.on('message recieved', messageHandler);
    }
    return () => {
      if (socket) socket.off('message recieved', messageHandler);
    };
  }, []);

  const sendMessage = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (e.key === 'Enter') e.preventDefault();
      if (!newMessage) return;
      
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = { headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` } };
        setNewMessage('');
        const { data } = await axios.post(`${ENDPOINT}/api/message`, {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);
        
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getChatName = (loggedUser, chat) => {
    if (chat.isGroupChat) return chat.chatName;
    return chat.users[0]._id === loggedUser._id ? chat.users[1].name : chat.users[0].name;
  };

  const getChatPic = (loggedUser, chat) => {
    if (chat.isGroupChat) return 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg';
    return chat.users[0]._id === loggedUser._id ? chat.users[1].pic : chat.users[0].pic;
  };

  if (!selectedChat) {
    return (
      <div className="chat-area" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#8696a0', fontSize: '32px', fontWeight: '300' }}>WhatsApp Web Clone</h2>
        <p style={{ color: '#8696a0', marginTop: '20px' }}>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <img src={getChatPic(user, selectedChat)} alt="" className="avatar" />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '500' }}>{getChatName(user, selectedChat)}</h3>
          {isTyping && <p style={{ fontSize: '12px', color: '#00a884' }}>typing...</p>}
        </div>
        <MoreVertical style={{ cursor: 'pointer', color: '#aebac1' }} />
      </div>

      <div className="messages-container">
        {messages.map((m, i) => (
          <Message key={m._id} message={m} user={user} isGroupChat={selectedChat.isGroupChat} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type a message"
          className="chat-input"
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={sendMessage}
        />
        <button onClick={sendMessage} className="send-btn">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
