import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import MobileLayout from './components/MobileLayout';
import YouPage from './pages/YouPage';
import UpdatesPage from './pages/UpdatesPage';
import ContactDetailsPage from './pages/ContactDetailsPage';
import PlaceholderPage from './pages/PlaceholderPage';

import ChatsListPage from './pages/ChatsListPage';
import ChatWindowPage from './pages/ChatWindowPage';
import ContactInfoPage from './pages/ContactInfoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        {/* Main nested Mobile iOS Layout */}
        <Route element={<MobileLayout />}>
          <Route path="/chats" element={<ChatsListPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/you" element={<YouPage />} />
          
          {/* Fallbacks for currently empty tabs */}
          <Route path="/calls" element={<div className="flex bg-black text-white h-full items-center justify-center">Calls under construction...</div>} />
          <Route path="/communities" element={<div className="flex bg-black text-white h-full items-center justify-center">Communities under construction...</div>} />
        </Route>
        
        {/* Detail views (no bottom bar) nested generic apps natively */}
        <Route path="/chat/:id" element={<ChatWindowPage />} />
        <Route path="/contact-details" element={<ContactDetailsPage />} />
        <Route path="/contact-info" element={<ContactInfoPage />} />
        
        <Route path="/settings/:id" element={<PlaceholderPage />} />
        <Route path="/status/:id" element={<PlaceholderPage />} />
        <Route path="/archived" element={<PlaceholderPage />} />
        <Route path="/camera" element={<PlaceholderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
