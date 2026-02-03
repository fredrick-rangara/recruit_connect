import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import './JobDetails.css';

/**
 * JobDetails Component: Displays exhaustive information about a specific job.
 */
const JobDetails = () => {
  const { id } = useParams();
  const [showApplyForm, setShowApplyForm] = useState(false);

  // Mock data for a single job - in a real app, this would be fetched based on 'id'
  const job = {
    id: id,
    title: 'Senior Frontend Developer',
    company: 'TechFlow',
    location: 'Remote',
    salary: '$120k - $150k',
    type: 'Full-time',
    postedDate: 'Oct 15, 2023',
    description: 'We are looking for a Senior Frontend Developer to lead our client-side development. You will be responsible for building high-quality, scalable web applications using React and modern frontend tools.',
    responsibilities: [
      'Lead a team of frontend engineers to deliver high-quality UI/UX.',
      'Architect scalable frontend solutions using React and Redux.',
      'Collaborate with designers and backend developers to implement new features.',
      'Mentor junior developers and perform code reviews.'
    ],
    requirements: [
      '5+ years of experience in JavaScript/TypeScript and React.',
      'Strong understanding of design patterns and state management.',
      'Experience with modern styling tools like CSS Modules or Tailwind.',
      'Excellent communication and leadership skills.'
    ],
    companyInfo: 'TechFlow is a leading technology company focused on providing innovative solutions for the modern workplace. We value creativity, collaboration, and continuous learning.'
  };

  return (
    <div className="job-details-container">
      <nav className="breadcrumb">
        <Link to="/jobs">Back to Job Board</Link>
      </nav>

      <div className="job-details-layout">
        <div className="job-details-main">
          {/* Header Section */}
          <section className="job-header-card">
            <div className="header-top">
              <div className="company-logo-xl">{job.company[0]}</div>
              <div className="header-meta">
                <span className="job-type-pill">{job.type}</span>
                <span className="posted-on">Posted on {job.postedDate}</span>
              </div>
            </div>
            <h1 className="job-title-xl">{job.title}</h1>
            <p className="job-company-location">{job.company} • {job.location}</p>
            
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-text">
                  <label>Salary</label>
                  <span>{job.salary}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-text">
                  <label>Job Type</label>
                  <span>{job.type}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="details-section">
            <h2 className="details-title">About the Role</h2>
            <p className="details-content">{job.description}</p>
          </section>

          {/* Responsibilities Section */}
          <section className="details-section">
            <h2 className="details-title">Key Responsibilities</h2>
            <ul className="details-list">
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Requirements Section */}
          <section className="details-section">
            <h2 className="details-title">Requirements</h2>
            <ul className="details-list">
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar / Action Area */}
        <aside className="job-details-sidebar">
          <div className="apply-card">
            <h3>Interested in this role?</h3>
            <p>Apply now and take the next step in your career with {job.company}.</p>
            <button 
              className="apply-now-main-btn"
              onClick={() => setShowApplyForm(true)}
            >
              Apply Now
            </button>
            <button className="save-job-btn">Save for Later</button>
          </div>

          <div className="company-brief-card">
            <h3>About {job.company}</h3>
            <p>{job.companyInfo}</p>
            <Link to={`/company/${job.company.toLowerCase()}`} className="view-company-link">View Company Profile</Link>
          </div>
        </aside>
      </div>

      {/* Application Modal Overlay */}
      {showApplyForm && (
        <div className="modal-overlay">
          <ApplicationForm 
            jobTitle={job.title} 
            company={job.company} 
            onClose={() => setShowApplyForm(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default JobDetails;
