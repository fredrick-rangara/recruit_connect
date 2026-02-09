import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import api from '../services/api';

const Applications = () => {
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // 2. Initialize navigate
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const endpoint = role === 'employer' ? '/employer/my-jobs' : '/seeker/my-applications';
        const res = await api.get(endpoint);
        setApps(res.data);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [role]);

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

  const getStatusStyle = (status) => {
    const styles = {
      Accepted: { bg: '#dcfce7', text: '#166534' },
      Rejected: { bg: '#fee2e2', text: '#991b1b' },
      Interviewing: { bg: '#fef3c7', text: '#92400e' }, // Added to match your screenshot
      Pending: { bg: '#f1f5f9', text: '#475569' }
    };
    return styles[status] || styles.Pending;
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading applications...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>
          {role === 'employer' ? 'Candidate Management' : 'My Job Applications'}
        </h1>
        <p style={{ color: '#64748b' }}>
          {role === 'employer' ? 'Review and manage applicants for your postings.' : 'Track the status of your sent applications.'}
        </p>
      </header>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', color: '#475569' }}>{role === 'employer' ? 'Applicant' : 'Job / Company'}</th>
              <th style={{ padding: '16px', color: '#475569' }}>Applied On</th>
              <th style={{ padding: '16px', color: '#475569' }}>Status</th>
              <th style={{ padding: '16px', color: '#475569', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>
                    {/* 3. Uses keys provided by your new backend to_dict */}
                    {role === 'employer' ? app.seeker_name : app.job_title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {role === 'employer' ? app.seeker_email : app.company}
                  </div>
                </td>
                
                <td style={{ padding: '16px', color: '#64748b', fontSize: '0.9rem' }}>
                  {/* 4. Uses the formatted string from backend if available, or falls back to Date object */}
                  {app.created_at || new Date(app.applied_at).toLocaleDateString()}
                </td>

                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: getStatusStyle(app.status).bg,
                    color: getStatusStyle(app.status).text
                  }}>
                    {app.status}
                  </span>
                </td>

                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {role === 'employer' ? (
                      <>
                        <button 
                          onClick={() => window.open(`http://localhost:5000/download-cv/${app.seeker_id}`, '_blank')}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          📄 CV
                        </button>
                        <button 
                          onClick={() => updateStatus(app.id, 'Accepted')}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateStatus(app.id, 'Rejected')}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #dc2626', background: 'white', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn-outline" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
                        onClick={() => navigate(`/job/${app.job_id}`)}
                      >
                        View Job
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Empty state logic remains the same */}
      </div>
    </div>
  );
};

export default Applications;