import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from "../api";
import { Search, MapPin, DollarSign, Building2 } from "lucide-react";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Find Your Next Career
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Browse the latest opportunities on RecruitConnect
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">{job.company_name}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={16} /> {job.salary_range}
                </div>
              </div>

              <Link
                to={`/jobs/${job.id}`}
                className="w-full ... text-center block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
