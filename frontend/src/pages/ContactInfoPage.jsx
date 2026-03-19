import React from 'react';
import { ChevronLeft, Phone, Video, IndianRupee, Search, Image as ImageIcon, HardDrive, Star, Bell, Palette, Download, Clock, Lock, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';

const ActionButton = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center justify-center bg-[#1c1c1e] rounded-xl w-[72px] h-[72px] gap-1 cursor-pointer">
    <Icon size={24} className="text-[#02c754]" strokeWidth={2} />
    <span className="text-[#e9edef] text-[12px]">{label}</span>
  </div>
);

const ListItem = ({ icon: Icon, title, rightText, noBorder, isToggle }) => (
  <div className={`flex items-center justify-between px-4 py-3 bg-[#1c1c1e] cursor-pointer ${!noBorder && 'border-b border-[#2c2c2e]'}`}>
    <div className="flex items-center gap-4 text-white">
      <Icon size={22} className="text-[#8e8e93]" strokeWidth={1.5} />
      <span className="text-[17px] tracking-wide">{title}</span>
    </div>
    <div className="flex items-center gap-1">
      {rightText && <span className="text-[#8e8e93] text-[16px]">{rightText}</span>}
      {isToggle ? (
        <div className="w-12 h-7 bg-[#02c754] rounded-full p-[2px] flex justify-end">
          <div className="w-[24px] h-[24px] bg-white rounded-full shadow-sm"></div>
        </div>
      ) : (
        <ChevronLeft size={20} className="text-[#8e8e93] transform rotate-180" />
      )}
    </div>
  </div>
);

const ContactInfoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { chats, user } = useStore();
  
  const selectedChat = chats?.find(c => c._id === id);

  const getChatName = () => {
    if (!selectedChat) return 'Loading...';
    if (selectedChat.isGroupChat) return selectedChat.chatName;
    return selectedChat.users[0]?._id === user?._id ? selectedChat.users[1]?.name : selectedChat.users[0]?.name;
  };
  
  const getChatEmail = () => {
    if (!selectedChat) return '';
    if (selectedChat.isGroupChat) return `Group · ${selectedChat.users.length} participants`;
    return selectedChat.users[0]?._id === user?._id ? selectedChat.users[1]?.email : selectedChat.users[0]?.email;
  };
  
  const getChatAvatar = () => {
    if (!selectedChat) return 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
    if (selectedChat.isGroupChat) return 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg';
    return selectedChat.users[0]?._id === user?._id ? selectedChat.users[1]?.pic : selectedChat.users[0]?.pic;
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-10">
      {/* Header */}
      <div className="flex justify-between items-center px-2 pt-12 pb-4 bg-[#0c0c0d]/90 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#e9edef]">
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-semibold tracking-wide">{selectedChat?.isGroupChat ? 'Group info' : 'Contact info'}</span>
        <button className="text-[#e9edef] text-[17px] font-medium mr-2">Edit</button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-[#2c2c2e]">
          <img src={getChatAvatar()} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-[24px] font-bold text-center px-4">{getChatName()}</h1>
        <p className="text-[#8e8e93] text-[15px] mt-1 text-center px-4">{getChatEmail()}</p>
      </div>

      <div className="px-4 mt-6">
        {/* Action Buttons */}
        <div className="flex justify-between gap-2 mb-6">
          <ActionButton icon={Phone} label="Audio" />
          <ActionButton icon={Video} label="Video" />
          <ActionButton icon={IndianRupee} label="Pay" />
          <ActionButton icon={Search} label="Search" />
        </div>

        {/* Section 1 */}
        <div className="rounded-xl overflow-hidden mb-6">
          <ListItem icon={ImageIcon} title="Media, links and docs" rightText="12" />
          <ListItem icon={HardDrive} title="Manage storage" rightText="21 MB" />
          <ListItem icon={Star} title="Starred" rightText="None" noBorder />
        </div>

        {/* Section 2 */}
        <div className="rounded-xl overflow-hidden mb-6">
          <ListItem icon={Bell} title="Notifications" />
          <ListItem icon={Palette} title="Chat theme" />
          <ListItem icon={Download} title="Save to Photos" rightText="Default" noBorder />
        </div>

        {/* Section 3 */}
        <div className="rounded-xl overflow-hidden mb-6">
          <ListItem icon={Clock} title="Disappearing messages" rightText="Off" />
          <div className="flex items-center justify-between px-4 py-3 bg-[#1c1c1e] cursor-pointer border-b border-[#2c2c2e]">
            <div className="flex items-start gap-4 text-white">
              <Lock size={22} className="text-[#8e8e93] mt-1" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[17px] tracking-wide">Lock chat</span>
                <span className="text-[13px] text-[#8e8e93]">Lock and hide this chat on this device.</span>
              </div>
            </div>
            <div className="w-[48px] h-[28px] bg-[#3c3c3e] rounded-full p-[2px] flex justify-start flex-shrink-0">
              <div className="w-[24px] h-[24px] bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <ListItem icon={Shield} title="Advanced chat privacy" rightText="Off" noBorder />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoPage;
