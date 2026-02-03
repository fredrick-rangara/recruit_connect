import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

/**
 * Home Component: The landing page of RecruitConnect.
 */
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock featured jobs to avoid 'undefined' error
  const featuredJobs = [
    { id: 1, title: 'Senior Frontend Developer', company: 'TechFlow', location: 'Remote', salary: '$120k', type: 'Full-time' },
    { id: 2, title: 'Product Designer', company: 'CreativeMind', location: 'New York, NY', salary: '$100k', type: 'Full-time' },
    { id: 3, title: 'Backend Engineer', company: 'DataScale', location: 'Austin, TX', salary: '$130k', type: 'Contract' },
  ];

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
          <Link to="/jobs" className="view-all-link">View all jobs</Link>
        </div>
        
        <div className="jobs-grid">
          {featuredJobs.map(job => (
            <div key={job.id} className="job-card-mini">
              <div className="company-logo">{job.company[0]}</div>
              <div className="job-info">
                <h3>{job.title}</h3>
                <p>{job.company} • {job.location}</p>
              </div>
              <Link to={`/jobs/${job.id}`} className="apply-btn">View Role</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-proposition">
        <h2 className="section-title text-center">Why RecruitConnect?</h2>
        <div className="value-grid">
          <div className="value-item">
            <div className="value-content">
              <h3>Verified Listings</h3>
              <p>Every single job on our platform is manually verified to ensure high quality and zero spam.</p>
            </div>
          </div>
          <div className="value-item">
            <div className="value-content">
              <h3>Direct Access</h3>
              <p>Skip the noise and connect directly with hiring managers at companies you love.</p>
            </div>
          </div>
          <div className="value-item">
            <div className="value-content">
              <h3>Global Network</h3>
              <p>Find opportunities across the globe or within your local community with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bottom-cta">
        <div className="cta-card">
          <h2>Ready to transform your career?</h2>
          <p>Join RecruitConnect today and start reaching your full professional potential.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="primary-cta">Get Started</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
