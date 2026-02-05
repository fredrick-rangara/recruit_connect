import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [category, keyword, location]);

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/jobs?keyword=${keyword}&category=${category}&location=${location}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  const resetSearch = () => {
    setKeyword('');
    setCategory('');
    setLocation('');
  };

  return (
    <div className="page-bg">
      <header className="hero-section">
        <div className="container">
          <div className="page-hero">
            <h1>Find your next great opportunity</h1>
            <p className="text-muted">Browse thousands of jobs from top-tier companies</p>
          </div>

          {/* Optimized Search Bar */}
          <div className="search-bar-container">
            <div className="search-field">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="Job title or keyword" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} 
              />
            </div>
            <div className="search-field">
              <span>📍</span>
              <input 
                type="text" 
                placeholder="City or state" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', padding: '5px' }}>
              <button className="btn-purple" style={{ width: '120px' }}>Search</button>
              {(keyword || category || location) && (
                <button onClick={resetSearch} className="btn-outline" style={{ padding: '10px' }}>Reset</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Horizontal Category Selection (Clean Pills) */}
        <section style={{ margin: '40px 0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '15px' }}>Browse by Category</h3>
          <div className="category-pills">
            {['Technology', 'Marketing', 'Design', 'Commerce'].map(cat => (
              <label key={cat}>
                <input 
                  type="radio" 
                  name="category"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Job Feed */}
        <main className="job-feed" style={{ marginTop: '20px' }}>
          {jobs.length > 0 ? jobs.map(job => (
            <div key={job.id} className="stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div className="company-logo-placeholder">
                  {job.company ? job.company[0] : 'J'}
                </div>
                <div>
                  <h3 style={{ marginBottom: '4px', fontWeight: 700 }}>{job.title}</h3>
                  <p className="text-muted">{job.company} • {job.location}</p>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <span className="status-pill">💰 ${job.salary_max?.toLocaleString() || 'N/A'}</span>
                    <span className="status-pill">🏷️ {job.category}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                to={`/jobs/${job.id}`} 
                className="btn-purple"
                style={{ width: 'auto', textDecoration: 'none', padding: '12px 24px' }}
              >
                Details
              </Link>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-gray)', borderRadius: '20px' }}>
              <p className="text-muted">No jobs found matching your criteria.</p>
              <button onClick={resetSearch} className="purple-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, marginTop: '10px' }}>
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;