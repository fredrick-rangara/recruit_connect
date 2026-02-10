import { useEffect, useState } from 'react';
import api from '../api';
import { Briefcase, Clock, CheckCircle } from 'lucide-react';

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/my-applications')
      .then(res => setApps(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading your applications...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-8 text-gray-900">My Applications</h1>
      
      {apps.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed rounded-3xl p-12 text-center">
          <p className="text-gray-500 text-lg">You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {apps.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-blue-600">{app.job_title}</h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <Briefcase size={16} /> {app.company}
                </p>
                <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
                  <Clock size={14} /> Applied on {app.applied_at}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                  app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;