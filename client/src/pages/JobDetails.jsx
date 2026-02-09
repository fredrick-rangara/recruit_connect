import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../services/api";
import { mockJobs } from "../data/mockJobs"; 

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      // Safety: Prevent fetching if the route hasn't resolved the ID yet
      if (!id || id === ":id") {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Attempt to fetch from your Flask Backend
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.warn("Backend fetch failed, checking mock data...");
        // 2. FALLBACK: Look in mock data if backend returns 404 or is down
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
      // Matches your Flask route: @app.route('/apply/<int:job_id>', methods=['POST'])
      await api.post(`/apply/${id}`);
      
      setApplied(true);
      setTimeout(() => navigate("/seeker/dashboard"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "You have already applied for this position.";
      alert(errorMsg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading job details...</div>;
  
  if (!job) return (
    <div style={{padding: '100px', textAlign: 'center'}}>
      <h2>Job not found.</h2>
      <button onClick={() => navigate('/jobs')} className="btn-purple" style={{marginTop: '20px'}}>
        Browse Other Jobs
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* HEADER SECTION */}
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '60px 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{marginBottom: '24px', cursor: 'pointer', background: 'none', border: 'none', color: '#6366f1', fontWeight: '600'}}
          >
            ← Back to listings
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#6366f1', color: 'white', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 'bold'}}>
                {job.company ? job.company[0] : 'J'}
              </div>
              <div>
                <h1 style={{fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0}}>{job.title}</h1>
                <p style={{fontSize: '1.1rem', color: '#64748b'}}>{job.company} • {job.location}</p>
              </div>
            </div>
            <span style={{padding: '12px 20px', background: '#f5f3ff', color: '#6366f1', borderRadius: '10px', fontWeight: '700'}}>
              💰 ${job.salary_max?.toLocaleString() || "Market Rate"}
            </span>
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <div className="container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 300px', gap: '40px' }}>
          
          <main style={{ background: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <h3 style={{marginBottom: '20px'}}>Description</h3>
            <p style={{ whiteSpace: 'pre-line', color: '#475569', lineHeight: '1.7' }}>
              {job.description}
            </p>
            
            <h3 style={{marginTop: '40px', marginBottom: '20px'}}>Requirements</h3>
            <ul style={{ color: '#475569', lineHeight: '2' }}>
              <li>Professional experience in {job.category || 'this field'}.</li>
              <li>Strong problem-solving skills and attention to detail.</li>
              <li>Ability to work effectively in a {job.location}-based team.</li>
            </ul>
          </main>

          <aside>
            <div style={{ background: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '20px' }}>
              {applied ? (
                <div style={{ padding: "15px", background: "#f0fdf4", color: "#166534", borderRadius: "8px", textAlign: 'center', fontWeight: '600' }}>
                  ✅ Applied!
                </div>
              ) : (
                <>
                  <h4 style={{margin: '0 0 10px 0'}}>Interested?</h4>
                  <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '20px'}}>Apply now to share your profile with the employer.</p>
                  
                  <button 
                    onClick={handleApply}
                    disabled={applying}
                    style={{width: '100%', padding: '14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', background: '#6366f1', color: 'white', border: 'none'}}
                  >
                    {applying ? "Processing..." : "Apply Now"}
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;