import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, IndianRupee, Smile } from 'lucide-react';
import { useStore } from '../store';
import axios from 'axios';
import { io } from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5001';
var socket;

const ChatWindowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, chats, messages, setMessages } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  
  const selectedChat = chats?.find(c => c._id === id);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    return () => socket.disconnect();
  }, [user]);

  const fetchMessages = async () => {
    if (!id) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${ENDPOINT}/api/message/${id}`, config);
      setMessages(data);
      socket.emit('join chat', id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  useEffect(() => {
    const messageHandler = (newMessageReceived) => {
      if (id === newMessageReceived.chat._id) {
        setMessages([...useStore.getState().messages, newMessageReceived]);
      }
    };
    if (socket) socket.on('message recieved', messageHandler);
    return () => {
      if (socket) socket.off('message recieved', messageHandler);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (e.type === 'keydown') e.preventDefault();
      if (!newMessage.trim()) return;
      
      try {
        const config = { headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` } };
        const payload = { content: newMessage, chatId: id };
        setNewMessage('');
        const { data } = await axios.post(`${ENDPOINT}/api/message`, payload, config);
        socket.emit('new message', data);
        setMessages([...useStore.getState().messages, data]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getChatName = () => {
    if (!selectedChat) return 'Loading...';
    if (selectedChat.isGroupChat) return selectedChat.chatName;
    return selectedChat.users[0]?._id === user?._id ? selectedChat.users[1]?.name : selectedChat.users[0]?.name;
  };

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString([], options);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0c0c0d] font-sans relative">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/508/606/HD-wallpaper-whatsapp-dark-backgroun-background-dark-pattern.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen' }}
      ></div>

      <div className="flex items-center justify-between px-2 pt-14 pb-2 bg-[#1c1c1e]/90 backdrop-blur-md z-10 border-b border-[#2c2c2e]">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/chats')}>
          <ChevronLeft size={28} className="text-[#02c754]" strokeWidth={2} />
          <span className="text-[#02c754] text-[17px] font-medium mr-2">Back</span>
          <div className="relative w-[36px] h-[36px] rounded-full p-[1.5px] ring-[2px] ring-[#02c754]">
            <div className="w-full h-full rounded-full bg-[#00a884] flex items-center justify-center overflow-hidden">
               <img src={selectedChat?.isGroupChat ? 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg' : (selectedChat?.users[0]?._id === user?._id ? selectedChat?.users[1]?.pic : selectedChat?.users[0]?.pic) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-white text-[17px] font-semibold tracking-wide ml-2 line-clamp-1 max-w-[150px]" onClick={(e) => { e.stopPropagation(); navigate('/contact-info'); }}>{getChatName()}</span>
        </div>
        <div className="flex gap-5 mr-4">
          <Video size={24} className="text-[#02c754]" strokeWidth={2} />
          <Phone size={24} className="text-[#02c754]" strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar z-0 flex flex-col p-4 gap-2">
        {messages?.map((m, i) => {
          const isSender = m.sender._id === user._id;
          return (
            <div key={m._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} w-full`}>
              <div className={`relative px-3 py-2 max-w-[85%] ${isSender ? 'bg-[#005c4b] rounded-2xl rounded-tr-md' : 'bg-[#262628] rounded-2xl rounded-tl-md'}`}>
                <span className="text-white text-[16px] break-words">{m.content}</span>
                <span className="text-[#cfd4d6] text-[11px] float-right mt-2 ml-4 relative top-[2px]">{formatTime(m.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#1c1c1e]/95 backdrop-blur-md px-2 py-[10px] pb-8 flex items-end gap-3 z-10 w-full">
        <button className="text-[#02c754] mb-1"><Plus size={28} strokeWidth={2}/></button>
        <div className="flex-1 bg-[#2c2c2e] rounded-full flex items-center min-h-[36px] px-3 border border-[#3c3c3e]">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-white text-[17px] py-1"
            value={newMessage}
            onKeyDown={sendMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Smile size={22} className="text-[#8e8e93]" />
        </div>
        <div className="flex gap-4 items-center mb-1 text-[#02c754]">
          {newMessage.trim() === '' ? (
            <>
              <IndianRupee size={24} strokeWidth={2} />
              <Camera size={24} strokeWidth={2} />
              <Mic size={24} strokeWidth={2} />
            </>
          ) : (
            <button onClick={(e) => sendMessage({ type: 'click', preventDefault: () => {} })} className="text-[17px] font-semibold ml-2">Send</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindowPage;
