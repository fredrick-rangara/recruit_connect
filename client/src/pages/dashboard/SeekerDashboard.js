import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import API from '../../services/api';

const SeekerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        const res = await API.get('/seeker/applications');
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };
    fetchUserApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user}! 👋</h1>
        <p className="text-gray-500">Here’s what’s happening with your job search today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Briefcase size={20}/>} label="Applied Jobs" count={applications.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<CheckCircle size={20}/>} label="Interviews" count="2" color="bg-green-50 text-green-600" />
        <StatCard icon={<Clock size={20}/>} label="Pending" count="5" color="bg-yellow-50 text-yellow-600" />
        <StatCard icon={<XCircle size={20}/>} label="Rejected" count="1" color="bg-red-50 text-red-600" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Application Table */}
        <div className="lg:w-2/3 bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b">
                  <th className="pb-4 font-medium">Job Title</th>
                  <th className="pb-4 font-medium">Company</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Date Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="text-sm">
                    <td className="py-4 font-semibold">{app.job_title}</td>
                    <td className="py-4 text-gray-600">{app.company}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Profile Strength & Recommended Jobs */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-purple-600 text-white p-6 rounded-2xl">
            <h3 className="font-bold mb-2">Profile Strength</h3>
            <p className="text-sm text-purple-100 mb-4">Complete your profile to get 2x more visibility.</p>
            <div className="w-full bg-purple-400 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-right text-xs">75% Complete</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4">Job Alerts</h3>
            <p className="text-sm text-gray-500 italic">No new alerts. We'll notify you when roles match your skill set!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, count, color }) => (
  <div className={`p-6 rounded-2xl border flex items-center gap-4`}>
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{count}</p>
    </div>
  </div>
);

export default SeekerDashboard;