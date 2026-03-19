import React from 'react';
import { MoreHorizontal, Camera, PenLine } from 'lucide-react';
import { useStore } from '../store';

const StatusCard = ({ isUser, name, image, avatar, hasUpdate, isViewed }) => (
  <div className="relative w-28 h-40 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer">
    <img src={image} alt={name} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
    
    <div className="absolute top-2 left-2 relative">
      <div className={`w-10 h-10 rounded-full border-[2.5px] border-black overflow-hidden
        ${isUser ? 'border-none' : hasUpdate && !isViewed ? 'ring-[2.5px] ring-[#00a884]' : 'ring-[2.5px] ring-[#8e8e93]'}
      `}>
        <img src={avatar || image} className="w-full h-full object-cover" alt="" />
      </div>
      {isUser && (
        <div className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-[#00a884] rounded-full flex items-center justify-center border-2 border-black">
          <span className="text-black font-bold text-[14px] leading-none mb-[2px]">+</span>
        </div>
      )}
    </div>
    
    <span className="absolute bottom-2 left-2 text-white font-semibold text-sm leading-tight max-w-[90%]">
      {name}
    </span>
  </div>
);

const ChannelItem = ({ name, message, time, badge, avatar }) => (
  <div className="flex items-center gap-4 py-3 cursor-pointer">
    <img src={avatar} className="w-[52px] h-[52px] rounded-full object-cover" alt={name} />
    <div className="flex-1 border-b border-[#2c2c2e] pb-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-white font-semibold text-[17px]">{name}</h3>
        <span className="text-[#00a884] text-[13px]">{time}</span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[#8e8e93] text-[15px] line-clamp-2 pr-6 leading-tight">{message}</p>
        {badge && (
          <div className="bg-[#00a884] text-black text-[13px] font-semibold px-2 py-[2px] rounded-full">
            {badge}
          </div>
        )}
      </div>
    </div>
  </div>
);

const UpdatesPage = () => {
  const { user } = useStore();

  const statuses = [
    { id: 1, name: 'Anshuman Tiwari', image: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=400', hasUpdate: true, isViewed: false },
    { id: 2, name: 'Ratan Mishra Gonda', image: 'https://images.unsplash.com/photo-1542044896530-05d3c054e274?w=400', hasUpdate: true, isViewed: true },
    { id: 3, name: 'Upp Di...', image: 'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?w=400', hasUpdate: true, isViewed: false },
  ];

  const channels = [
    { id: 1, name: 'ABP News', message: '📷 IPL में सबसे ज्यादा टीमों के लिए खेलने वाले 5 खिलाड़ी, एक ने तो 9 बार बदली फ्रेंचाइजी...', time: '9:11 AM', badge: '977', avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/ABP_News_logo.svg/1200px-ABP_News_logo.svg.png' },
    { id: 2, name: 'Narendra Modi', message: '🔗 जगतजननी मां दुर्गा के चरणों में कोटि-कोटि देशवासियों की ओर से मेरा नमन और...', time: '8:50 AM', badge: '197', avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png' },
    { id: 3, name: 'Aaj Tak', message: '📷 Today\'s Horoscope : आज कैसा रहेगा आपका दिन? जानिए 19 मार्च 202...', time: '8:30 AM', badge: '999+', avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Aaj_tak_logo.png' },
    { id: 4, name: 'News18 India', message: '📷 पंचांग के अनुसार आज का शुभ योग और मुहूर्त जानकर अपने कार्यो की शुरुआत बेहतर...', time: '7:42 AM', badge: '832', avatar: 'https://upload.wikimedia.org/wikipedia/commons/h/h7/News18_India_Logo_2022.svg' },
  ];

  return (
    <div className="bg-black text-white min-h-screen pb-20 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-14 pb-2">
        <MoreHorizontal size={28} className="text-white" />
      </div>
      
      <div className="px-4">
        <h1 className="text-[34px] font-bold mt-2 mb-6 tracking-tight">Updates</h1>

        {/* Status Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-bold">Status</h2>
          <div className="flex gap-4">
            <button className="bg-[#1c1c1e] p-[10px] rounded-full"><Camera size={18} className="text-white" /></button>
            <button className="bg-[#1c1c1e] p-[10px] rounded-full"><PenLine size={18} className="text-white" /></button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {/* User Status Card */}
          <StatusCard 
            isUser={true} 
            name="My status" 
            image={user?.pic || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'} 
          />
          {/* Other Statuses */}
          {statuses.map(s => (
            <StatusCard 
              key={s.id} 
              isUser={false} 
              name={s.name} 
              image={s.image} 
              avatar={s.image}
              hasUpdate={s.hasUpdate} 
              isViewed={s.isViewed} 
            />
          ))}
        </div>

        {/* Channels Section */}
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="text-[20px] font-bold">Channels</h2>
          <button className="bg-[#1c1c1e] px-4 py-[6px] rounded-full text-[15px] font-semibold">
            Explore
          </button>
        </div>

        <div className="flex flex-col">
          {channels.map(c => (
            <ChannelItem key={c.id} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatesPage;
