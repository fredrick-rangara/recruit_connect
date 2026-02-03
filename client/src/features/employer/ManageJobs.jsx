import React from 'react';
import { Link } from 'react-router-dom';
import './ManageJobs.css';

/**
 * ManageJobs: A centralized view for employers to manage all their job postings.
 */
const ManageJobs = () => {
  // Mock data for postings
  const postings = [
    { id: 1, title: 'Senior Frontend Developer', category: 'Engineering', applicants: 18, status: 'Active', postedDate: 'Jan 15, 2024' },
    { id: 2, title: 'UI/UX Product Designer', category: 'Design', applicants: 42, status: 'Active', postedDate: 'Jan 28, 2024' },
    { id: 3, title: 'Growth Marketing Manager', category: 'Marketing', applicants: 5, status: 'Draft', postedDate: 'Feb 02, 2024' },
  ];

  return (
    <div className="manage-jobs-container">
      <header className="page-header-flex">
        <div>
          <h1>Active Job Postings</h1>
          <p>You have {postings.filter(p => p.status === 'Active').length} active roles reaching candidates.</p>
        </div>
        <Link to="/employer/post-job" className="primary-action-btn">Post New Job</Link>
      </header>

      <div className="postings-list">
        <div className="postings-table-header">
          <div className="col-job">Job Posting</div>
          <div className="col-applicants text-center">Applicants</div>
          <div className="col-status text-center">Status</div>
          <div className="col-actions text-right">Actions</div>
        </div>

        {postings.map((job) => (
          <div key={job.id} className="posting-row">
            <div className="col-job">
              <h3 className="job-title">{job.title}</h3>
              <span className="job-meta-details">{job.category} | Posted on {job.postedDate}</span>
            </div>
            
            <div className="col-applicants text-center">
              <span className="applicant-count">{job.applicants}</span>
              <p className="subtext">candidates</p>
            </div>
            
            <div className="col-status text-center">
              <span className={`status-badge ${job.status.toLowerCase()}`}>
                {job.status}
              </span>
            </div>
            
            <div className="col-actions text-right">
              <Link to={`/employer/candidates?jobId=${job.id}`} className="view-applicants-link">View Pipeline</Link>
              <button className="more-options-btn">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageJobs;
