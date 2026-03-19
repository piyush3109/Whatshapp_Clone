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
  const [replyMessage, setReplyMessage] = useState(null);
  const [reactionMenu, setReactionMenu] = useState(null); // Message ID
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const selectedChat = chats?.find(c => c._id === id);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Upload to Cloudinary as voice note
        uploadMedia(blob, 'voice');
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const uploadMedia = (file, type = 'image') => {
    setUploadingMedia(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'chat-app');
    data.append('cloud_name', 'piyush'); 
    
    fetch('https://api.cloudinary.com/v1_1/piyush/upload', { // Cloudinary generic upload endpoint
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          const content = type === 'image' ? '📷 Photo' : '🎤 Voice Note';
          sendMessage(null, { content, fileUrl: data.url, type: type === 'voice' ? 'audio' : 'image', chatId: id });
        }
        setUploadingMedia(false);
      })
      .catch((err) => {
        console.error(err);
        setUploadingMedia(false);
      });
  };

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const sendMessage = async (e, customPayload = null) => {
    if ((e && e.key === 'Enter') || (e && e.type === 'click') || customPayload) {
      if (e && e.type === 'keydown') e.preventDefault();
      if (!newMessage.trim() && !customPayload) return;
      
      setShowAttachMenu(false);
      
      try {
        const config = { headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` } };
        const payload = customPayload || { 
          content: newMessage, 
          chatId: id, 
          type: 'text',
          replyTo: replyMessage?._id || null 
        };
        setNewMessage('');
        setReplyMessage(null);
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

  const handleForward = async (message) => {
    const targetChatName = prompt("Enter Chat Name to forward to (Group or User Name):");
    if (!targetChatName) return;
    
    const targetChat = chats.find(c => (c.isGroupChat ? c.chatName : (c.users[0]?.name === targetChatName || c.users[1]?.name === targetChatName)));
    
    if (targetChat) {
      const payload = { 
        content: message.type === 'text' ? `${message.content} (Forwarded)` : message.content, 
        chatId: targetChat._id, 
        type: message.type,
        fileUrl: message.fileUrl || '' 
      };
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post(`${ENDPOINT}/api/message`, payload, config);
        alert(`Forwarded to ${targetChatName}`);
        setReactionMenu(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Chat not found!");
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0c0c0d] font-sans relative w-full overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/508/606/HD-wallpaper-whatsapp-dark-backgroun-background-dark-pattern.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen' }}
      ></div>

      <div className="flex items-center justify-between px-2 py-3 bg-[#1c1c1e]/90 backdrop-blur-md z-10 border-b border-[#2c2c2e]">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/chats')}>
          <ChevronLeft size={28} className="text-[#02c754]" strokeWidth={2} />
          <div className="relative w-[38px] h-[38px] rounded-full p-[1.5px] ring-[2px] ring-[#02c754]">
            <div className="w-full h-full rounded-full bg-[#00a884] flex items-center justify-center overflow-hidden">
               <img src={selectedChat?.isGroupChat ? 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg' : (selectedChat?.users[0]?._id === user?._id ? selectedChat?.users[1]?.pic : selectedChat?.users[0]?.pic) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col ml-2 overflow-hidden" onClick={(e) => { e.stopPropagation(); navigate('/contact-info/' + id); }}>
            <span className="text-white text-[16px] font-semibold tracking-wide line-clamp-1 max-w-[150px] leading-tight">{getChatName()}</span>
            <span className="text-[#02c754] text-[11px] leading-tight animate-pulse">{selectedChat?.users?.some(u => u._id !== user._id && u.isOnline) ? 'online' : ''}</span>
          </div>
        </div>
        <div className="flex gap-5 mr-4 cursor-pointer">
          <Video size={24} className="text-[#02c754]" strokeWidth={2} />
          <Phone size={24} className="text-[#02c754]" strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col p-4 gap-2">
        {messages?.map((m, i) => {
          const isSender = m.sender._id === user._id;
          return (
            <div key={m._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} w-full group relative mb-1`}>
              <div 
                onContextMenu={(e) => { e.preventDefault(); setReactionMenu(m._id); }}
                className={`relative px-[10px] pt-[6px] pb-[4px] min-w-[100px] max-w-[85%] flex flex-col shadow-sm ${isSender ? 'bg-[#005c4b] rounded-2xl rounded-tr-sm' : 'bg-[#262628] rounded-2xl rounded-tl-sm'}`}
              >
                {/* Reply Context */}
                {m.replyTo && (
                  <div className={`mb-2 p-2 rounded-lg border-l-4 border-[#02c754] bg-black/20 text-[13px] line-clamp-2`}>
                    <p className="font-bold text-[#02c754] text-[12px] mb-0.5">{m.replyTo.sender === user._id ? 'You' : 'Contact'}</p>
                    <p className="text-[#8e8e93]">{m.replyTo.content}</p>
                  </div>
                )}

                {/* Media Content */}
                {m.type === 'image' && m.fileUrl && (
                  <img src={m.fileUrl} alt="Media" className="w-[240px] max-w-full h-auto object-cover rounded-xl mb-1 mt-1 cursor-pointer" />
                )}
                {m.type === 'audio' && m.fileUrl && (
                  <div className="flex items-center gap-2 py-2 px-1 w-[240px] max-w-full">
                    <div className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center shrink-0">
                      <Mic size={20} className="text-[#02c754]" />
                    </div>
                    <audio src={m.fileUrl} controls className="h-8 flex-1 grayscale invert opacity-70" />
                  </div>
                )}

                {/* Text Content */}
                <div className="flex flex-wrap items-end justify-between gap-x-4">
                  {m.content && m.content !== '📷 Photo' && m.content !== '🎤 Voice Note' && (
                    <span className="text-[#e9edef] text-[15.5px] leading-[1.3] break-words whitespace-pre-wrap mt-0 mb-1 flex-1 min-w-0">
                      {m.content}
                    </span>
                  )}
                  <span className="text-[#8696a0] text-[10.5px] font-medium leading-[15px] whitespace-nowrap ml-auto mt-auto relative top-[2px]">
                    {formatTime(m.createdAt)}
                  </span>
                </div>

                {/* Reactions UI */}
                {m.reactions?.length > 0 && (
                  <div className="absolute -bottom-2 -left-1 flex bg-[#1c1c1e] border border-[#2c2c2e] rounded-full px-1 py-0.5 shadow-md">
                    {Array.from(new Set(m.reactions.map(r => r.emoji))).map(emoji => (
                      <span key={emoji} className="text-[12px] mx-0.5">{emoji}</span>
                    ))}
                    <span className="text-[10px] text-[#8e8e93] ml-1 self-center pr-1">{m.reactions.length}</span>
                  </div>
                )}

                {/* Reaction Picker Overlay */}
                {reactionMenu === m._id && (
                  <div className="absolute -top-12 left-0 flex bg-[#2c2c2e] rounded-full p-1.5 gap-2 shadow-2xl z-50 border border-[#3c3c3e]">
                    {['❤️', '😂', '😮', '😢', '👍', '🙏'].map(emoji => (
                      <button key={emoji} onClick={() => handleReaction(m._id, emoji)} className="text-xl hover:scale-125 transition-transform">{emoji}</button>
                    ))}
                    <button onClick={() => setReplyMessage(m) || setReactionMenu(null)} className="bg-[#3c3c3e] rounded-full px-3 text-[12px] font-bold text-white hover:bg-[#4c4c4e]">Reply</button>
                    <button onClick={() => handleForward(m)} className="bg-[#3c3c3e] rounded-full px-3 text-[12px] font-bold text-white hover:bg-[#4c4c4e]">Forward</button>
                    <button onClick={() => setReactionMenu(null)} className="text-white ml-1">✕</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {uploadingMedia && (
          <div className="flex justify-end w-full">
            <div className="px-3 py-2 bg-[#005c4b] rounded-2xl opacity-70 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-white text-[13px]">Sharing media...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showAttachMenu && (
        <div className="absolute bottom-[90px] left-2 bg-[#2c2c2e] p-4 rounded-3xl grid grid-cols-3 gap-6 shadow-2xl z-20 w-[90%] max-w-[320px] mx-auto border border-[#3c3c3e]">
          {[
            { icon: FileText, label: 'Document', color: '#5a66d1' },
            { icon: Camera, label: 'Camera', color: '#b14777', click: () => fileInputRef.current.click() },
            { icon: ImageIcon, label: 'Gallery', color: '#9a51d1', click: () => fileInputRef.current.click() },
            { icon: Headphones, label: 'Audio', color: '#e65a39' },
            { icon: MapPin, label: 'Location', color: '#229955' },
            { icon: UserSquare2, label: 'Contact', color: '#4999d3' },
          ].map((item, idx) => (
            <div key={idx} onClick={item.click} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: item.color }}>
                <item.icon size={24} className="text-white" />
              </div>
              <span className="text-white text-[12px] font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reply Preview Bar */}
      {replyMessage && (
        <div className="mx-2 mb-1 p-3 bg-[#1c1c1e] rounded-t-2xl border-l-4 border-[#02c754] flex justify-between items-start animate-slide-up">
          <div className="flex flex-col">
            <span className="text-[#02c754] text-[13px] font-bold">Replying to {replyMessage.sender._id === user._id ? 'yourself' : replyMessage.sender.name}</span>
            <span className="text-[#8e8e93] text-[14px] line-clamp-1">{replyMessage.content}</span>
          </div>
          <button onClick={() => setReplyMessage(null)} className="text-[#8e8e93]"><X size={20} /></button>
        </div>
      )}

      <div className="shrink-0 bg-[#1c1c1e]/95 backdrop-blur-md px-2 py-2 flex items-end gap-3 z-10 w-full border-t border-[#2c2c2e]">
        <button onClick={() => setShowAttachMenu(!showAttachMenu)} className={`mb-1 transition-transform shrink-0 ${showAttachMenu ? 'rotate-45 text-[#8e8e93]' : 'text-[#02c754]'}`}>
          <Plus size={28} strokeWidth={2.5}/>
        </button>
        <div className={`flex-1 min-w-0 bg-[#2c2c2e] ${replyMessage ? 'rounded-b-3xl' : 'rounded-3xl'} flex items-center px-3 border border-[#3c3c3e] transition-all`}>
          <input 
            type="text" 
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-[17px] py-1.5 leading-snug break-words"
            value={newMessage}
            onKeyDown={sendMessage}
            placeholder={uploadingMedia ? "Uploading..." : "Message"}
            disabled={uploadingMedia}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Smile size={22} className="text-[#8e8e93] shrink-0" />
        </div>
        <div className="flex gap-4 items-center mb-1 text-[#02c754] shrink-0">
          {newMessage.trim() === '' && !replyMessage ? (
            <>
              <IndianRupee size={24} strokeWidth={2} className="cursor-pointer" />
              <div className="relative cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <Camera size={24} strokeWidth={2} />
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => uploadMedia(e.target.files[0])} />
              </div>
              <div 
                onMouseDown={startRecording} onMouseUp={stopRecording}
                onTouchStart={startRecording} onTouchEnd={stopRecording}
                className={`cursor-pointer transition-all ${isRecording ? 'scale-150 animate-pulse text-red-500' : ''}`}
              >
                <Mic size={24} strokeWidth={2} />
              </div>
            </>
          ) : (
            <button onClick={(e) => sendMessage({ type: 'click', preventDefault: () => {} })} className="text-[17px] font-semibold ml-2 border-none shrink-0 bg-transparent py-0 h-auto">Send</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindowPage;
