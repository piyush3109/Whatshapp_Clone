import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PlaceholderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Convert URL dash-case to Title Case (e.g. "meta-accounts-center" -> "Meta Accounts Center")
  const title = id ? id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Page';

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center px-2 pt-14 pb-3 bg-[#1c1c1e] border-b border-[#2c2c2e] sticky top-0 z-10">
        <div className="flex items-center cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronLeft size={32} className="text-[#02c754] ml-1" strokeWidth={1.5} />
          <span className="text-[#02c754] text-[17px] font-medium mr-2">Back</span>
        </div>
        <h1 className="text-white text-[17px] font-semibold tracking-wide absolute left-1/2 transform -translate-x-1/2 line-clamp-1 max-w-[180px]">
          {title}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#1c1c1e] rounded-full flex items-center justify-center mb-6 border border-[#2c2c2e]">
          <span className="text-[#02c754] text-3xl font-bold">{title.charAt(0)}</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-[#8e8e93] text-[16px] leading-relaxed max-w-sm">
          This feature is currently under active development. The underlying routing is perfectly set up.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
