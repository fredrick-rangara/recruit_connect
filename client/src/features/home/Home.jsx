import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

/**
 * Home Component: The landing page of RecruitConnect.
 */
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${searchTerm}`);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Connecting Talent with Opportunity</h1>
        <p className="hero-subtitle">
          Your journey to a better career or a better team starts here. 
          Discover thousands of job opportunities or find the perfect candidate today.
        </p>

        {/* Hero Search Bar */}
        <form className="hero-search" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Job title, keywords, or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="hero-search-btn">Search Jobs</button>
        </form>

        {/* Hero CTAs */}
        <div className="hero-ctas">
          <Link to="/signup?type=job_seeker" className="cta-btn primary">I'm a Job Seeker</Link>
          <Link to="/signup?type=employer" className="cta-btn secondary">I'm an Employer</Link>
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="featured-jobs">
        <div className="section-header">
          <h2 className="section-title">Featured Opportunities</h2>
          <Link to="/jobs" className="view-all-link">View all jobs →</Link>
        </div>
        
        <div className="jobs-grid">
          {[
            { id: 1, title: 'Senior Frontend Developer', company: 'TechFlow', location: 'Remote', salary: '$120k - $150k', type: 'Full-time' },
            { id: 2, title: 'Product Designer', company: 'CreativeMind', location: 'New York, NY', salary: '$90k - $130k', type: 'Full-time' },
            { id: 3, title: 'Backend Engineer', company: 'DataScale', location: 'Austin, TX', salary: '$110k - $140k', type: 'Contract' },
          ].map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <div className="company-logo-placeholder">{job.company[0]}</div>
                <span className="job-type-tag">{job.type}</span>
              </div>
              <h3 className="job-card-title">{job.title}</h3>
              <p className="job-card-company">{job.company}</p>
              <div className="job-card-footer">
                <span className="job-location">📍 {job.location}</span>
                <span className="job-salary">{job.salary}</span>
              </div>
              <button className="apply-btn">Quick Apply</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
