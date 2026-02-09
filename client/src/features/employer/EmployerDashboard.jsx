import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import api from '../../services/api';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ 
    activeJobs: 0, 
    totalApplicants: 0, 
    interviews: 0,
    pipeline: { applied: 0, screening: 0, interview: 0, offered: 0, hired: 0 } 
  });
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'active';
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize'
    };

    switch (s) {
      case 'active': 
        return <span style={{ ...baseStyle, background: '#dcfce7', color: '#166534' }}>Active</span>;
      case 'closed': 
        return <span style={{ ...baseStyle, background: '#fee2e2', color: '#991b1b' }}>Closed</span>;
      default: 
        return <span style={{ ...baseStyle, background: '#f1f5f9', color: '#475569' }}>{s}</span>;
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/employer/my-jobs'), 
        api.get('/employer/dashboard-stats')
      ]);
      setMyJobs(jobsRes.data); 
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.user_id || user?.id]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this listing? All associated applications will be removed.")) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchDashboardData();
      } catch (err) { 
        alert("Failed to delete the job."); 
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#6366f1', fontWeight: '600' }}>Loading Your Dashboard...</div>;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 800 }}>RecruitConnect</Link>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/employer/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>📊 Overview</NavLink>
          <NavLink to="/employer/post-job" className={({ isActive }) => isActive ? "active-link" : ""}>➕ Post New Job</NavLink>
          <NavLink to="/employer/applications" className={({ isActive }) => isActive ? "active-link" : ""}>📁 Applications</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "active-link" : ""}>⚙️ Settings</NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontWeight: 800, color: '#1e293b', fontSize: '2.2rem', marginBottom: '8px' }}>
            Welcome back, {user?.username || user?.user?.username || 'Employer'}!
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Track your hiring progress and manage active listings.</p>
        </header>

        {/* HIRING PIPELINE SECTION (Now the primary metric) */}
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: '#1e293b' }}>
            Hiring Pipeline Overview
          </h2>
          <div className="pipeline-container" style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'white',
            padding: '30px 25px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {[
              { label: 'Applied', key: 'applied' },
              { label: 'Screening', key: 'screening' },
              { label: 'Interview', key: 'interview' },
              { label: 'Offered', key: 'offered' },
              { label: 'Hired', key: 'hired', color: '#10b981' }
            ].map((stage, index, arr) => (
              <div 
                key={stage.key} 
                className="pipeline-stage" 
                style={{ 
                  flex: 1, 
                  textAlign: 'center',
                  borderRight: index === arr.length - 1 ? 'none' : '1px solid #f1f5f9'
                }}
              >
                <div className="stage-count" style={{ 
                  fontSize: '2rem', 
                  fontWeight: '800', 
                  color: stage.color || '#6366f1',
                  lineHeight: 1
                }}>
                  {stats.pipeline?.[stage.key] || 0}
                </div>
                <div className="stage-label" style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  color: '#64748b', 
                  marginTop: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {stage.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CURRENT LISTINGS SECTION */}
        <section style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Current Listings ({myJobs.length})</h2>
            <Link to="/employer/post-job" className="btn-purple" style={{ textDecoration: 'none', width: 'auto', padding: '10px 24px' }}>
              + Post New Job
            </Link>
          </div>
          
          <div className="job-list-wrapper">
            {myJobs.length > 0 ? (
              myJobs.map(job => (
                <div key={job.id} className="job-item-card" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'white',
                  padding: '20px 24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '16px'
                }}>
                  <div className="job-info">
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{job.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '6px' }}>
                      {job.location} • Posted on {formatDate(job.created_at)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {getStatusBadge(job.status)}
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteJob(job.id)}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No active job listings found. Start by posting your first job!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployerDashboard;