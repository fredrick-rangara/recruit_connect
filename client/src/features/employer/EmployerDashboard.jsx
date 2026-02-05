import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import api from '../../services/api';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get('/employer/my-jobs');
        setMyJobs(res.data);
      } catch (err) { console.error(err); }
    };
    fetchMyJobs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
  };

  return (
    <div className="dashboard-layout">
      {/* 1. SIDEBAR PANEL */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">RecruitConnect</Link>
        <nav className="sidebar-nav">
          <NavLink to="/employer/dashboard" end>📊 Overview</NavLink>
          <NavLink to="/employer/post-job">➕ Post New Job</NavLink>
          <NavLink to="/employer/applications">📁 Applications</NavLink>
          <NavLink to="/settings">⚙️ Settings</NavLink>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontWeight: 800 }}>Welcome back, {user?.username || 'Employer'}!</h1>
          <p className="text-muted">Manage your listings and track applicants.</p>
        </header>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <span>Active Jobs</span>
            <h2>{myJobs.length}</h2>
          </div>
          <div className="stat-card">
            <span>Total Applicants</span>
            <h2>24</h2>
          </div>
          <div className="stat-card">
            <span>Interviews</span>
            <h2>8</h2>
          </div>
        </div>

        {/* JOB LIST */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Current Listings</h2>
            <Link to="/employer/post-job" className="btn-purple" style={{ width: 'auto', textDecoration: 'none' }}>+ Post Job</Link>
          </div>

          <div className="job-list-wrapper">
            {myJobs.map(job => (
              <div key={job.id} className="stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ marginBottom: '4px' }}>{job.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{job.location} • Posted on {formatDate(job.created_at)}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span className="status-pill">Active</span>
                  <button className="btn-outline">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployerDashboard;