import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Camera, Plus, Search, Archive, X, User as UserIcon } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ChatsListPage = () => {
  const { user, chats, setChats, setSelectedChat } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  // Modal State
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  // Generic Button Handlers
  const handleAlert = (msg) => alert(msg);

  // New Chat Handlers
  const handleUserSearch = async (query) => {
    setUserSearch(query);
    if (!query) return setSearchResults([]);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${ENDPOINT}/api/user?search=${query}`, config);
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = { headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${ENDPOINT}/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setShowNewChat(false);
      navigate(`/chat/${data._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const filters = ['All', 'Unread', 'Favorites', 'Groups'];

  // Filter based on search input and pills
  let displayChats = chats;
  if (filter === 'Unread') displayChats = chats?.filter(c => c.unread > 0 || !c.latestMessage?.readBy?.includes(user._id));
  if (filter === 'Favorites') displayChats = [];
  if (filter === 'Groups') displayChats = chats?.filter(c => c.isGroupChat);
  
  if (search) {
    displayChats = displayChats?.filter(c => getChatName(user, c)?.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      
      {/* New Chat Modal Overlay */}
      {showNewChat && (
        <div className="fixed inset-0 z-[100] bg-black md:bg-black/80 flex items-start justify-center pt-10">
          <div className="bg-[#1c1c1e] w-full h-[90vh] md:w-[400px] md:rounded-xl overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-[#2c2c2e]">
              <h2 className="text-[17px] font-semibold text-white">New Chat</h2>
              <button onClick={() => setShowNewChat(false)} className="bg-[#2c2c2e] p-1.5 rounded-full text-[#8e8e93] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-black">
              <div className="bg-[#2c2c2e] rounded-xl flex items-center px-3 py-2">
                <Search size={20} className="text-[#8e8e93]" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search name or email"
                  className="bg-transparent border-none outline-none text-[16px] text-white ml-2 w-full"
                  value={userSearch}
                  onChange={(e) => handleUserSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {searchResults.map(resUser => (
                <div key={resUser._id} onClick={() => accessChat(resUser._id)} className="flex items-center gap-3 px-4 py-3 border-b border-[#2c2c2e] hover:bg-[#2c2c2e] cursor-pointer">
                  <div className="w-[45px] h-[45px] rounded-full overflow-hidden bg-gray-700">
                    <img src={resUser.pic} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-[16px]">{resUser.name}</h3>
                    <span className="text-[#8e8e93] text-[13px]">{resUser.email}</span>
                  </div>
                </div>
              ))}
              {userSearch && searchResults.length === 0 && <div className="text-center text-[#8e8e93] mt-5">No users found.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Top Header Icons */}
      <div className="flex justify-between items-center px-4 pt-14 pb-1">
        <button onClick={() => handleAlert("Options clicked")} className="hover:bg-[#1c1c1e] p-1 rounded-full text-white">
          <MoreHorizontal size={28} />
        </button>
        <div className="flex gap-4">
          <button onClick={() => handleAlert("Camera clicked")} className="bg-[#1c1c1e] p-[8px] rounded-full hover:bg-[#2c2c2e]"><Camera size={20} className="text-white" /></button>
          <button onClick={() => setShowNewChat(true)} className="bg-[#02c754] p-[8px] rounded-full hover:bg-[#00a884]"><Plus size={20} className="text-black" strokeWidth={2.5}/></button>
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
              className={`px-4 py-[6px] rounded-full text-[15px] font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-[#005c4b] text-[#bfebd8]' : 'bg-[#1c1c1e] text-[#8e8e93] hover:bg-[#2c2c2e]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Archived Row */}
        <div onClick={() => handleAlert("Opening Archived Chats View...")} className="flex items-center justify-between py-3 px-2 border-b border-[#2c2c2e] hover:bg-[#1c1c1e] cursor-pointer mb-2 transition-colors rounded-sm">
          <div className="flex items-center gap-4">
            <Archive size={22} className="text-[#8e8e93]" />
            <span className="text-[17px] font-medium text-white">Archived</span>
          </div>
          <span className="text-[15px] text-[#8e8e93]">0</span>
        </div>

        {/* Chats List */}
        <div className="flex flex-col pb-24">
          {displayChats && displayChats.length > 0 ? displayChats.map((chat) => (
            <div 
              key={chat._id} 
              className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[#1c1c1e] transition-colors rounded-md -mx-2 px-2"
              onClick={() => openChat(chat)}
            >
              <div className="relative w-[56px] h-[56px] rounded-full p-[2px]">
                <img 
                  src={getChatPic(user, chat) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} 
                  alt="" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              
              <div className="flex-1 border-b border-[#2c2c2e] pb-3 ml-1">
                <div className="flex justify-between items-center mb-[2px]">
                  <h3 className="text-white font-semibold text-[17px] line-clamp-1 pr-4">{getChatName(user, chat)}</h3>
                  <span className={`text-[14px] flex-shrink-0 text-[#8e8e93]`}>
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pr-2">
                  <p className="text-[#8e8e93] text-[15px] line-clamp-1">{chat.latestMessage ? chat.latestMessage.content : 'No messages yet'}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-[#8e8e93] py-10">No recent chats completely.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsListPage;
