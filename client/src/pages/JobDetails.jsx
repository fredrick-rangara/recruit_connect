import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../services/api";
import { mockJobs } from "../data/mockJobs"; // Import mockJobs for fallback

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        // 1. Try fetching from Backend first
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.warn("Backend fetch failed, checking mock data...");
        // 2. FALLBACK: Look in mockJobs if backend fails or isn't seeded
        // Standardizing IDs to strings for a safe comparison
        const foundMock = mockJobs.find((j) => String(j.id) === String(id));
        if (foundMock) {
          setJob(foundMock);
        }
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
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong. Have you already applied?");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Loading job details...</div>;
  
  if (!job) return (
    <div className="container" style={{padding: '100px', textAlign: 'center'}}>
      <h2>Job not found.</h2>
      <button onClick={() => navigate('/')} className="btn-purple" style={{marginTop: '20px', width: 'auto'}}>Return Home</button>
    </div>
  );

  return (
    <div className="page-bg" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* JOB HEADER */}
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '60px 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <button onClick={() => navigate(-1)} style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'none', border: 'none', color: '#7c3aed', fontWeight: '600', fontSize: '1rem'}}>
            ← Back to listings
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{width: '80px', height: '80px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#7c3aed', color: 'white', borderRadius: '16px', fontWeight: 'bold'}}>
                {job.company ? job.company[0] : 'J'}
              </div>
              <div>
                <h1 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px'}}>{job.title}</h1>
                <p style={{fontSize: '1.25rem', color: '#64748b', fontWeight: '500'}}>{job.company} • {job.location}</p>
              </div>
            </div>
            <div>
               <span style={{fontSize: '1.1rem', padding: '12px 24px', background: '#f5f3ff', color: '#7c3aed', borderRadius: '12px', fontWeight: '700', border: '1px solid #ddd6fe'}}>
                  💰 ${job.salary_max?.toLocaleString() || job.salary?.toLocaleString()} / year
               </span>
            </div>
          </div>
        </div>
      </header>

      {/* JOB BODY */}
      <div className="container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', paddingBottom: '100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 320px', gap: '40px' }}>
          
          <main>
            <section style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#1e293b'}}>Description</h3>
              <p style={{ whiteSpace: 'pre-line', color: '#475569', lineHeight: '1.8', fontSize: '1.05rem' }}>
                {job.description}
              </p>
              
              <h3 style={{marginTop: '48px', marginBottom: '24px', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b'}}>Requirements</h3>
              <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: '2' }}>
                <li>Category: {job.category}</li>
                <li>Work Location: {job.location}</li>
                <li>Job Type: Full-time</li>
              </ul>
            </section>
          </main>

          <aside>
            <div style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', position: 'sticky', top: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              {applied ? (
                <div style={{ padding: "20px", background: "#f0fdf4", color: "#166534", borderRadius: "12px", textAlign: 'center', fontWeight: '600', border: '1px solid #bbf7d0' }}>
                  ✅ Application Sent!
                </div>
              ) : (
                <>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: '#1e293b'}}>Ready to apply?</h3>
                  <p style={{fontSize: '0.9rem', marginBottom: '24px', color: '#64748b'}}>
                    Apply today and start your next chapter.
                  </p>
                  
                  <button 
                    className="btn-purple" 
                    style={{width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s'}}
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? "Processing..." : "Submit Application"}
                  </button>
                  
                  <button style={{width: '100%', marginTop: '12px', padding: '16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', color: '#475569', fontWeight: '600'}}>
                    Save for later
                  </button>
                </>
              )}
              
              <div style={{ marginTop: '32px', pt: '32px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ marginBottom: '16px', marginTop: '24px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Industry</span>
                  <p style={{ fontWeight: '600', color: '#334155' }}>{job.category}</p>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Posted On</span>
                  <p style={{ fontWeight: '600', color: '#334155' }}>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;