import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { Briefcase, MapPin, DollarSign, Plus, X } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', location: '', salary_range: '', description: '' });

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', newJob);
      setIsModalOpen(false);
      setNewJob({ title: '', location: '', salary_range: '', description: '' });
      fetchJobs(); // Refresh the list
    } catch (err) { alert("Failed to post job"); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600">Welcome back, <span className="text-blue-600 font-medium">{user?.full_name}</span></p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Post New Job
        </button>
      </div>

      {/* Job List */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg">{job.title}</h3>
            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
              <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salary_range}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Post a Job</h2>
            <form onSubmit={handlePostJob} className="space-y-4">
              <input 
                placeholder="Job Title (e.g. Senior Dev)" 
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                onChange={e => setNewJob({...newJob, title: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Location" 
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={e => setNewJob({...newJob, location: e.target.value})}
                  required
                />
                <input 
                  placeholder="Salary Range" 
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={e => setNewJob({...newJob, salary_range: e.target.value})}
                  required
                />
              </div>
              <textarea 
                placeholder="Job Description" 
                rows="4"
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                onChange={e => setNewJob({...newJob, description: e.target.value})}
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
                Submit Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;