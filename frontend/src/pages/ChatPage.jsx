import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="app-container">
      <Sidebar />
      <ChatBox />
    </div>
  );
};

export default ChatPage;
