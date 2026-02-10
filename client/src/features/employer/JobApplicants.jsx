import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        // Fetch both the job title and the list of applicants
        const [jobRes, appRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/employer/jobs/${jobId}/applicants`)
        ]);
        setJobDetails(jobRes.data);
        setApplicants(appRes.data);
      } catch (err) {
        console.error("Error loading applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicantsData();
  }, [jobId]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}`, { status: newStatus });
      setApplicants(prev => 
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      alert("Failed to update candidate status");
    }
  };

  if (loading) return <div className="container">Loading candidates...</div>;

  return (
    <div className="main-layout" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar remains for consistency */}
      <aside className="filters-sidebar" style={{ backgroundColor: '#111827', color: 'white', width: '260px', padding: '20px' }}>
        <h2 onClick={() => navigate('/employer/dashboard')} style={{ cursor: 'pointer' }}>RecruitConnect</h2>
        <nav className="filter-group">
          <p onClick={() => navigate('/employer/dashboard')} style={{ cursor: 'pointer' }}>📊 Back to Dashboard</p>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0 }}>{jobDetails?.title || "Job Applicants"}</h1>
            <p style={{ color: '#666' }}>Reviewing {applicants.length} candidates for this position</p>
          </div>
          <button className="btn-social" onClick={() => navigate('/employer/dashboard')}>Close View</button>
        </header>

        <div className="job-card-figma" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eee' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '20px' }}>Candidate Name</th>
                <th style={{ textAlign: 'left', padding: '20px' }}>Profile Strength</th>
                <th style={{ textAlign: 'left', padding: '20px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '20px' }}>Manage Stage</th>
              </tr>
            </thead>
            <tbody>
              {applicants.length > 0 ? (
                applicants.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: '700' }}>{app.applicant_name}</div>
                      <a href={app.resume_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#6f42c1' }}>View Resume</a>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ width: '100px', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden', marginBottom: '5px' }}>
                        <div style={{ width: `${app.profile_strength}%`, background: '#6f42c1', height: '100%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{app.profile_strength}% Match</span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span className={`status-pill ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <select 
                        className="status-select" 
                        value={app.status} 
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    No candidates have applied for this role yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default JobApplicants;