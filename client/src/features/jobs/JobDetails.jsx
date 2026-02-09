import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs`); 
        const selectedJob = response.data.find(j => j.id === parseInt(id));
        setJob(selectedJob);
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    if (!resume) return setMessage({ type: 'error', text: 'Please upload your CV before applying.' });

    setApplying(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/applications', {
        job_id: job.id,
        resume_url: resume.name, 
      });
      setMessage({ type: 'success', text: 'Application submitted! Redirecting...' });
      setTimeout(() => navigate('/seeker/dashboard'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || "Application failed." });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container"><p>Loading details...</p></div>;
  if (!job) return <div className="container"><p>Job not found.</p></div>;

  return (
    <div className="container job-details-page">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back to Listings</button>
      
      <div className="job-card-large">
        <div className="job-header">
          <div className="header-main">
            <h1>{job.title}</h1>
            <span className="status-pill interviewing">Active</span>
          </div>
          <div className="header-sub">
            <span className="company-name">{job.company}</span>
            <span className="location-tag">📍 {job.location}</span>
          </div>
          
          {/* New Figma-style Metadata Tags */}
          <div className="job-meta-tags-large">
            <span className="meta-item">💼 {job.category || 'General'}</span>
            <span className="meta-item">💰 Up to ${job.salary_max?.toLocaleString()}</span>
            <span className="meta-item">🕒 Full Time</span>
          </div>
        </div>

        <hr />

        <div className="job-content-grid">
          <div className="description-box">
            <h3>Job Description</h3>
            <p>{job.description}</p>
            
            <h3>Key Requirements</h3>
            <ul>
              <li>Experience in {job.category || 'related field'}.</li>
              <li>Excellent communication and teamwork skills.</li>
              <li>Ability to work in {job.location}.</li>
            </ul>
          </div>

          <aside className="apply-sidebar">
            {role === 'job_seeker' || !isAuthenticated ? (
              <div className="apply-section-box">
                <h3>Quick Apply</h3>
                <p>Upload your CV to send your application to <strong>{job.company}</strong>.</p>
                
                <form onSubmit={handleApply}>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      id="cv-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files[0])}
                      hidden
                    />
                    <label htmlFor="cv-upload" className="file-label-modern">
                      {resume ? `📄 ${resume.name}` : "📁 Click to upload CV"}
                    </label>
                  </div>

                  {message.text && (
                    <div className={`alert ${message.type}`}>
                      {message.text}
                    </div>
                  )}

                  <button type="submit" className="btn-apply-now" disabled={applying}>
                    {applying ? "Submitting..." : "Apply Now"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="employer-view-note">
                <p>You are viewing this as an <strong>Employer</strong>. You can edit this listing from your dashboard.</p>
                <button className="btn-secondary" onClick={() => navigate('/employer/dashboard')}>Go to Dashboard</button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;