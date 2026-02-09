import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import api from '../../services/api';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Note: Endpoint '/employer/my-jobs' from your app.py is more efficient 
      // than fetching all jobs and filtering locally.
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/employer/my-jobs'), 
        api.get('/employer/dashboard-stats')
      ]);
      
      // If your backend returns all apps for 'my-jobs', we extract unique jobs
      // or simply use the jobs data if the endpoint is updated.
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
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>RecruitConnect</Link>
        </div>
        <nav className="sidebar-nav">
          {/* Ensure these paths match your Route definitions in App.jsx */}
          <NavLink 
            to="/employer/dashboard" 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            📊 Overview
          </NavLink>
          <NavLink 
            to="/employer/post-job"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            ➕ Post New Job
          </NavLink>
          <NavLink 
            to="/employer/applications"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            📁 Applications
          </NavLink>
          <NavLink 
            to="/settings"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            ⚙️ Settings
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontWeight: 800 }}>Welcome back, {user?.username || 'Employer'}!</h1>
          <p className="text-muted">Manage your listings and track applicants in real-time.</p>
        </header>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Active Jobs</span>
            <h2 className="stat-value">{stats.activeJobs}</h2>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Applicants</span>
            <h2 className="stat-value">{stats.totalApplicants}</h2>
          </div>
          <div className="stat-card">
            <span className="stat-label">Interviews</span>
            <h2 className="stat-value">{stats.interviews}</h2>
          </div>
        </div>

        {/* JOB LIST */}
        <section style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Current Listings</h2>
            <Link to="/employer/post-job" className="btn-purple" style={{ textDecoration: 'none' }}>
              + Post Job
            </Link>
          </div>

          <div className="job-list-wrapper">
            {myJobs.length > 0 ? (
              myJobs.map(job => (
                <div key={job.id} className="job-item-card">
                  <div className="job-info">
                    <h3 style={{ margin: 0 }}>{job.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                      {job.location} • Posted on {formatDate(job.created_at)}
                    </p>
                  </div>
                  <div className="job-actions">
                    <span className="status-badge">Active</span>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't posted any jobs yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployerDashboard;