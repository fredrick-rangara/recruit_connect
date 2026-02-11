import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-hot-toast';

function JobCard({ job }) {
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await API.post('/jobs/save', { job_id: job.id });
      toast.success('Job saved successfully!');
    } catch (err) {
      toast.error('Could not save job or already saved.');
    }
  };

  return (
    <div className="horizontal-job-card" style={{ position: 'relative' }}>
      {/* Bookmark Icon */}
      <button 
        onClick={handleSave}
        className="btn"
        style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            background: 'transparent', 
            border: 'none', 
            fontSize: '1.5rem', 
            cursor: 'pointer',
            color: '#cbd5e1'
        }}
        title="Save Job"
      >
        📑
      </button>

      <div className="job-main-info">
        <div className="company-logo-placeholder">
          {job.company?.name?.charAt(0).toUpperCase() || 'J'}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
            {job.title}
          </h3>
          <p style={{ margin: '4px 0 10px', color: '#666', fontSize: '0.95rem' }}>
            {job.company?.name || 'RecruitConnect Partner'}
          </p>
          <div className="job-details-meta">
            <div className="job-meta-item" style={{ background: '#f5f5f5', padding: '4px 12px', borderRadius: '20px', color: '#444' }}>
              <span style={{ marginRight: '5px' }}>🏢</span> {job.category || 'Engineering'}
            </div>
            <div className="job-meta-item">
              <span style={{ marginRight: '5px' }}>🕒</span> Full Time
            </div>
            <div className="job-meta-item">
              <span style={{ marginRight: '5px' }}>💰</span> {job.salary_range || '$80k - $120k'}
            </div>
            <div className="job-meta-item">
              <span style={{ marginRight: '5px' }}>📍</span> {job.location || 'Remote'}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate(`/jobs/${job.id}`)}
            style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '700' }}
          >
            Job Details
          </button>
      </div>
    </div>
  );
}

export default JobCard;
