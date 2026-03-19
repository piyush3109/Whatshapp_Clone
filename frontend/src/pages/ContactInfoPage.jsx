import React from 'react';
import { ChevronLeft, Phone, Video, IndianRupee, Search, Image as ImageIcon, HardDrive, Star, Bell, Palette, Download, Clock, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-10">
      {/* Header */}
      <div className="flex justify-between items-center px-2 pt-12 pb-4 bg-[#0c0c0d]/90 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#e9edef]">
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-semibold tracking-wide">Contact info</span>
        <button className="text-[#e9edef] text-[17px] font-medium mr-2">Edit</button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="w-28 h-28 rounded-full bg-[#185536] flex items-center justify-center mb-4 overflow-hidden">
          <svg viewBox="0 0 24 24" fill="#6df480" className="w-[50px] h-[50px] mt-2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <h1 className="text-[24px] font-bold">Krishna Beta</h1>
        <p className="text-[#8e8e93] text-[15px] mt-1">+91 82107 63241</p>
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
