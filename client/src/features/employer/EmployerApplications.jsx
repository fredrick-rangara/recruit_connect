import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      // You'll need an endpoint that returns all apps for the employer's jobs
      const res = await api.get('/employer/dashboard-stats'); 
      // Note: For a full list, we usually create a dedicated /employer/applications route
      // For now, let's assume we are fetching the detailed list
      const appsRes = await api.get('/employer/my-jobs'); 
      // Logic to pull applications from jobs...
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      alert(`Candidate moved to ${newStatus}`);
      window.location.reload(); // Refresh to see updated pipeline numbers
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="dashboard-main">
      <h2 style={{ marginBottom: '20px' }}>Manage Applications</h2>
      <div className="applications-list">
        {/* Example of a single application card */}
        <div className="job-item-card" style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div>
            <h3 style={{ margin: 0 }}>John Doe</h3>
            <p style={{ color: '#64748b' }}>Applied for: Software Engineer</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '0.8rem', color: '#6366f1' }}>MOVE TO:</span>
            <select 
              onChange={(e) => handleStatusChange(1, e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            >
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerApplications;