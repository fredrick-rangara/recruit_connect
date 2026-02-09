import React, { useState, useEffect } from 'react';
import API from '../services/api';
import JobCard from '../components/jobs/JobCard';
import JobFilterSidebar from '../components/jobs/JobFilterSidebar';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    jobType: '',
    salaryRange: [0, 200000]
  });

  // Fetch jobs whenever filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const res = await API.get(`/jobs?${params}`);
        setJobs(res.data);
      } catch (err) {
        console.error("Error filtering jobs", err);
      }
    };
    fetchJobs();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
      {/* Left Sidebar - Filters */}
      <aside className="w-1/4">
        <JobFilterSidebar filters={filters} setFilters={setFilters} />
      </aside>

      {/* Right Content - Results */}
      <section className="w-3/4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Showing {jobs.length} Results</h2>
          <select className="border p-2 rounded-md text-sm outline-none">
            <option>Sort by: Latest</option>
            <option>Sort by: Salary (High to Low)</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          {jobs.length > 0 ? (
            jobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jobs;