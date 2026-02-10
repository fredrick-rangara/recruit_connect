import React, { useState } from 'react';
import api from '../../services/api';

const JobPostForm = ({ onJobAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    category: 'Technology', // Default category
    salary_max: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/jobs', formData);
      alert("🚀 Job Posted Successfully!");
      
      // Reset form to initial state
      setFormData({ 
        title: '', company: '', location: '', 
        description: '', category: 'Technology', salary_max: '' 
      });
      
      if (onJobAdded) onJobAdded(response.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-box" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3>Post a New Opening</h3>
      <p className="subtitle">Fill in the details to reach thousands of top candidates.</p>
      
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
            <label>Company Name</label>
            <input 
              type="text" 
              placeholder="Your Company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              required
            />
          </div>
          <div className="field-group" style={{ flex: 1 }}>
            <label>Location</label>
            <input 
              type="text" 
              placeholder="e.g. Remote or City"
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
              <option>Technology</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Finance</option>
              <option>Healthcare</option>
            </select>
          </div>
          <div className="field-group" style={{ flex: 1 }}>
            <label>Salary Max (USD)</label>
            <input 
              type="number" 
              placeholder="e.g. 120000"
              value={formData.salary_max}
              onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
            />
          </div>
        </div>

        <div className="field-group">
          <label>Full Job Description</label>
          <textarea 
            rows="6"
            placeholder="What are the requirements and responsibilities?"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          ></textarea>
        </div>

        <button type="submit" className="btn-purple-main" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
          {loading ? "Publishing..." : "Publish Job Listing"}
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;