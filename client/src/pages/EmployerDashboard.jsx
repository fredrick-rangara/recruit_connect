import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  Plus, 
  Search, 
  LogOut 
} from 'lucide-react';

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Session clearing logic will go here once the backend is ready
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col p-6">
        <div className="flex items-center gap-2 text-white font-bold text-xl mb-12">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-900">
             <Briefcase size={18}/>
           </div>
           Recruit Connect
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLinkDark icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <SidebarLinkDark icon={<Briefcase size={20}/>} label="Active Listings" />
          <SidebarLinkDark icon={<Users size={20}/>} label="Talent Pipeline" />
          <SidebarLinkDark icon={<Settings size={20}/>} label="Team Settings" />
        </nav>

        {/* Plan Usage Widget */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-white/5">
           <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Plan: Enterprise</p>
           <div className="h-1.5 w-full bg-slate-700 rounded-full">
             <div className="w-4/5 h-full bg-indigo-500 rounded-full"></div>
           </div>
           <p className="text-[10px] mt-2 text-slate-400 font-medium">8/10 Jobs Posted</p>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all mt-6"
        >
          <LogOut size={20}/>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Recruitment Hub</h1>
            <p className="text-slate-400 mt-1">Thursday, Jan 29, 2026</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Candidates..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-indigo-500/20" 
              />
            </div>
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
              <Plus size={18}/> Post New Role
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard label="Total Applicants" value="1,284" change="+12%" />
          <MetricCard label="Avg. Time to Hire" value="18 Days" />
          <MetricCard label="Offer Acceptance" value="92%" />
          <MetricCard label="AI Sourcing Efficiency" value="+40%" color="text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Pipeline */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 text-slate-900">Active Hiring Pipeline</h3>
            <div className="space-y-4">
              <PipelineItem role="Senior Product Designer" apps="42" status="URGENT" color="bg-orange-50 text-orange-600" />
              <PipelineItem role="Frontend Engineer (React)" apps="128" status="NORMAL" color="bg-emerald-50 text-emerald-600" />
            </div>
          </div>

          {/* Sidebar Info Cards */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <h4 className="font-bold mb-4 text-slate-900">Today's Interviews</h4>
               <div className="space-y-4">
                  <InterviewItem time="10:30 AM" name="Courtney Henry" role="Senior UI Designer" />
                  <InterviewItem time="02:00 PM" name="Arlene McCoy" role="Backend Lead" />
               </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
               <h4 className="font-bold mb-2">Smart Match™</h4>
               <p className="text-slate-400 text-xs mb-4">We've found 3 candidates that match your "Product Manager" criteria exactly.</p>
               <button className="w-full bg-indigo-600 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition">
                 Review Matches
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal Helper Components
const SidebarLinkDark = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium cursor-pointer transition-colors ${active ? 'bg-slate-800 text-white shadow-inner' : 'hover:bg-slate-800/50 hover:text-slate-200'}`}>
    {icon} 
    <span>{label}</span>
  </div>
);

const MetricCard = ({ label, value, change }) => (
  <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      {change && <span className="text-xs font-bold text-emerald-500">{change}</span>}
    </div>
  </div>
);

const PipelineItem = ({ role, apps, status, color }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
        {role.substring(0, 2).toUpperCase()}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{role}</h4>
        <p className="text-xs text-slate-500 font-medium">{apps} Applicants • 3 Interviews Today</p>
      </div>
    </div>
    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${color}`}>
      {status}
    </span>
  </div>
);

const InterviewItem = ({ time, name, role }) => (
  <div className="pl-4 border-l-2 border-indigo-500">
    <p className="text-[10px] font-bold text-indigo-600 mb-0.5">{time}</p>
    <h5 className="text-sm font-bold text-slate-900">{name}</h5>
    <p className="text-xs text-slate-500">{role}</p>
  </div>
);

export default EmployerDashboard;