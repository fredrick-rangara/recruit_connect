import React, { useEffect, useState } from 'react';
import { Plus, Users, Eye, CheckCircle, MoreHorizontal } from 'lucide-react';
import API from '../../services/api';

const EmployerDashboard = () => {
  const [stats, setStats] = useState({ total_applicants: 0, active_listings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const res = await API.get('/employer/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployerData();
  }, []);

  if (loading) return <div className="p-20 text-center text-purple-600">Syncing your recruitment data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Post Job Button */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Recruitment Hub</h1>
          <p className="text-gray-500">Monitor your hiring pipeline and job performance.</p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition shadow-lg">
          <Plus size={20} /> Post a New Job
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={24}/></span>
            <span className="text-green-500 text-xs font-bold">+12% vs last month</span>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Total Applicants</p>
            <p className="text-3xl font-bold">{stats.total_applicants}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Eye size={24}/></span>
            <span className="text-blue-500 text-xs font-bold">Live Tracking</span>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Job Post Views</p>
            <p className="text-3xl font-bold">1,284</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></span>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Hired This Month</p>
            <p className="text-3xl font-bold">4</p>
          </div>
        </div>
      </div>

      {/* Active Job Postings Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Active Job Postings</h2>
          <button className="text-sm text-gray-400 hover:text-purple-600">View Archive</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Job Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Applicants</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.active_listings.map((job, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-800">{job.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 text-[10px] flex items-center justify-center font-bold">U{i}</div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{job.applicant_count} candidates</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-purple-600"><MoreHorizontal size={20}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;