import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Camera, Plus, Search, Archive } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ChatsListPage = () => {
  const { user, chats, setChats, setSelectedChat } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${ENDPOINT}/api/chat`, config);
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  const getChatName = (loggedUser, chat) => {
    if (chat.isGroupChat) return chat.chatName;
    return chat.users[0]?._id === loggedUser?._id ? chat.users[1]?.name : chat.users[0]?.name;
  };

  const getChatPic = (loggedUser, chat) => {
    if (chat.isGroupChat) return 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg';
    return chat.users[0]?._id === loggedUser?._id ? chat.users[1]?.pic : chat.users[0]?.pic;
  };

  const openChat = (chat) => {
    setSelectedChat(chat);
    navigate(`/chat/${chat._id}`);
  };

  const filters = ['All', 'Unread 110', 'Favorites', 'Groups 23'];

  // Dummy chats to make it look exactly like image 1
  const dummyChats = [
    { _id: '1', name: 'Sarvesh Pandey 5', time: '8:40 AM', unread: 1, message: '📷 Photo', pic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', greenRing: true },
    { _id: '2', name: '3B("Java Training")', time: 'Yesterday', unread: 2, message: '~Ayush Tripathi: https://forms.gle/...', pic: 'https://cdn-icons-png.flaticon.com/512/226/226777.png' },
    { _id: '3', name: 'Rudra Tripathi Uturi', time: 'Yesterday', unread: 0, message: '📷 Photo', pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' },
    { _id: '4', name: 'LIC RAJ KUMAR', time: 'Yesterday', unread: 8, message: 'Raj: 📷 Photo', pic: 'https://cdn-icons-png.flaticon.com/512/4744/4744315.png' },
    { _id: '5', name: '+91 99195 45783', time: 'Yesterday', unread: 0, message: 'सब महादेव मय है सब महादेव में है 🙏', pic: 'https://images.unsplash.com/photo-1542044896530-05d3c054e274' },
    { _id: '6', name: 'Headphone Zone', time: 'Yesterday', unread: 0, message: 'Hi Krishna, We have your order...', pic: 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg', blueRing: true },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Top Header Icons */}
      <div className="flex justify-between items-center px-4 pt-14 pb-1">
        <MoreHorizontal size={28} className="text-white" />
        <div className="flex gap-4">
          <button className="bg-[#1c1c1e] p-[8px] rounded-full"><Camera size={20} className="text-white" /></button>
          <button className="bg-[#02c754] p-[8px] rounded-full"><Plus size={20} className="text-black" strokeWidth={2.5}/></button>
        </div>
      </div>

      <div className="px-4">
        {/* Chats Title */}
        <h1 className="text-[34px] font-bold mt-1 mb-2 tracking-tight">Chats</h1>

        {/* Search Bar */}
        <div className="bg-[#1c1c1e] rounded-xl flex items-center px-3 py-2 mb-4">
          <Search size={20} className="text-[#8e8e93]" />
          <input 
            type="text" 
            placeholder="Ask Meta AI or Search"
            className="bg-transparent border-none outline-none text-[17px] text-white ml-2 w-full placeholder-[#8e8e93]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-[6px] rounded-full text-[15px] font-medium whitespace-nowrap ${
                filter === f ? 'bg-[#005c4b] text-[#bfebd8]' : 'bg-[#1c1c1e] text-[#8e8e93]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Archived Row */}
        <div className="flex items-center justify-between py-3 px-2 border-b border-[#2c2c2e] cursor-pointer mb-2">
          <div className="flex items-center gap-4">
            <Archive size={22} className="text-[#8e8e93]" />
            <span className="text-[17px] font-medium text-white">Archived</span>
          </div>
          <span className="text-[15px] text-[#8e8e93]">37</span>
        </div>

        {/* Chats List */}
        <div className="flex flex-col">
          {(search ? chats : dummyChats).map((chat) => (
            <div 
              key={chat._id} 
              className="flex items-center gap-3 py-2 cursor-pointer"
              onClick={() => openChat(chat)}
            >
              <div className={`relative w-[56px] h-[56px] rounded-full p-[2px] 
                ${chat.greenRing ? 'ring-[2.5px] ring-[#02c754]' : ''} 
                ${chat.blueRing ? 'ring-[2.5px] ring-[#3b82f6]' : ''}`}>
                <img 
                  src={chat.pic || getChatPic(user, chat)} 
                  alt="" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              
              <div className="flex-1 border-b border-[#2c2c2e] pb-3 ml-1">
                <div className="flex justify-between items-center mb-[2px]">
                  <h3 className="text-white font-semibold text-[17px]">{chat.name || getChatName(user, chat)}</h3>
                  <span className={`text-[14px] ${chat.unread > 0 ? 'text-[#02c754]' : 'text-[#8e8e93]'}`}>
                    {chat.time || "Yesterday"}
                  </span>
                </div>
                <div className="flex justify-between items-center pr-2">
                  <p className="text-[#8e8e93] text-[15px] line-clamp-1">{chat.message || (chat.latestMessage ? chat.latestMessage.content : '')}</p>
                  {chat.unread > 0 && (
                    <div className="bg-[#02c754] text-black text-[13px] font-semibold flex items-center justify-center w-[20px] h-[20px] rounded-full">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatsListPage;
