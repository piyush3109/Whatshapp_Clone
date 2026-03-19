import React from 'react';
import { Search, QrCode, ChevronRight, UserCircle2, ListMinus, Megaphone, Star, Laptop, KeyRound, Lock, MessageCircle, Bell, CreditCard, ArrowDownUp, HelpCircle, UserPlus, Instagram, Facebook } from 'lucide-react';
import { useStore } from '../store';

const SettingItem = ({ icon: Icon, title, noBorder, onClick }) => (
  <div onClick={onClick} className={`flex items-center justify-between px-4 py-3 bg-[#1c1c1e] cursor-pointer hover:bg-[#2c2c2e] transition-colors ${!noBorder && 'border-b border-[#2c2c2e]'}`}>
    <div className="flex items-center gap-4">
      <Icon size={24} className="text-white font-light" strokeWidth={1.5} />
      <span className="text-white text-[17px] tracking-wide">{title}</span>
    </div>
    <ChevronRight size={20} className="text-[#8e8e93]" />
  </div>
);

const YouPage = () => {
  const { user } = useStore();

  const handleAlert = (feature) => {
    alert(`Navigating to: ${feature}`);
  };

  return (
    <div className="bg-black text-white min-h-screen pb-20 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-12 pb-2">
        <button onClick={() => handleAlert("Search")} className="bg-[#1c1c1e] p-2 rounded-full hover:bg-[#2c2c2e]">
          <Search size={20} className="text-white" />
        </button>
        <button onClick={() => handleAlert("QR Code")} className="bg-[#1c1c1e] p-2 rounded-full hover:bg-[#2c2c2e]">
          <QrCode size={20} className="text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mt-2 relative cursor-pointer" onClick={() => handleAlert("Profile Settings")}>
        <div className="absolute top-0 right-[35%] bg-[#1c1c1e] rounded-full px-4 py-1 text-sm text-[#8e8e93] border border-[#2c2c2e]">
          Add your About
          <div className="absolute w-3 h-3 bg-[#1c1c1e] border-b border-l border-[#2c2c2e] transform rotate-[-45deg] -bottom-[6px] left-1/2 -ml-1"></div>
        </div>
        
        <img 
          src={user?.pic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} 
          alt="Profile" 
          className="w-32 h-32 rounded-full object-cover mt-10 mb-4"
        />
        <h1 className="text-3xl font-bold">{user?.name}🤍</h1>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-[#8e8e93] text-[15px] font-medium mb-2 pl-4">Settings</h2>
        
        {/* Section 1 */}
        <div className="rounded-xl overflow-hidden mb-8">
          <SettingItem onClick={() => handleAlert("Avatar")} icon={UserCircle2} title="Avatar" />
          <SettingItem onClick={() => handleAlert("Lists")} icon={ListMinus} title="Lists" />
          <SettingItem onClick={() => handleAlert("Broadcast messages")} icon={Megaphone} title="Broadcast messages" />
          <SettingItem onClick={() => handleAlert("Starred")} icon={Star} title="Starred" />
          <SettingItem onClick={() => handleAlert("Linked devices")} icon={Laptop} title="Linked devices" noBorder />
        </div>

        {/* Section 2 */}
        <div className="rounded-xl overflow-hidden mb-8">
          <SettingItem onClick={() => handleAlert("Account")} icon={KeyRound} title="Account" />
          <SettingItem onClick={() => handleAlert("Privacy")} icon={Lock} title="Privacy" />
          <SettingItem onClick={() => handleAlert("Chats")} icon={MessageCircle} title="Chats" />
          <SettingItem onClick={() => handleAlert("Notifications")} icon={Bell} title="Notifications" />
          <SettingItem onClick={() => handleAlert("Payments")} icon={CreditCard} title="Payments" />
          <SettingItem onClick={() => handleAlert("Storage and data")} icon={ArrowDownUp} title="Storage and data" noBorder />
        </div>

        {/* Section 3 */}
        <div className="rounded-xl overflow-hidden mb-8">
          <SettingItem onClick={() => handleAlert("Help and feedback")} icon={HelpCircle} title="Help and feedback" />
          <SettingItem onClick={() => handleAlert("Invite a friend")} icon={UserPlus} title="Invite a friend" noBorder />
        </div>

        {/* Section 4: Meta */}
        <div className="rounded-xl bg-[#1c1c1e] p-4 mb-8 cursor-pointer hover:bg-[#2c2c2e] transition-colors" onClick={() => handleAlert("Meta Accounts Center")}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg inline-block align-middle transform translate-y-[-2px]">∞</span>
            <span className="font-medium text-lg text-[#e9edef]">Meta</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[17px] font-medium text-white">Accounts Center</h3>
              <p className="text-[#8e8e93] text-[14px] pr-10 leading-tight mt-1">
                Control your experience across WhatsApp, Facebook, Instagram and more.
              </p>
            </div>
            <ChevronRight size={20} className="text-[#8e8e93]" />
          </div>
        </div>

        {/* Section 5: Also from Meta */}
        <div className="rounded-xl bg-[#1c1c1e] p-4 mb-20">
          <h3 className="text-[#8e8e93] text-[15px] mb-4">Also from Meta</h3>
          <div className="flex justify-between px-2">
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleAlert("Instagram")}>
              <div className="w-14 h-14 rounded-full bg-[#2c2c2e] flex items-center justify-center hover:bg-[#3c3c3e]">
                <Instagram size={28} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-[12px] text-white font-medium">Instagram</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleAlert("Facebook")}>
              <div className="w-14 h-14 rounded-full bg-[#2c2c2e] flex items-center justify-center hover:bg-[#3c3c3e]">
                <Facebook size={28} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-[12px] text-white font-medium">Facebook</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleAlert("Threads")}>
              <div className="w-14 h-14 rounded-full bg-[#2c2c2e] flex items-center justify-center hover:bg-[#3c3c3e]">
                <div className="text-white font-bold text-[24px]">@</div>
              </div>
              <span className="text-[12px] text-white font-medium">Threads</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleAlert("Meta AI App")}>
              <div className="w-14 h-14 rounded-full bg-[#2c2c2e] flex items-center justify-center hover:bg-[#3c3c3e]">
                <div className="w-8 h-8 rounded-full border-[3px] border-white"></div>
              </div>
              <span className="text-[12px] text-white font-medium">Meta AI App</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouPage;
