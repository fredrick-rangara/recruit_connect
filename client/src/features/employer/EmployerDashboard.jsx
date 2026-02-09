import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import api from '../../services/api';

const EmployerDashboard = () => {
  // Pulling username from auth state for the dynamic greeting
  const { user } = useSelector((state) => state.auth);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetching from your optimized endpoints in app.py
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
  }, [user?.user_id]);

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? All associated applications will be permanently removed."
    );

    if (confirmed) {
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

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR PANEL */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 800 }}>RecruitConnect</Link>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/employer/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
            📊 Overview
          </NavLink>
          <NavLink to="/employer/post-job" className={({ isActive }) => isActive ? "active-link" : ""}>
            ➕ Post New Job
          </NavLink>
          <NavLink to="/employer/applications" className={({ isActive }) => isActive ? "active-link" : ""}>
            📁 Applications
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "active-link" : ""}>
            ⚙️ Settings
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          {/* DYNAMIC GREETING FIX */}
          <h1 style={{ fontWeight: 800, color: '#1e293b', fontSize: '2.2rem' }}>
            Welcome back, {user?.username || 'Employer'}!
          </h1>
          <p style={{ color: '#64748b' }}>Manage your listings and track applicants in real-time.</p>
        </header>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Active Jobs</span>
            <h2 style={{ fontSize: '2rem', margin: '10px 0 0 0' }}>{stats.activeJobs}</h2>
          </div>
          <div className="stat-card">
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Total Applicants</span>
            <h2 style={{ fontSize: '2rem', margin: '10px 0 0 0' }}>{stats.totalApplicants}</h2>
          </div>
          <div className="stat-card">
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Interviews</span>
            <h2 style={{ fontSize: '2rem', margin: '10px 0 0 0' }}>{stats.interviews}</h2>
          </div>
        </div>

        {/* JOB LIST SECTION */}
        <section style={{ marginTop: '50px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '25px' 
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Current Listings</h2>
            {/* POST JOB BUTTON FIX */}
            <Link to="/employer/post-job" className="btn-purple" style={{ 
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              + Post New Job
            </Link>
          </div>

          <div className="job-list-wrapper">
            {myJobs.length > 0 ? (
              myJobs.map(job => (
                <div key={job.id} className="stat-card" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  padding: '20px'
                }}>
                  <div className="job-info">
                    <h3 style={{ margin: 0, color: '#1e293b' }}>{job.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '5px 0 0 0' }}>
                      {job.location} • Posted on {formatDate(job.created_at)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ 
                      background: '#dcfce7', 
                      color: '#166534', 
                      padding: '5px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700 
                    }}>
                      Active
                    </span>
                    <button 
                      className="btn-outline" 
                      style={{ 
                        color: '#dc2626', 
                        borderColor: '#fee2e2',
                        padding: '8px 16px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                background: '#f8fafc', 
                borderRadius: '16px',
                color: '#94a3b8' 
              }}>
                <p>You haven't posted any jobs yet. Start hiring today!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployerDashboard;