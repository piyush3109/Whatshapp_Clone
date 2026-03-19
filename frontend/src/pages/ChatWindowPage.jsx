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
  const { user, selectedChat, messages, setMessages } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    return () => socket.disconnect();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#0c0c0d] font-sans relative">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/508/606/HD-wallpaper-whatsapp-dark-backgroun-background-dark-pattern.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen' }}
      ></div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-14 pb-2 bg-[#1c1c1e]/90 backdrop-blur-md z-10 border-b border-[#2c2c2e]">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/chats')}>
          <ChevronLeft size={28} className="text-[#02c754]" strokeWidth={2} />
          <span className="text-[#02c754] text-[17px] font-medium mr-2">110</span>
          
          <div className="relative w-[36px] h-[36px] rounded-full p-[1.5px] ring-[2px] ring-[#02c754]">
            <div className="w-full h-full rounded-full bg-[#00a884] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-[20px] h-[20px]"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
          </div>
          <span className="text-white text-[17px] font-semibold tracking-wide ml-2" onClick={(e) => { e.stopPropagation(); navigate('/contact-info'); }}>Krishna Beta</span>
        </div>
        
        <div className="flex gap-5 mr-4">
          <Video size={24} className="text-[#02c754]" strokeWidth={2} />
          <Phone size={24} className="text-[#02c754]" strokeWidth={2} />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar z-0 flex flex-col p-4 gap-2">
        <div className="flex justify-center mb-2">
          <span className="bg-[#1c1c1e] text-[#8e8e93] text-[13px] font-medium px-4 py-1 rounded-full">
            Sunday
          </span>
        </div>

        {/* Dummy Messages to exactly match image 2 layout */}
        <div className="flex flex-col gap-1 items-start w-full max-w-[85%]">
          
          <div className="bg-[#262628] rounded-2xl rounded-tl-md px-3 py-2 relative">
            <span className="text-white text-[16px]">Hello</span>
            <span className="text-[#8e8e93] text-[11px] float-right mt-2 ml-4">9:48 AM</span>
          </div>

          <div className="bg-[#262628] rounded-2xl rounded-tl-md p-3 relative flex items-center gap-4 w-[240px] mt-1">
            <div className="w-10 h-10 rounded-full bg-[#3c3c3e] flex items-center justify-center">
              <Phone size={20} className="text-[#ff3b30]" fill="transparent" />
              <div className="absolute ml-5 mb-5 w-4 h-4 rounded-full bg-[#262628] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="#ff3b30"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg></div>
            </div>
            <div>
              <p className="text-white text-[16px] font-medium">Missed voice call</p>
              <p className="text-[#8e8e93] text-[14px]">Tap to call back</p>
            </div>
            <span className="absolute bottom-2 right-3 text-[#8e8e93] text-[11px]">10:27 AM</span>
          </div>

          <div className="bg-[#262628] rounded-2xl px-3 py-2 relative mt-1">
            <span className="text-white text-[16px]">Bhaj Raha hai</span>
            <span className="text-[#8e8e93] text-[11px] float-right mt-2 ml-4">10:27 AM</span>
          </div>
          
          <div className="bg-[#262628] rounded-2xl rounded-bl-md p-3 relative flex items-center gap-4 w-[240px] mt-1">
            <div className="w-10 h-10 rounded-full bg-[#3c3c3e] flex items-center justify-center">
              <Phone size={20} className="text-[#ff3b30]" fill="transparent" />
              <div className="absolute ml-5 mb-5 w-4 h-4 rounded-full bg-[#262628] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="#ff3b30"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg></div>
            </div>
            <div>
              <p className="text-white text-[16px] font-medium">Missed voice call</p>
              <p className="text-[#8e8e93] text-[14px]">Tap to call back</p>
            </div>
            <span className="absolute bottom-2 right-3 text-[#8e8e93] text-[11px]">3:09 PM</span>
          </div>

        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bottom Bar */}
      <div className="bg-[#1c1c1e]/95 backdrop-blur-md px-2 py-[10px] pb-8 flex items-end gap-3 z-10 w-full">
        <button className="text-[#02c754] mb-1">
          <Plus size={28} strokeWidth={2}/>
        </button>
        
        <div className="flex-1 bg-[#2c2c2e] rounded-full flex items-center min-h-[36px] px-3 border border-[#3c3c3e]">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-white text-[17px] py-1"
            value={newMessage}
            autoFocus
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Smile size={22} className="text-[#8e8e93]" />
        </div>
        
        <div className="flex gap-4 items-center mb-1 text-[#02c754]">
          <IndianRupee size={24} strokeWidth={2} />
          <Camera size={24} strokeWidth={2} />
          <Mic size={24} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindowPage;
