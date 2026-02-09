import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    category: 'Technology',
    salary_max: '',
    description: '',
    job_type: 'Full-time' // Matches the 'job_type' field in your Job model
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data (ensuring numbers are handled correctly for the backend)
    const payload = {
      ...formData,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : 0
    };

    try {
      await api.post('/jobs', payload);
      alert("🚀 Role posted successfully to the Recruitment Hub!");
      navigate('/employer/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || "Error publishing role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '60px 20px', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="auth-inner" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', background: 'white', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div className="auth-section-form" style={{ width: '100%', padding: '40px' }}>
          <div className="auth-form-box">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Create New Role</h2>
            <p className="subtitle" style={{ color: '#64748b', marginBottom: '32px' }}>Set up your hiring pipeline for success</p>

            <form onSubmit={handleSubmit} className="job-post-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="field-group">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>Job Title</label>
                <input 
                  type="text" 
                  className="auth-input"
                  placeholder="e.g. Senior Product Designer"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div className="field-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>Company</label>
                  <input 
                    type="text" 
                    className="auth-input"
                    placeholder="Your Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
                <div className="field-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>Location</label>
                  <input 
                    type="text" 
                    className="auth-input"
                    placeholder="Remote, NY, etc."
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div className="field-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>Category</label>
                  <select 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div className="field-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>Salary Max (USD)</label>
                  <input 
                    type="number" 
                    className="auth-input"
                    placeholder="e.g. 150000"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                  />
                </div>
              </div>

              <div className="field-group">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>Full Description</label>
                <textarea 
                  rows="5"
                  placeholder="Outline responsibilities and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="submit" 
                  className="btn-purple-main" 
                  disabled={loading}
                  style={{ flex: 2, padding: '14px', borderRadius: '10px', fontSize: '1rem', fontWeight: 700 }}
                >
                  {loading ? "Publishing..." : "Publish Job"}
                </button>
                <button 
                  type="button" 
                  className="btn-social" 
                  style={{ flex: 1, marginTop: 0, padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b' }}
                  onClick={() => navigate('/employer/dashboard')}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;