import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

/**
 * JobCard Component: Displays detailed information about a job listing.
 */
const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job.id}`} className="job-card-link">
      <div className="job-card-premium">
        <div className="job-card-top">
        <div className="company-logo-large">{job.company[0]}</div>
        <div className="job-meta">
          <span className="posted-date">2 days ago</span>
          <span className="job-type-badge">{job.type}</span>
        </div>
      </div>
      
      <div className="job-card-content">
        <h3 className="job-title-text">{job.title}</h3>
        <p className="job-company-info">{job.company} | {job.location}</p>
        
        <div className="job-tags">
          {job.tags?.map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          )) || <span className="tag-pill">New Opportunity</span>}
        </div>
      </div>

      <div className="job-card-bottom">
        <div className="salary-info">
          <span className="salary-amount">{job.salary}</span>
          <span className="salary-period">/ year</span>
        </div>
        <button className="apply-now-btn">Apply Now</button>
      </div>
    </div>
    </Link>
  );
};

export default JobCard;
