import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', location: '', category: '' });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Passes filters as query params to your Flask /jobs GET route
      const response = await api.get('/jobs', { params: filters });
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container job-list-page" style={{ padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>Find Your Dream Job</h1>
        <p style={{ color: '#64748b' }}>Browse through latest opportunities posted by top companies.</p>
      </header>

      {/* SEARCH BAR SECTION */}
      <form onSubmit={handleSearch} style={{ 
        display: 'flex', 
        gap: '10px', 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        marginBottom: '40px' 
      }}>
        <input 
          type="text" 
          placeholder="Job title or keyword..." 
          style={{ flex: 2, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          value={filters.keyword}
          onChange={(e) => setFilters({...filters, keyword: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Location..." 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        />
        <button type="submit" className="btn-purple" style={{ padding: '0 30px' }}>Search</button>
      </form>

      {/* JOB GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading opportunities...</p>
        </div>
      ) : (
        <div className="job-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
        }}>
          {jobs.map((job) => (
            <div key={job.id} className="job-card" style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase' }}>
                    {job.category || 'General'}
                </span>
                <h3 style={{ margin: '10px 0 5px 0', color: '#1e293b' }}>{job.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{job.company} • {job.location}</p>
              </div>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>
                    {job.salary_max ? `$${job.salary_max.toLocaleString()}` : 'Salary N/A'}
                </span>
                
                {/* CRITICAL FIX VERIFIED: 
                   Uses backticks (`) and template literal ${job.id} 
                   This generates "/job/1" instead of "/job/:id"
                */}
                <Link to={`/job/${job.id}`} className="btn-details" style={{ 
                  textDecoration: 'none', 
                  color: '#6366f1', 
                  fontWeight: 600,
                  fontSize: '0.9rem' 
                }}>
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && jobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '12px' }}>
          <p style={{ color: '#64748b' }}>No jobs found matching your criteria.</p>
          <button onClick={() => { setFilters({keyword:'', location:'', category:''}); fetchJobs(); }} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;