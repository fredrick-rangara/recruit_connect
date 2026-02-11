import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import API from '../api';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then(res => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login or sign up to apply for this job');
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await API.post('/applications', { 
        job_id: id,
        resume_url: resumeUrl,
        cover_letter: coverLetter
      });
      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error('Please login or sign up to save this job');
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      await API.post('/jobs/save', { job_id: id });
      toast.success('Job saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
  if (!job) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Job not found</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--primary-color)', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '1.1rem', 
          fontWeight: '600',
          marginBottom: '30px',
          padding: 0
        }}
      >
        ← Back to Job Listings
      </button>
      <div className="job-card" style={{ borderLeftWidth: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{job.title}</h1>
            <Link to={`/company/${job.company?.id}`} style={{ textDecoration: 'none' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                @ {job.company?.name || 'TechCorp'} <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>(View Profile)</span>
              </p>
            </Link>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2ecc71' }}>{job.salary_range}</p>
            <p style={{ color: 'var(--text-light)' }}>{job.location}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button 
            className="btn btn-primary" 
            style={{ flex: 2, padding: '15px' }}
            onClick={() => setShowApplyForm(!showApplyForm)}
          >
            {showApplyForm ? 'Cancel Application' : 'Apply for this Position'}
          </button>
          <button 
            className="btn" 
            style={{ flex: 1, border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '15px' }}
            onClick={handleSaveJob}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Job'}
          </button>
        </div>

        {showApplyForm && (
          <form onSubmit={handleApply} className="job-card" style={{ padding: '30px', marginBottom: '40px', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '20px' }}>Submit Application</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label>Resume (Upload PDF or DOCX)</label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                className="btn" 
                style={{ width: '100%', border: '1px solid #ddd', padding: '12px', marginTop: '5px', cursor: 'pointer' }} 
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  try {
                    setApplying(true); // Re-use applying state to show loading
                    const res = await API.post('/upload', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    setResumeUrl(res.data.url);
                    setApplying(false);
                  } catch (err) {
                    console.error(err);
                    alert('File upload failed');
                    setApplying(false);
                  }
                }}
                required={!resumeUrl} // Required only if no URL set
              />
              {resumeUrl && <p style={{ fontSize: '0.8rem', color: 'green', marginTop: '5px' }}>File uploaded: {resumeUrl.split('/').pop()}</p>}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Cover Letter</label>
              <textarea 
                className="btn" 
                style={{ width: '100%', minHeight: '120px', border: '1px solid #ddd', padding: '12px', marginTop: '5px', cursor: 'text', borderRadius: '8px' }} 
                placeholder="Tell us why you are a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={applying}>
              {applying ? 'Submitting...' : 'Send Application'}
            </button>
          </form>
        )}

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Job Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{job.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Category</h4>
            <p style={{ fontWeight: '500' }}>{job.category}</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Experience Level</h4>
            <p style={{ fontWeight: '500' }}>{job.experience_level || 'Mid-Senior'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
