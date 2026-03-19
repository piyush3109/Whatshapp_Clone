import React from 'react';
import { ChevronLeft, ChevronRight, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactDetailsPage = () => {
  const navigate = useNavigate();

  const commonGroups = [
    { id: 1, name: '3B("Java Training")', sub: 'Janhvi Jaiswal Didi, Kartik Shukla Clg, Krish...', icon: 'https://cdn-icons-png.flaticon.com/512/226/226777.png' },
    { id: 2, name: 'Clg(Unofficial group)', sub: 'Janhvi Jaiswal Didi, Kartik Shukla Clg, Krish...', icon: 'https://cdn-icons-png.flaticon.com/512/4744/4744315.png' },
    { id: 3, name: '3B CSE 3rd Year 2027 batch', sub: 'Aitbar, Gaurav Bhumihar, Janhvi Jaiswal Did...', Initials: '3B' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-10">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-12 pb-4 bg-[#0c0c0d]/90 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#e9edef]">
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-semibold tracking-wide">Krishna Beta</span>
        <button className="text-[#e9edef] text-[17px] font-medium">Edit</button>
      </div>
      
      <div className="px-4 mt-2">
        {/* Contact Details Nav */}
        <div className="bg-[#1c1c1e] rounded-xl flex items-center justify-between px-4 py-[14px] mb-8 cursor-pointer">
          <div className="flex items-center gap-3">
            <User size={22} className="text-white" />
            <span className="text-white text-[17px]">Contact details</span>
          </div>
          <ChevronRight size={20} className="text-[#8e8e93]" />
        </div>

        {/* Groups in common */}
        <h2 className="text-white text-[16px] font-medium mb-2 pl-2">17 groups in common</h2>
        <div className="bg-[#1c1c1e] rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-4 px-4 py-[14px] border-b border-[#2c2c2e] cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#2c2c2e] flex items-center justify-center">
              <Plus size={20} className="text-white" />
            </div>
            <span className="text-white text-[17px]">Create group with Krishna</span>
          </div>
          
          {commonGroups.map((group, index) => (
            <div key={group.id} className={`flex items-center gap-4 px-4 py-[10px] ${index !== commonGroups.length - 1 ? 'border-b border-[#2c2c2e]' : ''} cursor-pointer`}>
              {group.icon ? (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
                  <img src={group.icon} alt={group.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#202c33] flex items-center justify-center font-semibold text-white">
                  {group.Initials}
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-white text-[17px]">{group.name}</h3>
                <p className="text-[#8e8e93] text-[14px] pr-2 line-clamp-1">{group.sub}</p>
              </div>
              <ChevronRight size={20} className="text-[#8e8e93]" />
            </div>
          ))}

          <div className="flex items-center justify-between px-4 py-[14px] border-t border-[#2c2c2e] cursor-pointer">
            <span className="text-white text-[17px]">See all</span>
            <ChevronRight size={20} className="text-[#8e8e93]" />
          </div>
        </div>

        {/* Action Buttons 1 */}
        <div className="bg-[#1c1c1e] rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-[14px] border-b border-[#2c2c2e] cursor-pointer text-[#02c754] text-[17px]">
            Share contact
          </div>
          <div className="px-4 py-[14px] border-b border-[#2c2c2e] cursor-pointer text-[#02c754] text-[17px]">
            Add to Favorites
          </div>
          <div className="px-4 py-[14px] border-b border-[#2c2c2e] cursor-pointer text-[#02c754] text-[17px]">
            Add to list
          </div>
          <div className="px-4 py-[14px] border-b border-[#2c2c2e] cursor-pointer text-[#02c754] text-[17px]">
            Export chat
          </div>
          <div className="px-4 py-[14px] cursor-pointer text-[#ff3b30] text-[17px]">
            Clear chat
          </div>
        </div>

        {/* Action Buttons 2 */}
        <div className="bg-[#1c1c1e] rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-[14px] border-b border-[#2c2c2e] cursor-pointer text-[#ff3b30] text-[17px]">
            Block Krishna Beta
          </div>
          <div className="px-4 py-[14px] cursor-pointer text-[#ff3b30] text-[17px]">
            Report Krishna Beta
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactDetailsPage;
