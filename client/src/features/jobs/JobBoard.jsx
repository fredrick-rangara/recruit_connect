import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState({ keyword: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Member 4 built these query params in the backend!
      const response = await api.get(`/jobs?keyword=${search.keyword}&location=${search.location}`);
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="job-board">
      <section className="search-section">
        <h2>Find Your Next Career</h2>
        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            placeholder="Job title or keyword" 
            onChange={(e) => setSearch({...search, keyword: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Location" 
            onChange={(e) => setSearch({...search, location: e.target.value})}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </section>

      <section className="jobs-list">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company-name">{job.company}</p>
              <p className="location">📍 {job.location}</p>
              <p className="description-preview">{job.description.substring(0, 100)}...</p>
              <Link to={`/jobs/${job.id}`} className="btn-secondary">View Details</Link>
            </div>
          ))
        ) : (
          <p>No jobs found matching your criteria.</p>
        )}
      </section>
    </div>
  );
};

export default JobBoard;