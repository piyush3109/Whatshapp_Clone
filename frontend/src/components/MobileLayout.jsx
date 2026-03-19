import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CircleDashed, Phone, Users, MessageCircle, User } from 'lucide-react';
import { useStore } from '../store';

const MobileLayout = () => {
  const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: 'Updates', path: '/updates', icon: CircleDashed, badge: true },
    { name: 'Calls', path: '/calls', icon: Phone, badge: 6 },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Chats', path: '/chats', icon: MessageCircle, badge: 110 },
    { name: 'You', path: '/you', icon: User, isAvatar: true },
  ];

  return (
    <div className="flex flex-col h-screen bg-black text-white w-full max-w-md mx-auto border-x border-[#1c1c1e]">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar z-0 relative pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full max-w-md h-[83px] bg-[#0c0c0d]/90 backdrop-blur-md border-t border-[#1c1c1e] flex justify-around items-start pt-3 pb-8 z-50">
        {tabs.map((tab) => {
          const isActive = location.pathname.includes(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 w-16 relative ${
                isActive ? 'text-white' : 'text-[#8e8e93]'
              }`}
            >
              <div className="relative">
                {tab.isAvatar ? (
                  <img
                    src={user?.pic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                    alt="avatar"
                    className={`w-7 h-7 rounded-full object-cover ${isActive ? 'ring-2 ring-white ring-offset-black' : ''}`}
                  />
                ) : (
                  <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                )}
                {/* Badge rendering */}
                {tab.badge && (
                  <div className={`absolute -top-1 -right-2 bg-[#25d366] text-black text-[10px] font-bold px-[5px] py-[1px] rounded-full border-2 border-black ${tab.badge === true ? 'w-3 h-3 p-0' : ''}`}>
                    {tab.badge !== true ? tab.badge : ''}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-wide mt-1">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileLayout;
