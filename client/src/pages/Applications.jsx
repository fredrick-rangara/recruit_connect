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
    // 1. If the user isn't logged in, send them to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 2. Only fetch if the role is confirmed (prevents crashes/redirects)
    if (role) {
      const fetchApps = async () => {
        try {
          // Determine endpoint based on role
          const endpoint = role === 'employer' 
            ? '/employer/applications' 
            : '/seeker/my-applications';
          
          const res = await api.get(endpoint);
          setApps(res.data);
        } catch (err) {
          console.error("Error fetching applications:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchApps();
    }
  }, [role, isAuthenticated, navigate]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApps(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading applications...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          {role === 'employer' ? 'Candidate Management' : 'My Applications'}
        </h1>
        <p style={{ color: '#64748b' }}>
          {role === 'employer' 
            ? 'Review and update the status of applicants for your jobs.' 
            : 'View the progress of your current job applications.'}
        </p>
      </header>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px' }}>{role === 'employer' ? 'Applicant' : 'Job & Company'}</th>
              <th style={{ padding: '16px' }}>Date Applied</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.length > 0 ? (
              apps.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 700 }}>
                      {role === 'employer' ? app.seeker_name : app.job_title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {role === 'employer' ? app.seeker_email : app.company}
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{app.created_at}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`status-pill ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {role === 'employer' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => updateStatus(app.id, 'Accepted')}
                          style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateStatus(app.id, 'Rejected')}
                          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigate(`/job/${app.job_id}`)}
                        style={{ background: 'white', border: '1px solid #6366f1', color: '#6366f1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        View Job
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
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