import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, IndianRupee, Smile, Image as ImageIcon, FileText, MapPin, UserSquare2, Headphones } from 'lucide-react';
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
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
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
    if (socketConnected && socket) socket.on('message recieved', messageHandler);
    return () => {
      if (socket) socket.off('message recieved', messageHandler);
    };
  }, [id, socketConnected]); // Essential fix: Socket triggers now bind exclusively after initialization

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e, customPayload = null) => {
    if ((e && e.key === 'Enter') || (e && e.type === 'click') || customPayload) {
      if (e && e.type === 'keydown') e.preventDefault();
      if (!newMessage.trim() && !customPayload) return;
      
      setShowAttachMenu(false);
      
      try {
        const config = { headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` } };
        const payload = customPayload || { content: newMessage, chatId: id, type: 'text' };
        setNewMessage('');
        const { data } = await axios.post(`${ENDPOINT}/api/message`, payload, config);
        socket.emit('new message', data);
        setMessages([...useStore.getState().messages, data]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMediaUpload = (file) => {
    setUploadingMedia(true);
    setShowAttachMenu(false);
    if (!file) {
      setUploadingMedia(false);
      return;
    }
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'piyush'); 
      fetch('https://api.cloudinary.com/v1_1/piyush/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            sendMessage(null, { content: '📷 Photo', fileUrl: data.url, type: 'image', chatId: id });
          }
          setUploadingMedia(false);
        })
        .catch((err) => {
          console.error(err);
          setUploadingMedia(false);
        });
    } else {
      alert('Please Select a valid Image!');
      setUploadingMedia(false);
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
    <div className="flex flex-col h-screen bg-[#0c0c0d] font-sans relative w-full">
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
        <div className="flex gap-5 mr-4 cursor-pointer">
          <Video size={24} className="text-[#02c754]" strokeWidth={2} />
          <Phone size={24} className="text-[#02c754]" strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar z-0 flex flex-col p-4 gap-2 pb-24" onClick={() => setShowAttachMenu(false)}>
        {messages?.map((m, i) => {
          const isSender = m.sender._id === user._id;
          return (
            <div key={m._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} w-full`}>
              <div className={`relative px-[10px] pt-[6px] pb-[4px] min-w-[80px] max-w-[85%] md:max-w-[75%] lg:max-w-[65%] flex flex-col shadow-sm ${isSender ? 'bg-[#005c4b] rounded-2xl rounded-tr-sm' : 'bg-[#262628] rounded-2xl rounded-tl-sm'}`}>
                {m.type === 'image' && m.fileUrl && (
                  <img src={m.fileUrl} alt="Media" className="w-[220px] max-w-full h-auto object-cover rounded-xl mb-1 mt-1 cursor-pointer" />
                )}
                <div className="flex flex-wrap items-end justify-between gap-x-4">
                  {m.content && m.content !== '📷 Photo' && (
                    <span className="text-[#e9edef] text-[15.5px] leading-[1.3] break-words whitespace-pre-wrap mt-0 mb-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {m.content}
                    </span>
                  )}
                  {/* Pushes the time strictly to the bottom right corner natively */}
                  <span className="text-[#8696a0] text-[10.5px] font-medium leading-[15px] whitespace-nowrap float-right ml-auto mt-auto relative top-[2px]">
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {uploadingMedia && (
          <div className="flex justify-end w-full">
            <div className="relative px-3 py-2 max-w-[85%] bg-[#005c4b] rounded-2xl rounded-tr-md opacity-70">
              <span className="text-white text-[15px] italic">Sending media...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showAttachMenu && (
        <div className="absolute bottom-[90px] left-2 bg-[#2c2c2e] p-4 rounded-3xl grid grid-cols-3 gap-6 shadow-2xl z-20 w-[90%] max-w-[320px] mx-auto opacity-100 transition-opacity ease-out transform pointer-events-auto border border-[#3c3c3e]">
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-[50px] h-[50px] bg-[#5a66d1] rounded-full flex items-center justify-center shadow-lg"><FileText size={24} className="text-white" /></div><span className="text-white text-[12px] font-medium">Document</span>
          </div>
          <div onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-[50px] h-[50px] bg-[#b14777] rounded-full flex items-center justify-center shadow-lg"><Camera size={24} className="text-white" /></div><span className="text-white text-[12px] font-medium">Camera</span>
          </div>
          <div onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-[50px] h-[50px] bg-[#9a51d1] rounded-full flex items-center justify-center shadow-lg"><ImageIcon size={24} className="text-white" /></div><span className="text-white text-[12px] font-medium">Gallery</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
             <div className="w-[50px] h-[50px] bg-[#e65a39] rounded-full flex items-center justify-center shadow-lg"><Headphones size={24} className="text-white" /></div><span className="text-white text-[12px] font-medium">Audio</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
             <div className="w-[50px] h-[50px] bg-[#229955] rounded-full flex items-center justify-center shadow-lg"><MapPin size={24} className="text-white" /></div><span className="text-white text-[12px] font-medium">Location</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
             <div className="w-[50px] h-[50px] bg-[#4999d3] rounded-full flex items-center justify-center shadow-lg"><UserSquare2 size={24} className="text-white" /></div><span className="text-white text-[12px] font-medium">Contact</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 bg-[#1c1c1e]/95 backdrop-blur-md px-2 py-[10px] pb-8 flex items-end gap-3 z-10 w-full border-t border-[#2c2c2e]">
        <button onClick={() => setShowAttachMenu(!showAttachMenu)} className={`mb-1 transition-transform ${showAttachMenu ? 'rotate-45 text-[#8e8e93]' : 'text-[#02c754]'}`}>
          <Plus size={28} strokeWidth={2.5}/>
        </button>
        <div className="flex-1 bg-[#2c2c2e] rounded-full flex items-center min-h-[36px] px-3 border border-[#3c3c3e]">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-white text-[17px] py-1"
            value={newMessage}
            onKeyDown={sendMessage}
            placeholder={uploadingMedia ? "Uploading..." : ""}
            disabled={uploadingMedia}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Smile size={22} className="text-[#8e8e93]" />
        </div>
        <div className="flex gap-4 items-center mb-1 text-[#02c754]">
          {newMessage.trim() === '' ? (
            <>
              <IndianRupee size={24} strokeWidth={2} className="cursor-pointer" />
              <div className="relative cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <Camera size={24} strokeWidth={2} />
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleMediaUpload(e.target.files[0])} />
              </div>
              <Mic size={24} strokeWidth={2} className="cursor-pointer" />
            </>
          ) : (
            <button onClick={(e) => sendMessage({ type: 'click', preventDefault: () => {} })} className="text-[17px] font-semibold ml-2 border-none">Send</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindowPage;
