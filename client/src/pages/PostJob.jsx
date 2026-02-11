import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api';

function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Engineering',
    location: '',
    salary_range: '',
    experience_level: 'Mid-Senior',
    benefits: '',
    company_name: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const res = await API.get(`/jobs/${id}`);
          setFormData({
            title: res.data.title || '',
            description: res.data.description || '',
            category: res.data.category || 'Engineering',
            location: res.data.location || '',
            salary_range: res.data.salary_range || '',
            experience_level: res.data.experience_level || 'Mid-Senior',
            benefits: res.data.benefits || '',
            company_name: res.data.company?.name || ''
          });
        } catch (err) {
          console.error("Failed to fetch job", err);
        }
      };
      fetchJob();
    } else if (user?.company_name) {
      setFormData(prev => ({ ...prev, company_name: user.company_name }));
    }
  }, [id, isEdit, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await API.patch(`/jobs/${id}`, formData);
        alert('Job updated successfully!');
      } else {
        await API.post('/jobs', formData);
        alert('Job posted successfully!');
      }
      navigate('/employer-dashboard');
    } catch (err) {
      alert('Failed to save job: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <div className="job-card" style={{ padding: '40px', borderLeftWidth: '10px' }}>
        <h1 style={{ marginBottom: '10px' }}>{isEdit ? 'Update Job Listing' : 'Post a New Job'}</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Fill in the details below to attract the best talent.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>Job Title</label>
            <input 
              type="text" 
              className="btn" 
              style={{ width: '100%', border: '1px solid #e2e8f0', cursor: 'text', padding: '14px', marginTop: '8px', fontSize: '1rem' }} 
              placeholder="e.g. Lead Product Designer"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div>
              <label style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>Category</label>
              <select 
                className="btn" 
                style={{ width: '100%', border: '1px solid #e2e8f0', padding: '14px', marginTop: '8px', fontSize: '1rem' }}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Customer Support</option>
              </select>
            </div>
            <div>
              <label style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>Location</label>
              <input 
                type="text" 
                className="btn" 
                style={{ width: '100%', border: '1px solid #e2e8f0', cursor: 'text', padding: '14px', marginTop: '8px', fontSize: '1rem' }} 
                placeholder="e.g. Remote / Nairobi"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <label style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>Job Description & Details</label>
            <textarea 
              className="btn" 
              style={{ width: '100%', minHeight: '200px', border: '1px solid #e2e8f0', cursor: 'text', padding: '14px', marginTop: '8px', borderRadius: '12px', fontSize: '1rem', lineHeight: '1.6' }} 
              placeholder="Tell us about the role, expectations, and any perks..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: '700', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Listing' : 'Publish Job')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
