import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditJob = () => {
  const { id } = useParams(); // Gets the job ID from the URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    category: '',
    salary_max: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch the existing job data when the component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        alert("Could not load job details.");
        navigate('/employer/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/jobs/${id}`, formData);
      alert("✅ Job updated successfully!");
      navigate('/employer/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error updating job");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container">Loading job data...</div>;

  return (
    <div className="auth-wrapper" style={{ padding: '40px 0' }}>
      <div className="auth-inner" style={{ height: 'auto', minHeight: 'unset' }}>
        <div className="auth-section-form" style={{ width: '100%', flex: 'none' }}>
          <div className="auth-form-box" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2>Edit Job Listing</h2>
            <p className="subtitle">Update the details for <strong>{formData.title}</strong></p>

            <form onSubmit={handleSubmit} className="job-post-form">
              <div className="field-group">
                <label>Job Title</label>
                <input 
                  type="text" 
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
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
                <div className="field-group" style={{ flex: 1 }}>
                  <label>Location</label>
                  <input 
                    type="text" 
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
                    value={formData.salary_max}
                    onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Job Description</label>
                <textarea 
                  rows="8"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  type="submit" 
                  className="btn-purple-main" 
                  disabled={updating}
                  style={{ flex: 2 }}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="btn-social" 
                  style={{ flex: 1, marginTop: 0 }}
                  onClick={() => navigate('/employer/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;