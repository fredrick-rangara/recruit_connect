import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for search, location, category, and salary filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: 'Choose city',
    categories: [],
    salary: 100000 // Default slider value
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle category in the filters state
  const handleCategoryChange = (cat) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  // Logic to filter the jobs list based on user input
  const filteredJobs = jobs.filter(job => {
    const matchesTitle = job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesLocation = filters.location === 'Choose city' || job.location === filters.location;
    
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(job.category);
    
    // Checks if job salary falls within the slider range (assuming backend provides salary_max)
    const matchesSalary = (job.salary_max || 200000) <= filters.salary;

    return matchesTitle && matchesLocation && matchesCategory && matchesSalary;
  });

  if (loading) return <div className="container">Loading Jobs...</div>;

  return (
    <div className="browse-jobs-container">
      {/* Figma Dark Header Section */}
      <header className="page-hero">
        <div className="container">
          <h1>Jobs</h1>
        </div>
      </header>

      <div className="container main-layout">
        {/* SIDEBAR FILTERS */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h4>Search by Job Title</h4>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Job title or company" 
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              />
            </div>
          </div>

          <div className="filter-group">
            <h4>Location</h4>
            <select 
              className="filter-select"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            >
              <option value="Choose city">Choose city</option>
              <option value="New York, USA">New York, USA</option>
              <option value="Los Angeles, USA">Los Angeles, USA</option>
              <option value="Nairobi, Kenya">Nairobi, Kenya</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            {['Commerce', 'Telecommunications', 'Hotels & Tourism', 'Education', 'Financial Services'].map(cat => (
              <label key={cat} className="checkbox-item">
                <div className="check-label">
                  <input 
                    type="checkbox" 
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  /> 
                  <span>{cat}</span>
                </div>
                <span className="count">10</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Salary: $0 - ${filters.salary.toLocaleString()}</h4>
            <input 
              type="range" 
              min="10000" 
              max="200000" 
              step="5000"
              value={filters.salary} 
              onChange={(e) => setFilters({...filters, salary: parseInt(e.target.value)})}
              className="salary-slider"
            />
            <button className="btn-apply-filters" onClick={() => console.log("Filters active")}>Apply</button>
          </div>

          <button className="btn-show-more">Show More</button>
        </aside>

        {/* JOB LISTINGS FEED */}
        <main className="jobs-feed">
          <div className="feed-header">
            <span>Showing 1–{filteredJobs.length} of {jobs.length} results</span>
            <select className="sort-select">
              <option>Sort by latest</option>
            </select>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="no-results">No jobs match your current filters.</div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-card-figma">
                <div className="job-card-header">
                  <span className="time-posted">10 min ago</span>
                  <span className="bookmark-icon">🔖</span>
                </div>
                
                <div className="job-card-body">
                  <div className="company-logo-placeholder">
                    <div className={`logo-circle color-${(job.id % 4) + 1}`}></div>
                  </div>
                  
                  <div className="job-info-main">
                    <h3>{job.title}</h3>
                    <p className="company-subtext">{job.company}</p>
                    
                    <div className="job-meta-tags">
                      <span>💼 {job.category || 'General'}</span>
                      <span>🕒 Full Time</span>
                      <span>💰 ${job.salary_max?.toLocaleString() || '45,000'}</span>
                      <span>📍 {job.location}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-job-details"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    Job Details
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default JobList;