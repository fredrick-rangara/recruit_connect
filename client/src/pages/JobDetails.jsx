import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../services/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false); // Combined from both versions

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

  const handleApply = async (e) => {
    if (e) e.preventDefault();
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
      setApplied(true);
      // Optional: Navigate home after 3 seconds like in main
      setTimeout(() => navigate("/"), 3000);
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
      <header className="hero-section" style={{ borderBottom: '1px solid var(--border-color)', padding: '40px 0', background: '#fcfcfc' }}>
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn-reset" style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: 'none', border: 'none', color: '#7c3aed'}}>
            ← Back to jobs
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div className="company-logo-placeholder" style={{width: '80px', height: '80px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#7c3aed', color: 'white', borderRadius: '12px'}}>
                {job.company ? job.company[0] : 'J'}
              </div>
              <div>
                <h1 style={{fontSize: '2.5rem', marginBottom: '5px'}}>{job.title}</h1>
                <p className="job-meta" style={{fontSize: '1.2rem', color: '#666'}}>{job.company} • {job.location}</p>
              </div>
            </div>
            <div className="tag-container">
               <span className="status-pill" style={{fontSize: '1rem', padding: '10px 20px', background: '#ede9fe', color: '#7c3aed', borderRadius: '20px', fontWeight: 'bold'}}>
                  💰 ${job.salary_max?.toLocaleString()} / year
               </span>
            </div>
          </div>
        </div>
      </header>

      {/* JOB BODY */}
      <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          
          {/* LEFT: Description */}
          <main className="job-description-content">
            <section style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #eee' }}>
              <h3 style={{marginBottom: '20px'}}>About the role</h3>
              <p style={{ whiteSpace: 'pre-line', color: '#4b5563', lineHeight: '1.8' }}>
                {job.description}
              </p>
              
              <h3 style={{marginTop: '40px', marginBottom: '20px'}}>Key Details</h3>
              <ul style={{ paddingLeft: '20px', color: '#4b5563' }}>
                <li style={{ marginBottom: '10px' }}>Category: {job.category}</li>
                <li style={{ marginBottom: '10px' }}>Location: {job.location}</li>
                <li style={{ marginBottom: '10px' }}>Work Mode: On-site / Remote-friendly</li>
              </ul>
            </section>
          </main>

          {/* RIGHT: Quick Apply Sidebar */}
          <aside className="apply-sidebar">
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #eee', position: 'sticky', top: '20px' }}>
              {applied ? (
                <div style={{ padding: "20px", background: "#d4edda", color: "#155724", borderRadius: "10px", textAlign: 'center' }}>
                  🎉 Success! Your application has been submitted.
                </div>
              ) : (
                <>
                  <h3 style={{marginBottom: '10px'}}>Interested?</h3>
                  <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '25px', color: '#94a3b8'}}>
                    Post date: {new Date().toLocaleDateString()}
                  </p>
                  
                  <button 
                    className="btn-purple" 
                    style={{width: '100%', padding: '15px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px'}}
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? "Sending..." : "Apply Now"}
                  </button>
                  
                  <button style={{width: '100%', padding: '15px', background: 'white', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer'}}>Save Job</button>
                </>
              )}
              
              <hr style={{margin: '25px 0', border: 'none', borderTop: '1px solid #eee'}} />
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Job Type</span>
                <p style={{ fontWeight: '500' }}>Full-time</p>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Category</span>
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