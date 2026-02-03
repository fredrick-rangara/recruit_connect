import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostJob.css';

/**
 * PostJob Component: Allows employers to create new job listings. 
 * Features a structured form with validation and a premium look.
 */
const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    location: '',
    type: 'Full-time',
    salaryRange: '',
    description: '',
    requirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Job posted successfully!');
      navigate('/employer/jobs');
    }, 1500);
  };

  return (
    <div className="post-job-container">
      <header className="page-header">
        <h1>Create New Listing</h1>
        <p>Define the role and attract the best talent for your team.</p>
      </header>

      <div className="form-card">
        <form className="post-job-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Frontend Developer" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Operations</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Remote or New York, NY" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Job Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Compensation & Details</h2>
            <div className="form-group">
              <label>Salary Range (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. $120k - $150k" 
                value={formData.salaryRange}
                onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Job Description</h2>
            <div className="form-group">
              <label>Role Summary</label>
              <textarea 
                placeholder="Describe the overall mission of this role..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Key Requirements</label>
              <textarea 
                placeholder="List the essential skills and experience needed..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/employer/jobs')}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Publicly Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
