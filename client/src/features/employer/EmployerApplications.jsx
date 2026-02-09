import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH REAL DATA FROM THE NEW BACKEND ROUTE
  const fetchApplications = async () => {
    try {
      const res = await api.get('/employer/applications');
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      // PATCH request to update the status in the database
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      
      // Update local state so the UI reflects the change immediately
      setApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      );
      
      alert(`Candidate successfully moved to ${newStatus}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#6366f1' }}>Loading Applications...</div>;

  return (
    <div className="dashboard-layout">
      {/* Use the same main container style as your dashboard */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontWeight: 800, color: '#1e293b', fontSize: '2rem' }}>Manage Applications</h1>
          <p style={{ color: '#64748b' }}>Review candidates and move them through your hiring pipeline.</p>
        </header>

        <div className="applications-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="job-item-card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>{app.seeker_name}</h3>
                  <p style={{ color: '#64748b', margin: '4px 0' }}>
                    Applied for: <strong style={{ color: '#334155' }}>{app.job_title}</strong>
                  </p>
                  
                  {/* CV DOWNLOAD LINK */}
                  {app.resume_path && (
                    <a 
                      href={`http://localhost:5000/download-cv/${app.seeker_id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ 
                        display: 'inline-block', 
                        marginTop: '10px', 
                        fontSize: '0.85rem', 
                        color: '#6366f1', 
                        textDecoration: 'none', 
                        fontWeight: '600',
                        borderBottom: '1px solid transparent'
                      }}
                      onMouseOver={(e) => e.target.style.borderBottom = '1px solid #6366f1'}
                      onMouseOut={(e) => e.target.style.borderBottom = '1px solid transparent'}
                    >
                      📄 View Candidate Resume
                    </a>
                  )}
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'block', 
                    fontWeight: '700', 
                    fontSize: '0.7rem', 
                    color: '#94a3b8', 
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    letterSpacing: '0.05em'
                  }}>
                    Current Stage: {app.status}
                  </span>
                  <select 
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    style={{ 
                      padding: '10px 15px', 
                      borderRadius: '8px', 
                      border: '1px solid #cbd5e1', 
                      background: '#f8fafc',
                      fontWeight: '600',
                      color: '#1e293b',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="applied">Applied</option>
                    <option value="screening">Screening</option>
                    <option value="interview">Interview</option>
                    <option value="offered">Offered</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              background: '#f8fafc', 
              borderRadius: '12px', 
              border: '2px dashed #e2e8f0' 
            }}>
              <p style={{ color: '#64748b' }}>No applications have been received yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployerApplications;