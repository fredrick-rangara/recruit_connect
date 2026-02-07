import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../services/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please login as a Job Seeker to apply.");
      return navigate('/login');
    }

    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Application submitted successfully! Check your dashboard for updates.");
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong. Have you already applied?");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Loading job details...</div>;
  if (!job) return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Job not found.</div>;

  return (
    <div className="page-bg">
      {/* JOB HEADER */}
      <header className="hero-section" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn-reset" style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            ← Back to jobs
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div className="job-card-content">
              <div className="company-logo-placeholder" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                {job.company ? job.company[0] : 'J'}
              </div>
              <div>
                <h1 style={{fontSize: '2.5rem', marginBottom: '5px'}}>{job.title}</h1>
                <p className="job-meta" style={{fontSize: '1.2rem'}}>{job.company} • {job.location}</p>
              </div>
            </div>
            <div className="tag-container">
               <span className="status-pill" style={{fontSize: '1rem', padding: '10px 20px'}}>
                  💰 ${job.salary_max?.toLocaleString()} / year
               </span>
            </div>
          </div>
        </div>
      </header>

      {/* JOB BODY */}
      <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
        <div className="home-grid">
          
          {/* LEFT: Description */}
          <main className="job-description-content">
            <section style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h3 className="sidebar-title">About the role</h3>
              <p style={{ whiteSpace: 'pre-line', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                {job.description}
              </p>
              
              <h3 className="sidebar-title" style={{marginTop: '40px'}}>Key Details</h3>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
                <li style={{ marginBottom: '10px' }}>Category: {job.category}</li>
                <li style={{ marginBottom: '10px' }}>Location: {job.location}</li>
                <li style={{ marginBottom: '10px' }}>Work Mode: On-site / Remote-friendly</li>
              </ul>
            </section>
          </main>

          {/* RIGHT: Quick Apply Sidebar */}
          <aside className="apply-sidebar">
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'sticky', top: '20px' }}>
              <h3 className="sidebar-title">Interested?</h3>
              <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '25px'}}>
                Post date: {new Date().toLocaleDateString()}
              </p>
              
              <button 
                className="btn-purple" 
                style={{marginBottom: '15px'}}
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Sending..." : "Apply Now"}
              </button>
              
              <button className="btn-outline" style={{width: '100%'}}>Save Job</button>
              
              <hr style={{margin: '25px 0', border: 'none', borderTop: '1px solid var(--border-color)'}} />
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Job Type</span>
                <p style={{ fontWeight: '500' }}>Full-time</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Category</span>
                <p style={{ fontWeight: '500' }}>{job.category}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;