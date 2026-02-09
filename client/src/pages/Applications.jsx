import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Applications = () => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchApps = async () => {
      try {
        // Step 1: Determine endpoint based on role
        const endpoint = role === 'employer' 
          ? '/employer/applications' 
          : '/seeker/my-applications';
        
        const res = await api.get(endpoint);
        setApps(res.data);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [role, isAuthenticated, navigate]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      // Update local state to reflect change
      setApps(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="container" style={{padding: '50px'}}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>{role === 'employer' ? 'Manage Applicants' : 'My Applications'}</h1>
        <p style={{ color: '#64748b' }}>
          {role === 'employer' 
            ? 'Review candidates who applied to your job postings.' 
            : 'Track the status of your job submissions.'}
        </p>
      </header>

      <div className="table-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px' }}>{role === 'employer' ? 'Applicant' : 'Job Title'}</th>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.length > 0 ? apps.map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 'bold' }}>{role === 'employer' ? app.seeker_name : app.job_title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{role === 'employer' ? app.seeker_email : app.company}</div>
                </td>
                <td style={{ padding: '16px' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`status-pill ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  {role === 'employer' ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => updateStatus(app.id, 'Accepted')} className="btn-success-small">Accept</button>
                      <button onClick={() => updateStatus(app.id, 'Rejected')} className="btn-danger-small">Reject</button>
                    </div>
                  ) : (
                    <button onClick={() => navigate(`/job/${app.job_id}`)} className="btn-secondary-small">View Job</button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;