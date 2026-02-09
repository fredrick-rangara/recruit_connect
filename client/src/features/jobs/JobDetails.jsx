import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const JobDetails = () => {
  const { id } = useParams(); // Gets the number from the URL
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchJob = async () => {
      // Safety check: ensure 'id' is a number and not the string ":id"
      if (!id || id === ":id") return;

      try {
        // Hits @app.route('/jobs/<int:job_id>') in Flask
        const response = await api.get(`/jobs/${id}`); 
        setJob(response.data);
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) return navigate('/login');
    
    setApplying(true);
    try {
      // Hits @app.route('/apply/<int:job_id>') in Flask
      await api.post(`/apply/${id}`);
      setMessage({ type: 'success', text: 'Application submitted!' });
      setTimeout(() => navigate('/seeker/dashboard'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || "Failed to apply." });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading details...</div>;
  if (!job) return <div style={{ padding: '100px', textAlign: 'center' }}>Job not found.</div>;

  return (
    <div className="container" style={{ padding: '40px' }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <div className="job-card-large" style={{ marginTop: '20px', padding: '30px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
        <h1>{job.title}</h1>
        <h2>{job.company}</h2>
        <p>{job.description}</p>
        
        {role === 'job_seeker' && (
          <button 
            onClick={handleApply} 
            className="btn-purple" 
            disabled={applying}
            style={{ marginTop: '20px', width: '200px' }}
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        )}
        
        {message.text && (
          <p style={{ marginTop: '10px', color: message.type === 'success' ? 'green' : 'red' }}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetails;