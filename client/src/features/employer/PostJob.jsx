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
    job_type: 'Full-time' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload (Backend expects salary_max as an integer)
    const payload = {
      ...formData,
      salary_max: formData.salary_max ? parseInt(formData.salary_max, 10) : 0
    };

    try {
      await api.post('/jobs', payload);
      alert("🚀 Role posted successfully to the Recruitment Hub!");
      // This redirect now matches your updated Route in App.jsx
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
            <p className="subtitle" style={{ color: '#64748b', marginBottom: '32px' }}>Fill in the details to attract the best candidates</p>

            <form onSubmit={handleSubmit} className="job-post-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Job Title */}
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

              {/* Company & Location Row */}
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

              {/* Category & Salary Row */}
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

              {/* Description */}
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

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="submit" 
                  className="btn-purple" // Consistent with your dashboard button class
                  disabled={loading}
                  style={{ flex: 2, padding: '14px', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  {loading ? "Publishing..." : "Publish Job"}
                </button>
                <button 
                  type="button" 
                  className="btn-outline" 
                  style={{ flex: 1, cursor: 'pointer' }}
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