import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api'; // FIXED: Only one '../' because we are in /pages

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
      // Safety check: Don't fetch if the ID is literally ":id"
      if (!id || id === ":id") return;

      try {
        // FIXED: Hit the specific backend route /jobs/<id>
        const response = await api.get(`/jobs/${id}`); 
        setJob(response.data);
      } catch (err) {
        console.error("Error fetching job details", err);
        setMessage({ type: 'error', text: 'Could not load job details.' });
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
      // Note: In a real app, you'd likely use FormData for file uploads
      await api.post('/applications', {
        job_id: job.id,
        resume_name: resume.name, 
      });
      setMessage({ type: 'success', text: 'Application submitted! Redirecting...' });
      setTimeout(() => navigate('/seeker/dashboard'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || "Application failed." });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container" style={{padding: '100px', textAlign: 'center'}}><p>Loading details...</p></div>;
  
  if (!job) return (
    <div className="container" style={{padding: '100px', textAlign: 'center'}}>
      <h2>Job not found</h2>
      <button className="btn-purple" onClick={() => navigate('/jobs')}>Back to Listings</button>
    </div>
  );

  return (
    <div className="container job-details-page" style={{ padding: '40px 20px' }}>
      <button className="btn-back" onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        ← Back to Listings
      </button>
      
      <div className="job-card-large" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div className="job-header">
          <div className="header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>{job.title}</h1>
            <span className="status-pill interviewing" style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Active
            </span>
          </div>
          <div className="header-sub" style={{ marginTop: '10px', color: '#64748b' }}>
            <span className="company-name" style={{ fontWeight: 'bold' }}>{job.company}</span>
            <span style={{ margin: '0 10px' }}>•</span>
            <span className="location-tag">📍 {job.location}</span>
          </div>
          
          <div className="job-meta-tags-large" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <span className="meta-item" style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>
              💼 {job.category || 'General'}
            </span>
            <span className="meta-item" style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>
              💰 {job.salary_max ? `Up to $${job.salary_max.toLocaleString()}` : 'Salary Negotiable'}
            </span>
            <span className="meta-item" style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>
              🕒 Full Time
            </span>
          </div>
        </div>

        <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #e2e8f0' }} />

        <div className="job-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <div className="description-box">
            <h3 style={{ marginBottom: '15px' }}>Job Description</h3>
            <p style={{ lineHeight: '1.6', color: '#334155' }}>{job.description}</p>
            
            <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Key Requirements</h3>
            <ul style={{ lineHeight: '1.8', color: '#334155' }}>
              <li>Experience in {job.category || 'related field'}.</li>
              <li>Excellent communication and teamwork skills.</li>
              <li>Ability to work in {job.location}.</li>
            </ul>
          </div>

          <aside className="apply-sidebar">
            {role === 'job_seeker' || !isAuthenticated ? (
              <div className="apply-section-box" style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginTop: 0 }}>Quick Apply</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                  Upload your CV to send your application to <strong>{job.company}</strong>.
                </p>
                
                <form onSubmit={handleApply}>
                  <div className="file-upload-box" style={{ marginBottom: '20px' }}>
                    <input 
                      type="file" 
                      id="cv-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files[0])}
                      hidden
                    />
                    <label htmlFor="cv-upload" style={{ 
                      display: 'block', 
                      padding: '15px', 
                      border: '2px dashed #cbd5e1', 
                      borderRadius: '8px', 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      background: '#fff'
                    }}>
                      {resume ? `📄 ${resume.name}` : "📁 Click to upload CV"}
                    </label>
                  </div>

                  {message.text && (
                    <div className={`alert ${message.type}`} style={{ 
                      padding: '10px', 
                      borderRadius: '6px', 
                      marginBottom: '15px',
                      fontSize: '0.85rem',
                      backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                      color: message.type === 'success' ? '#166534' : '#991b1b'
                    }}>
                      {message.text}
                    </div>
                  )}

                  <button type="submit" className="btn-purple" disabled={applying} style={{ width: '100%', padding: '12px' }}>
                    {applying ? "Submitting..." : "Apply Now"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="employer-view-note" style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  You are viewing this as an <strong>Employer</strong>. You can edit this listing from your dashboard.
                </p>
                <button className="btn-secondary" onClick={() => navigate('/employer/dashboard')} style={{ width: '100%', marginTop: '10px' }}>
                  Go to Dashboard
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;