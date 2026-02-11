import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cvName, setCvName] = useState("No CV uploaded yet");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/my-applications', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setApplications(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });
      setCvName(file.name);
      toast.success('CV Uploaded successfully!');
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP PROFILE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-black text-purple-600">
              JS
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back!</h1>
              <p className="text-slate-500 font-semibold mt-1">Keep track of your journey and professional profile.</p>
            </div>
          </div>

          {/* CV UPLOAD CARD */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden">
            <div>
              <h3 className="text-lg font-black mb-2">My Curriculum Vitae</h3>
              <p className="text-slate-400 text-sm font-medium mb-6 truncate">
                {uploading ? `Uploading: ${uploadProgress}%` : cvName}
              </p>
            </div>
            
            {/* PROGRESS BAR (Hidden when not uploading) */}
            {uploading && (
              <div className="absolute top-0 left-0 h-1 bg-purple-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            )}
            
            <label className={`cursor-pointer group ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
              <div className="w-full bg-white/10 border border-white/20 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white hover:text-slate-900 transition-all">
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>📤</span> Update CV</>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* APPLICATION TRACKING TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">Submitted Applications</h2>
            <span className="bg-purple-50 text-purple-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {applications.length} Active
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Company</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Date Applied</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   <tr><td colSpan="4" className="p-10 text-center text-slate-400">Loading applications...</td></tr>
                ) : applications.length > 0 ? (
                  applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{app.company}</td>
                      <td className="p-6 font-semibold text-slate-600">{app.jobTitle}</td>
                      <td className="p-6 text-slate-400 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="p-6">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {app.status || 'Under Review'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-bold">You haven't applied to any jobs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}