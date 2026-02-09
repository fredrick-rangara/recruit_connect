import React from 'react';
import { Users, Clock, CheckCircle, Zap, Plus, Search } from 'lucide-react';

const EmployerDashboard = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Using the brand-dark color from your theme */}
      <aside className="w-64 bg-brand-dark text-gray-400 p-6 flex flex-col">
        <div className="flex items-center gap-2 text-white mb-10">
          <div className="bg-white/10 p-2 rounded-lg">
             <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="font-bold text-lg">Recruit Connect</span>
        </div>
        
        <nav className="space-y-6 flex-1">
          <div className="text-white flex items-center gap-3 cursor-pointer"><span className="w-1 h-6 bg-brand-purple absolute left-0 rounded-r"></span> Dashboard</div>
          <div className="hover:text-white transition cursor-pointer">Active Listings</div>
          <div className="hover:text-white transition cursor-pointer">Talent Pipeline</div>
          <div className="hover:text-white transition cursor-pointer">Interview Room</div>
        </nav>

        <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs mb-2">Plan: Enterprise</p>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-purple h-full w-4/5"></div>
          </div>
          <p className="text-[10px] mt-2">8/10 Jobs Posted</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Recruitment Hub</h1>
            <p className="text-gray-400 text-sm">Thursday, Jan 29, 2026</p>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" placeholder="Search Candidates..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm" />
             </div>
             <button className="bg-brand-purple text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                <Plus size={16} /> Post New Role
             </button>
          </div>
        </header>

        {/* Analytic Cards Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <MetricCard label="Total Applicants" value="1,284" trend="+12%" icon={<Users className="text-blue-500" />} />
          <MetricCard label="Avg. Time to Hire" value="18 Days" icon={<Clock className="text-orange-500" />} />
          <MetricCard label="Offer Acceptance" value="92%" icon={<CheckCircle className="text-green-500" />} />
          <MetricCard label="AI Sourcing Efficiency" value="+40%" icon={<Zap className="text-purple-500" />} />
        </div>

        {/* Active Hiring Pipeline & Today's Interviews */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold mb-6">Active Hiring Pipeline</h2>
            <div className="space-y-4">
               <PipelineItem title="Senior Product Designer" count="42 Applicants" status="URGENT" color="bg-blue-100 text-blue-600" />
               <PipelineItem title="Frontend Engineer (React)" count="128 Applicants" status="NORMAL" color="bg-green-100 text-green-600" />
            </div>
          </div>

          <div className="space-y-6">
             <div className="border border-gray-100 rounded-2xl p-6">
                <h2 className="font-bold mb-4">Today's Interviews</h2>
                <div className="space-y-4">
                   <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-1 bg-brand-purple rounded-full"></div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold">10:30 AM</p>
                        <p className="text-sm font-bold">Courtney Henry</p>
                        <p className="text-[10px] text-gray-500">Senior UI Designer</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-brand-dark text-white p-6 rounded-2xl relative overflow-hidden">
                <h2 className="font-bold mb-2">Smart Match™</h2>
                <p className="text-xs text-gray-400 mb-4">We found 8 candidates that match your criteria exactly.</p>
                <button className="w-full bg-brand-purple py-2 rounded-lg text-xs font-bold">Review Matches</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ label, value, trend, icon }) => (
  <div className="border border-gray-100 p-6 rounded-2xl bg-white">
    <div className="text-gray-400 text-xs mb-2 flex justify-between">
      {label} {trend && <span className="text-green-500 font-bold">{trend}</span>}
    </div>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold">{value}</span>
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    </div>
  </div>
);

const PipelineItem = ({ title, count, status, color }) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center font-bold text-xs`}>{title[0]}</div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-gray-400">{count} • 3 Interviews Today</p>
      </div>
    </div>
    <span className={`text-[10px] font-bold px-2 py-1 rounded ${status === 'URGENT' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>{status}</span>
  </div>
);

export default EmployerDashboard;