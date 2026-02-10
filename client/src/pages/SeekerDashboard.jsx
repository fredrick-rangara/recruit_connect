import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  MessageSquare, 
  Upload, 
  LogOut 
} from 'lucide-react';

const SeekerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic to clear local storage/session goes here later
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6">
        <div className="text-xl font-bold text-slate-900 mb-8">
          Recruit<span className="text-indigo-600">Connect</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <SidebarLink icon={<Search size={20}/>} label="Search Jobs" />
          <SidebarLink icon={<FileText size={20}/>} label="My Applications" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" />
        </nav>

        {/* Logout Button pinned to bottom */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-rose-500 hover:bg-rose-50 transition-colors mt-auto"
        >
          <LogOut size={20}/>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Alex!</h1>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
             <img src="https://i.pravatar.cc/150?u=alex" alt="profile" />
          </div>
        </header>

        {/* Upload CV Banner */}
        <div className="bg-indigo-600 rounded-3xl p-8 flex justify-between items-center text-white mb-8 shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Upload size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Upload Your CV</h2>
              <p className="text-indigo-100">Boost your profile visibility by 90%.</p>
            </div>
          </div>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition">
            Browse Files
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Tracker */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-6">Application Tracker</h3>
            <div className="flex items-center gap-4">
               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-indigo-600 rounded-full"></div>
               </div>
               <span className="text-sm text-slate-500 font-medium">Under Review: Senior Designer at Apple</span>
            </div>
          </div>

          {/* Profile Strength */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <h3 className="font-bold text-lg mb-4">Profile Strength</h3>
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle 
                  className="text-slate-100" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="50" 
                  cx="64" 
                  cy="64"
                />
                <circle 
                  className="text-indigo-600" 
                  strokeWidth="8" 
                  strokeDasharray={314} 
                  strokeDashoffset={314 - (314 * 75) / 100} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="50" 
                  cx="64" 
                  cy="64"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-indigo-600">75%</span>
            </div>
            <p className="text-slate-500 text-sm">Almost there! Add a portfolio to hit 100%.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal Helper Component for Sidebar Links
const SidebarLink = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold cursor-pointer transition-colors ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon} 
    <span>{label}</span>
  </div>
);

export default SeekerDashboard;