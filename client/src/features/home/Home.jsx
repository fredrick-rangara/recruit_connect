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
    </div>
  );
};

export default Home;
