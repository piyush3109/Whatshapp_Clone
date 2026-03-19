import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CircleDashed, Phone, Users, MessageCircle, User } from 'lucide-react';
import { useStore } from '../store';

const MobileLayout = () => {
  const { user, chats } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate real unread messages from MongoDB connection stream
  const unreadChatsCount = chats?.filter(c => 
    c.unread > 0 || (c.latestMessage && !c.latestMessage?.readBy?.includes(user?._id))
  )?.length || 0;

  const tabs = [
    { name: 'Updates', path: '/updates', icon: CircleDashed, badge: 3 }, // Corresponds to statuses inside UpdatesPage 
    { name: 'Calls', path: '/calls', icon: Phone, badge: 0 },
    { name: 'Communities', path: '/communities', icon: Users, badge: 0 },
    { name: 'Chats', path: '/chats', icon: MessageCircle, badge: unreadChatsCount },
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
                
                {/* Badge rendering natively */}
                {tab.badge > 0 && (
                  <div className={`absolute -top-2 -right-3 bg-[#ff3b30] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-[5px] flex items-center justify-center rounded-full border-[2px] border-black shadow-sm`}>
                    {tab.badge > 99 ? '99+' : tab.badge}
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
