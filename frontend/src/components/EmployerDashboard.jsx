import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-hot-toast';

function EmployerDashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employer') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardRes = await API.get('/dashboard');
      
      if (dashboardRes.data.role === 'employer' && dashboardRes.data.postings) {
        const transformedJobs = dashboardRes.data.postings.map(posting => ({
          id: posting.job_id,
          title: posting.title,
          applications: posting.applicants.map(app => ({
            id: app.app_id,
            user: { username: app.candidate_name, email: app.email },
            status: app.status,
            resume_url: app.resume_url,
            cover_letter: app.cover_letter
          }))
        }));
        setJobs(transformedJobs);
        
        const allApps = [];
        dashboardRes.data.postings.forEach(posting => {
          posting.applicants.forEach(app => {
            allApps.push({
              id: app.app_id,
              job_id: posting.job_id,
              job: { title: posting.title },
              user: { username: app.candidate_name, email: app.email },
              status: app.status,
              resume_url: app.resume_url,
              cover_letter: app.cover_letter
            });
          });
        });
        setApplications(allApps);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await API.patch(\`/applications/\${applicationId}\`, { status: newStatus });
      toast.success(\`Application moved to \${newStatus}\`);
      fetchDashboardData();
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update application status');
    }
  };

  const getApplicationsForJob = (jobId) => {
    return applications.filter(app => app.job_id === jobId);
  };

  const STAGES = [
    { id: 'applied', label: 'Applied', color: '#3498db' },
    { id: 'screening', label: 'Screening', color: '#f39c12' },
    { id: 'interview', label: 'Interview', color: '#9b59b6' },
    { id: 'offer', label: 'Offer', color: '#27ae60' },
    { id: 'hired', label: 'Hired', color: '#2ecc71' },
    { id: 'rejected', label: 'Rejected', color: '#e74c3c' }
  ];

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px' }}>Loading Recruitment Hub...</p>
      </div>
    );
  }

  const totalApplicants = applications.length;
  const pendingApplications = applications.filter(a => a.status === 'applied').length;
  const interviewApplications = applications.filter(a => a.status === 'interview').length;

  return (
    <div className="employer-dashboard" style={{ padding: '40px 20px', background: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>Recruitment Hub</h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/post-job" className="btn btn-primary" style={{ padding: '12px 20px', borderRadius: '8px', background: '#7e22ce' }}>
              + Post New Role
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px', fontWeight: '600' }}>Total Applicants</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{totalApplicants}</div>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px', fontWeight: '600' }}>Pending Review</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f39c12' }}>{pendingApplications}</div>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px', fontWeight: '600' }}>In Interview</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#9b59b6' }}>{interviewApplications}</div>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px', fontWeight: '600' }}>Active Jobs</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{jobs.length}</div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '25px' }}>Active Hiring Pipeline</h2>
          
          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>No active jobs found.</p>
              <Link to="/post-job" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {jobs.map((job) => {
                const jobApps = getApplicationsForJob(job.id);
                const isUrgent = jobApps.length > 3;
                
                return (
                  <div 
                    key={job.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '20px', 
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => setSelectedJob(job)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      background: isUrgent ? '#fee2e2' : '#dcfce7', 
                      color: isUrgent ? '#dc2626' : '#16a34a', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: '700',
                      fontSize: '0.8rem'
                    }}>
                      JN
                    </div>
                    <div style={{ marginLeft: '15px', flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>{job.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        {jobApps.length} Applicants
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginRight: '15px' }}>
                      {STAGES.slice(0, 4).map(stage => {
                        const count = jobApps.filter(a => a.status === stage.id).length;
                        return (
                          <div key={stage.id} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: stage.color }}>{count}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{stage.label}</div>
                          </div>
                        );
                      })}
                    </div>
                    <button 
                      className="btn"
                      style={{ padding: '8px 16px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#475569' }}
                      onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                    >
                      View Applicants
                    </button>
                    {isUrgent && (
                      <span style={{ marginLeft: '10px', padding: '4px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                        URGENT
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ 
            maxWidth: '900px', width: '90%', maxHeight: '80vh', overflow: 'auto',
            background: 'white', borderRadius: '20px', padding: '30px', position: 'relative'
          }}>
            <button onClick={() => setSelectedJob(null)} style={{
              position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#94a3b8'
            }}>
              ×
            </button>
            <h2 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>Applicants for {selectedJob.title}</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>{getApplicationsForJob(selectedJob.id).length} applicant(s)</p>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {getApplicationsForJob(selectedJob.id).length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No applicants for this job yet.</p>
              ) : (
                getApplicationsForJob(selectedJob.id).map((app) => (
                  <div key={app.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', 
                    background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' 
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{app.user?.username || 'Unknown'}</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{app.user?.email || ''}</div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', 
                          background: STAGES.find(s => s.id === app.status)?.color || '#999', color: 'white', fontWeight: '600'
                        }}>
                          {app.status?.toUpperCase() || 'APPLIED'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {app.resume_url && (
                        <a href={app.resume_url} target="_blank" rel="noreferrer" className="btn"
                          style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }}>
                          View CV
                        </a>
                      )}
                      <button className="btn btn-primary" onClick={() => setSelectedApplication(app)} style={{ padding: '8px 16px', borderRadius: '8px' }}>
                        Review Application
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ 
            maxWidth: '700px', width: '90%', maxHeight: '85vh', overflow: 'auto',
            background: 'white', borderRadius: '20px', padding: '35px', position: 'relative'
          }}>
            <button onClick={() => setSelectedApplication(null)} style={{
              position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#94a3b8'
            }}>
              ×
            </button>
            <h2 style={{ marginBottom: '5px', fontSize: '1.5rem' }}>Candidate Details</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Reviewing application for <strong>{selectedApplication.job?.title}</strong></p>
            
            <div style={{ display: 'grid', gap: '25px', marginBottom: '30px' }}>
              <div>
                <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Applicant Information</h4>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{selectedApplication.user?.username || 'Unknown'}</div>
                  <div style={{ color: '#64748b' }}>{selectedApplication.user?.email || ''}</div>
                </div>
              </div>
              
              {selectedApplication.resume_url && (
                <div>
                  <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Resume / CV</h4>
                  <a href={selectedApplication.resume_url} target="_blank" rel="noreferrer" className="btn"
                    style={{ background: '#f1f5f9', display: 'block', textAlign: 'center', padding: '15px', borderRadius: '10px', fontWeight: '600', color: '#3b82f6' }}>
                    View Full Resume
                  </a>
                </div>
              )}

              {selectedApplication.cover_letter && (
                <div>
                  <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Cover Letter</h4>
                  <div style={{ padding: '25px', background: '#f9f9f9', borderRadius: '12px', fontSize: '0.95rem', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>
                    {selectedApplication.cover_letter}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['screening', 'interview', 'offer'].map((stage) => (
                  <button key={stage} className="btn" style={{ flex: 1, border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.9rem', padding: '12px' }}
                    onClick={() => updateApplicationStatus(selectedApplication.id, stage)}>
                    Move to {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem', fontWeight: '600' }}
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'hired')}>
                  Hire Candidate
                </button>
                <button className="btn" style={{ flex: 1, border: '2px solid #e11d48', color: '#e11d48', padding: '14px', fontSize: '1rem', fontWeight: '600' }}
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}>
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
