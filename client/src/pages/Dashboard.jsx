import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs'); // Assuming your Flask route is @app.route('/api/jobs')
        setJobs(response.data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-600">Managing listings for <span className="font-semibold text-blue-600">{user?.full_name}</span></p>
      </header>

      <div className="grid gap-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Briefcase size={20} className="text-blue-500" />
          Active Job Listings
        </h2>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary_range}</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>
                <p className="mt-4 text-gray-600 text-sm line-clamp-2">{job.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;