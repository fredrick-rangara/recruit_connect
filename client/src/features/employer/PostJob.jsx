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
    type: 'Full-time'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', formData);
      alert("🚀 Role posted successfully to the Recruitment Hub!");
      navigate('/employer/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || "Error publishing role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '40px 0' }}>
      <div className="auth-inner" style={{ height: 'auto', minHeight: 'unset' }}>
        <div className="auth-section-form" style={{ width: '100%', flex: 'none' }}>
          <div className="auth-form-box" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Create New Role</h2>
            <p className="subtitle">Set up your hiring pipeline for success</p>

            <form onSubmit={handleSubmit} className="job-post-form">
              <div className="field-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Product Designer"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="role-toggle" style={{ gap: '20px', marginBottom: '20px' }}>
                <div className="field-group" style={{ flex: 1 }}>
                  <label>Company</label>
                  <input 
                    type="text" 
                    placeholder="Your Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
                <div className="field-group" style={{ flex: 1 }}>
                  <label>Location</label>
                  <input 
                    type="text" 
                    placeholder="Remote, NY, etc."
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="role-toggle" style={{ gap: '20px', marginBottom: '20px' }}>
                <div className="field-group" style={{ flex: 1 }}>
                  <label>Category</label>
                  <select 
                    className="salary-slider"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div className="field-group" style={{ flex: 1 }}>
                  <label>Salary Max (USD)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 150000"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Full Description</label>
                <textarea 
                  rows="6"
                  placeholder="Outline responsibilities and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="submit" 
                  className="btn-purple-main" 
                  disabled={loading}
                  style={{ flex: 2 }}
                >
                  {loading ? "Publishing..." : "Publish Job"}
                </button>
                <button 
                  type="button" 
                  className="btn-social" 
                  style={{ flex: 1, marginTop: 0 }}
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