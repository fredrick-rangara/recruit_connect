import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { MapPin, DollarSign, Building2, ArrowLeft, Send } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="text-center mt-20 animate-pulse">Loading job details...</div>;
  if (!job) return <div className="text-center mt-20">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={20} /> Back to Job Board
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {job.category || 'General'}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mt-2">{job.title}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-2 text-lg">
              <Building2 size={20} /> {job.company_name}
            </div>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            <Send size={20} /> Apply Now
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-2xl mb-8">
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Salary</p>
              <p className="font-medium">{job.salary_range}</p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-4">Description</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;