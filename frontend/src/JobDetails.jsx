import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiBriefcase, FiDollarSign, FiClock } from 'react-icons/fi';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  // Consider moving this to a central config file or .env later
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    // Sanitize ID: strips any leading colons from the URL param
    const cleanId = id.includes(':') ? id.split(':').pop() : id;
    
    setLoading(true);
    axios.get(`${API_URL}/api/jobs/${cleanId}`)
      .then(res => {
        setJob(res.data);
        setLoading(false);
        window.scrollTo(0, 0); // Scroll to top when new job loads
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Job not found");
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to apply");
      return navigate('/login');
    }

    setIsApplying(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      const cleanId = id.includes(':') ? id.split(':').pop() : id;
      await axios.post(`${API_URL}/api/apply`, 
        { jobId: parseInt(cleanId), userId: 1 }, // Ensure userId is handled by auth on backend in prod
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Applied successfully!", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed", { id: loadingToast });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
      <p className="text-slate-400 font-bold animate-pulse">Loading job details...</p>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Job not found</h2>
        <p className="text-slate-500 mb-6">The listing might have been removed or expired.</p>
        <Link to="/jobs" className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-purple-700 transition-all">
          Back to job listings
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* --- BACK BUTTON --- */}
        <button 
          onClick={() => navigate('/jobs')} 
          className="group flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-purple-600 transition-all"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-purple-50 group-hover:shadow-md transition-all">
            <FiArrowLeft size={20} />
          </div>
          <span>Back to Jobs</span>
        </button>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {job.type || 'Full Time'}
              </span>
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Active
              </span>
            </div>
            <span className="text-slate-300 font-bold text-xs">ID: #{job.id}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-tight">
            {job.title}
          </h1>
          <p className="text-2xl text-purple-600 font-bold mb-10">{job.company}</p>
          
          {/* --- INFO GRID --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="bg-white p-2 rounded-lg text-purple-500 shadow-sm"><FiMapPin /></div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Location</p>
                <p className="text-slate-700 font-bold text-sm">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="bg-white p-2 rounded-lg text-purple-500 shadow-sm"><FiDollarSign /></div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Salary</p>
                <p className="text-slate-700 font-bold text-sm">{job.salary || 'Competitive'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="bg-white p-2 rounded-lg text-purple-500 shadow-sm"><FiClock /></div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Posted</p>
                <p className="text-slate-700 font-bold text-sm">Recently</p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none mb-12">
            <div className="flex items-center gap-2 mb-4">
               <FiBriefcase className="text-purple-600" />
               <h3 className="font-black text-slate-900 text-xl m-0">About the Role</h3>
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
              {job.description}
            </p>
          </div>

          {/* --- CTA BOX --- */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h4 className="font-black text-2xl mb-2">Ready to apply?</h4>
              <p className="text-slate-400 text-base max-w-xs">
                Submit your CV today and the hiring team will review it within 48 hours.
              </p>
            </div>
            <button 
              onClick={handleApply}
              disabled={isApplying}
              className="w-full md:w-auto bg-purple-500 text-white px-14 py-5 rounded-2xl font-black hover:bg-purple-400 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-purple-500/20 text-lg"
            >
              {isApplying ? "Submitting..." : "Apply Now"}
            </button>
          </div>
        </div>

        {/* --- FOOTER HINT --- */}
        <p className="text-center mt-12 text-slate-400 font-medium text-sm">
          Not the right fit? <Link to="/jobs" className="text-purple-600 font-bold hover:underline">Explore more opportunities</Link>
        </p>
      </div>
    </div>
  );
}