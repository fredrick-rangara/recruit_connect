import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Users } from 'lucide-react';

const Hero = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch({ keyword, location });
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'url("../src/assets/shridhar-gupta-dZxQn4VEv2M-unsplash.jpg")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay to make text readable */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Find Your <span className="text-indigo-400">Dream Job</span> Today!
        </h1>
        <p className="mt-6 text-lg text-slate-200 max-w-2xl mx-auto">
          Connecting Talent with Opportunity: Your Gateway to Career Success.
        </p>

        {/* Search Bar Container */}
        <div className="mt-10 flex flex-col md:flex-row bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto items-center">
          <div className="flex items-center flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 w-full">
            <Search className="text-slate-400 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Job Title or Company" 
              className="outline-none w-full text-slate-700 bg-transparent"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          
          <div className="flex items-center flex-1 px-4 py-3 w-full">
            <MapPin className="text-slate-400 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Select Location" 
              className="outline-none w-full text-slate-700 bg-transparent"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Search Job
          </button>
        </div>

        {/* Hero Stats */}
        <div className="mt-12 flex justify-center gap-8 md:gap-12 flex-wrap">
          <StatBadge icon={<Briefcase size={18}/>} count="12,470" label="Jobs" bgColor="bg-purple-500/20" textColor="text-purple-300" />
          <StatBadge icon={<Users size={18}/>} count="10,240" label="Members" bgColor="bg-orange-500/20" textColor="text-orange-300" />
          <StatBadge icon={<Briefcase size={18}/>} count="18,900" label="Companies" bgColor="bg-blue-500/20" textColor="text-blue-300" />
        </div>
      </div>
    </section>
  );
};

const StatBadge = ({ icon, count, label, bgColor, textColor }) => (
  <div className="flex items-center space-x-3">
    <div className={`p-2 ${bgColor} ${textColor} rounded-lg`}>{icon}</div>
    <div className="text-left">
      <p className={`font-bold ${textColor}`}>{count}</p>
      <p className="text-slate-300 text-xs uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export default Hero;