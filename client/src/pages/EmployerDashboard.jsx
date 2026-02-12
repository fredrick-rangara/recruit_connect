import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function EmployerDashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingJob, setViewingJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  const STAGES = [
    { id: 'applied', label: 'Applied', color: '#3498db' },
    { id: 'screening', label: 'Screening', color: '#f39c12' },
    { id: 'interview', label: 'Interview', color: '#9b59b6' },
    { id: 'offer', label: 'Offer', color: '#27ae60' },
    { id: 'hired', label: 'Hired', color: '#2ecc71' }
  ];

  const fetchApplications = useCallback(async () => {
    try {
      const [appRes, jobRes] = await Promise.all([
        API.get('/applications/employer'),
        API.get('/jobs') // In a real app, use /jobs/me or similar filter
      ]);
      setApplications(appRes.data);
      setJobs(jobRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employer') {
      navigate('/login');
      return;
    }

    fetchApplications();
    const interval = setInterval(fetchApplications, 5000); // Poll every 5 seconds for "real-time" feel
    return () => clearInterval(interval);
  }, [isAuthenticated, user, navigate, fetchApplications]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await API.patch(`/applications/${appId}`, { status: newStatus });
      fetchApplications(); // Refresh immediately
      // If we are looking at a specific app, update local state or close if hired/rejected?
      // For now, simple refresh handled by fetchApplications
      if (selectedApp?.id === appId) {
          setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This will also remove all associated applications.")) {
      try {
        await API.delete(`/jobs/${jobId}`);
        fetchApplications();
      } catch (err) {
        alert("Failed to delete job");
      }
    }
  };

  if (loading) return (
    <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
      <p style={{ marginTop: '20px' }}>Loading Recruitment Hub...</p>
    </div>
  );

  const totalApplicants = applications.length;
  // Mock calculations for demo visual parity
  const avgTime = "18 Days";
  const offerRate = "92%";
  const sourcingEff = "+40%";

  return (
    <div className="employer-dashboard" style={{ padding: '40px 20px', background: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>Recruitment Hub</h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
              <input type="text" placeholder="Search Candidates..." style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Link to="/post-job" className="btn btn-primary" style={{ padding: '12px 20px', borderRadius: '8px', background: '#7e22ce' }}>
                + Post New Role
              </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
            {[
                { label: 'Total Applicants', value: totalApplicants, color: '#1e293b', trend: '+12%', trendColor: '#22c55e' },
                { label: 'Avg. Time to Hire', value: avgTime, color: '#1e293b' },
                { label: 'Offer Acceptance', value: offerRate, color: '#1e293b' },
                { label: 'AI Sourcing Efficiency', value: sourcingEff, color: '#1e293b' }
            ].map((stat, i) => (
                <div key={i} style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px', fontWeight: '600' }}>{stat.label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.color }}>
                        {stat.value} 
                        {stat.trend && <span style={{ fontSize: '1rem', color: stat.trendColor, marginLeft: '5px' }}>{stat.trend}</span>}
                    </div>
                </div>
            ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            
            {/* Active Pipeline */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '30px', border: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '25px' }}>Active Hiring Pipeline</h2>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                    {jobs.map((job, idx) => {
                         const jobApps = applications.filter(a => a.job_id === job.id);
                         const isUrgent = idx % 2 === 0; // Mock urgency
                         return (
                            <div key={job.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ width: '50px', height: '50px', background: isUrgent ? '#e0e7ff' : '#dcfce7', color: isUrgent ? '#4338ca' : '#166534', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                    {job.category.substring(0,2).toUpperCase()}
                                </div>
                                <div style={{ marginLeft: '15px', flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>{job.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                        {jobApps.length} Applicants • {jobApps.filter(a => a.status !== 'applied').length} Active Processes
                                    </div>
                                </div>
                                <div style={{ marginRight: '15px' }}>
                                    <button 
                                        className="btn" 
                                        onClick={() => setViewingJob(job)}
                                        style={{ padding: '8px 16px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#475569' }}
                                    >
                                        View Applicants
                                    </button>
                                </div>
                                <div style={{ 
                                    padding: '4px 12px', 
                                    background: isUrgent ? '#fee2e2' : '#dbeafe', 
                                    color: isUrgent ? '#991b1b' : '#1e40af', 
                                    borderRadius: '20px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '700' 
                                }}>
                                    {isUrgent ? 'URGENT' : 'NORMAL'}
                                </div>
                            </div>
                         );
                    })}
                    {jobs.length === 0 && <p style={{ color: '#64748b' }}>No active jobs found.</p>}
                </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Today's Interviews</h3>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', borderLeft: '4px solid #3b82f6' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#3b82f6', marginBottom: '2px' }}>10:30 AM</div>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>Courtney Henry</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Senior UI Designer</div>
                    </div>
                </div>

                <div style={{ background: '#1e293b', borderRadius: '20px', padding: '30px', color: 'white', textAlign: 'center' }}>
                     <h3 style={{ fontSize: '1.2rem', color: '#818cf8', marginBottom: '10px' }}>Smart Match™</h3>
                     <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>We've found 4 candidates that match your criteria exactly.</p>
                     <button className="btn" style={{ width: '100%', background: '#6366f1', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none' }}>Review Matches</button>
                </div>
            </div>

        </div>
      </div>

      {/* Viewing Job Applicants Modal */}
      {viewingJob && (
          <div className="modal-overlay" onClick={() => setViewingJob(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                  <button className="close-modal-btn" onClick={() => setViewingJob(null)}>&times;</button>
                  <h2 style={{ marginBottom: '20px' }}>Applicants for {viewingJob.title}</h2>
                  
                  <div style={{ display: 'grid', gap: '15px' }}>
                      {applications.filter(a => a.job_id === viewingJob.id).length === 0 ? (
                          <p style={{ color: '#64748b' }}>No applicants for this job yet.</p>
                      ) : (
                          applications.filter(a => a.job_id === viewingJob.id).map(app => (
                              <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                  <div>
                                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{app.user.username}</div>
                                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Applied {new Date(app.created_at || Date.now()).toLocaleDateString()}</div>
                                      <div style={{ marginTop: '5px' }}>
                                          <span style={{ 
                                              padding: '2px 8px', 
                                              borderRadius: '12px', 
                                              fontSize: '0.8rem', 
                                              background: STAGES.find(s=>s.id === app.status)?.color || '#999', 
                                              color: 'white',
                                              fontWeight: '600'
                                          }}>
                                              {app.status.toUpperCase()}
                                          </span>
                                      </div>
                                  </div>
                                  <button className="btn btn-primary" onClick={() => setSelectedApp(app)}>
                                      Review Application
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Application Detail Modal - EXISTING */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)} style={{ zIndex: 1001 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="close-modal-btn" onClick={() => setSelectedApp(null)}>&times;</button>
            <h2 style={{ marginBottom: '5px' }}>Candidate Details</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Reviewing application for <strong>{selectedApp.job.title}</strong></p>
            
            <div style={{ display: 'grid', gap: '25px', marginBottom: '30px' }}>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>Applicant:</h4>
                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '700' }}>{selectedApp.user.username}</div>
                  <div style={{ color: '#64748b' }}>{selectedApp.user.email}</div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>Resume:</h4>
                <a href={selectedApp.resume_url} target="_blank" rel="noreferrer" className="btn" style={{ background: '#f1f5f9', display: 'block', textAlign: 'center', padding: '12px' }}>
                  View Full Resume ↗
                </a>
              </div>

              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>Cover Letter:</h4>
                <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px', fontSize: '0.95rem', lineHeight: '1.6', color: '#444' }}>
                  {selectedApp.cover_letter}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                     {['screening', 'interview', 'offer'].map(stage => (
                         <button 
                             key={stage}
                             className="btn" 
                             style={{ flex: 1, border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.9rem' }}
                             onClick={() => updateStatus(selectedApp.id, stage)}
                         >
                             Move to {stage.charAt(0).toUpperCase() + stage.slice(1)}
                         </button>
                     ))}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => {
                      updateStatus(selectedApp.id, 'hired');
                      setSelectedApp(null);
                    }}
                  >
                    Hire Candidate
                  </button>
                  <button 
                    className="btn" 
                    style={{ flex: 1, border: '1px solid #e11d48', color: '#e11d48' }}
                    onClick={() => {
                      updateStatus(selectedApp.id, 'rejected');
                      setSelectedApp(null);
                    }}
                  >
                    Reject Application
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;
