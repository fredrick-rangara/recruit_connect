import React from 'react';
import { FiTarget, FiUsers, FiShield, FiBriefcase } from 'react-icons/fi';

export default function About() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="text-purple-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
          <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">
            We’re on a mission to <br />
            <span className="text-purple-600">humanize hiring.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            JobHunter isn't just a job board. We are a bridge between ambitious talent 
            and the world's most innovative companies.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
              <FiTarget />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Precision</h3>
            <p className="text-slate-500 font-medium">We use smart matching to ensure you only see roles that actually fit your skills.</p>
          </div>

          <div className="p-10 bg-slate-900 rounded-[3rem] text-white hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
              <FiUsers />
            </div>
            <h3 className="text-2xl font-black mb-3">Community</h3>
            <p className="text-slate-400 font-medium">Join thousands of seekers who support each other through the application journey.</p>
          </div>

          <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
              <FiShield />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Trust</h3>
            <p className="text-slate-500 font-medium">Verified employers only. No ghosting, no spam, just real opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}