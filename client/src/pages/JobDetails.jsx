import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, CheckCircle } from 'lucide-react';
import API from '../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details", err);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    // Logic to send application to Flask
    setTimeout(() => {
      alert("Application sent successfully!");
      setApplying(false);
    }, 1500);
  };

  if (!job) return <div className="p-20 text-center">Loading job details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      
      {/* LEFT COLUMN: DESCRIPTION */}
      <div className="md:w-2/3">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-purple-600 font-medium mb-6">{job.company_name}</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Key Responsibilities</h2>
          <ul className="space-y-3">
            {['Lead technical projects', 'Collaborate with design team', 'Optimize performance'].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="text-green-500 mt-1" size={18} /> {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* RIGHT COLUMN: SUMMARY & APPLICATION */}
      <div className="md:w-1/3">
        <div className="bg-gray-50 p-6 rounded-2xl border mb-6">
          <h3 className="font-bold mb-4">Job Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><MapPin size={20} className="text-purple-600"/></div>
              <div><p className="text-xs text-gray-400">Location</p><p className="text-sm font-medium">{job.location}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><DollarSign size={20} className="text-purple-600"/></div>
              <div><p className="text-xs text-gray-400">Salary</p><p className="text-sm font-medium">{job.salary_range || 'Competitive'}</p></div>
            </div>
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-4">Apply for this position</h3>
          <form onSubmit={handleApply} className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg outline-none focus:border-purple-600" required />
            <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg outline-none focus:border-purple-600" required />
            <textarea placeholder="Cover Letter (Optional)" className="w-full p-3 border rounded-lg h-32 outline-none focus:border-purple-600"></textarea>
            
            <button 
              disabled={applying}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              {applying ? "Sending..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;