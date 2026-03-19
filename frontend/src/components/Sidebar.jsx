import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';
import { Search, Plus, MoreVertical, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, logout } = useStore();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchChats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5001/api/chat', config);
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`http://localhost:5001/api/user?search=${query}`, config);
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5001/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setSearch('');
      setSearchResults([]);
    } catch (error) {
      console.error(error);
    }
  };

  const getChatName = (loggedUser, chat) => {
    if (chat.isGroupChat) return chat.chatName;
    return chat.users[0]._id === loggedUser._id ? chat.users[1].name : chat.users[0].name;
  };
  
  const getChatPic = (loggedUser, chat) => {
    if (chat.isGroupChat) return 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg';
    return chat.users[0]._id === loggedUser._id ? chat.users[1].pic : chat.users[0].pic;
  };

  const createGroupChat = async () => {
    if (!groupName || selectedUsers.length < 2) return alert('Please enter name and at least 2 users');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        'http://localhost:5001/api/chat/group',
        { name: groupName, users: JSON.stringify(selectedUsers.map((u) => u._id)) },
        config
      );
      setChats([data, ...chats]);
      setShowModal(false);
      setGroupName('');
      setSelectedUsers([]);
      alert('Group Created!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={user.pic} alt={user.name} className="avatar" />
        <div style={{ display: 'flex', gap: '15px' }}>
          <Plus style={{ cursor: 'pointer', color: '#aebac1' }} onClick={() => setShowModal(true)} />
          <LogOut style={{ cursor: 'pointer', color: '#aebac1' }} onClick={logout} />
        </div>
      </div>
      <div className="search-bar">
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#202c33', borderRadius: '8px', padding: '0 10px' }}>
          <Search size={18} color="#8696a0" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="search-input"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="chat-list">
        {searchResults.length > 0 ? (
          searchResults.map((searchUser) => (
            <div key={searchUser._id} className="chat-item" onClick={() => accessChat(searchUser._id)}>
              <img src={searchUser.pic} alt="" className="avatar" />
              <div className="chat-info">
                <h3>{searchUser.name}</h3>
                <p>{searchUser.email}</p>
              </div>
            </div>
          ))
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <img src={getChatPic(user, chat)} alt="" className="avatar" />
              <div className="chat-info">
                <h3>{getChatName(user, chat)}</h3>
                {chat.latestMessage && (
                  <p>
                    {chat.latestMessage.sender._id === user._id ? 'You: ' : ''}
                    {chat.latestMessage.content}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={() => setShowModal(false)}>✖</span>
            <h2 style={{ marginBottom: '20px', color: '#e9edef' }}>Create Group Chat</h2>
            <input
              type="text"
              placeholder="Group Name"
              className="input-field"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add Users (e.g. John, Piyush)"
              className="input-field"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
              {selectedUsers.map((u) => (
                <span key={u._id} style={{ background: '#005c4b', padding: '5px 10px', borderRadius: '15px', fontSize: '13px' }}>
                  {u.name} <span style={{ cursor: 'pointer' }} onClick={() => setSelectedUsers(selectedUsers.filter(sel => sel._id !== u._id))}>x</span>
                </span>
              ))}
            </div>
            {loading ? <div style={{ color: '#8696a0' }}>Loading...</div> : (
              searchResults?.slice(0, 4).map((searchUser) => (
                <div key={searchUser._id} className="user-search-result" onClick={() => {
                  if(!selectedUsers.includes(searchUser)) setSelectedUsers([...selectedUsers, searchUser])
                }}>
                  <img src={searchUser.pic} alt="" className="avatar" style={{width: '30px', height: '30px'}} />
                  <span>{searchUser.name}</span>
                </div>
              ))
            )}
            <button className="btn" style={{ marginTop: '15px' }} onClick={createGroupChat}>Create Group</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
