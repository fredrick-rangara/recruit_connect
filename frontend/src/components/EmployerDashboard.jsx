import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EmployerDashboard() {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const pending = job.applicants.filter(a => a.status === 'Pending');
  const accepted = job.applicants.filter(a => a.status === 'Accepted');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/employer/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setMyJobs(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${applicationId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success(`Marked as ${newStatus}`);
      // Refresh data to show updated status
      window.location.reload(); 
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employer Panel</h1>
          <p className="text-slate-500 font-bold mt-2">Manage your listings and review candidates.</p>
        </div>

        {loading ? (
          <p>Loading your listings...</p>
        ) : myJobs.map(job => (
          <div key={job.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-purple-600">{job.title}</h2>
                <p className="text-slate-400 font-bold">{job.applicants?.length || 0} Candidates Applied</p>
              </div>
              <button className="text-red-500 font-bold text-sm hover:underline">Delete Listing</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-4">Candidate</th>
                    <th className="pb-4">CV / Resume</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {job.applicants && job.applicants.map(applicant => (
                    <tr key={applicant.id} className="group">
                      <td className="py-4">
                        <p className="font-bold text-slate-900">{applicant.name}</p>
                        <p className="text-xs text-slate-400">{applicant.email}</p>
                      </td>
                      <td className="py-4">
                        {applicant.cvPath ? (
                          <a 
                            href={`http://localhost:5000${applicant.cvPath}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-slate-100 px-4 py-2 rounded-lg text-xs font-black hover:bg-purple-600 hover:text-white transition-all inline-block"
                          >
                            📄 View CV
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs italic">No CV uploaded</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase">
                          {applicant.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button 
                          onClick={() => updateStatus(applicant.id, 'Accepted')}
                          className="text-emerald-500 hover:text-emerald-700 font-bold text-xs"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateStatus(applicant.id, 'Rejected')}
                          className="text-red-400 hover:text-red-600 font-bold text-xs"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}