import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="job-card" style={{ 
      padding: '20px', 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      background: 'white' 
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{job.title}</h3>
      <p style={{ color: '#64748b' }}>{job.company} • {job.location}</p>
      
      {/* CRITICAL FIX: 
          Using backticks (`) and ${job.id} ensures the URL is /job/5 
          instead of the literal string /job/:id 
      */}
      <Link 
        to={`/job/${job.id}`} 
        className="btn-details"
        style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}
      >
        View Details →
      </Link>
    </div>
  );
};

export default JobCard;