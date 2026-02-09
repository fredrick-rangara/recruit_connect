import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import api from '../../services/api';

const EmployerDashboard = () => {
  // Use 'username' from auth state for the personalized greeting
  const { user } = useSelector((state) => state.auth);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Fetch both Job Listings and Dashboard Statistics
  const fetchDashboardData = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/jobs'), // Assuming this returns jobs filtered for employer in production
        api.get('/employer/dashboard-stats')
      ]);
      
      // Filter jobs locally if the endpoint doesn't support employer-only filtering yet
      const employerJobs = jobsRes.data.filter(j => String(j.employer_id) === String(user?.user_id));
      setMyJobs(employerJobs);
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

  // 2. Handle Delete with Confirmation
  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? All associated applications will be permanently removed."
    );

    if (confirmed) {
      try {
        await api.delete(`/jobs/${jobId}`);
        // Refresh data to update the UI and the stats cards
        fetchDashboardData();
      } catch (err) {
        alert("Failed to delete the job. Please try again.");
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
        <Link to="/" className="sidebar-logo">RecruitConnect</Link>
        <nav className="sidebar-nav">
          <NavLink to="/employer/dashboard" end>📊 Overview</NavLink>
          <NavLink to="/employer/post-job">➕ Post New Job</NavLink>
          <NavLink to="/employer/applications">📁 Applications</NavLink>
          <NavLink to="/settings">⚙️ Settings</NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontWeight: 800 }}>Welcome back, {user?.username || 'Employer'}!</h1>
          <p className="text-muted">Manage your listings and track applicants in real-time.</p>
        </header>

        {/* DYNAMIC STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <span>Active Jobs</span>
            <h2>{stats.activeJobs}</h2>
          </div>
          <div className="stat-card">
            <span>Total Applicants</span>
            <h2>{stats.totalApplicants}</h2>
          </div>
          <div className="stat-card">
            <span>Interviews</span>
            <h2>{stats.interviews}</h2>
          </div>
        </div>

        {/* JOB LIST */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Current Listings</h2>
            <Link to="/employer/post-job" className="btn-purple" style={{ width: 'auto', textDecoration: 'none' }}>+ Post Job</Link>
          </div>

          <div className="job-list-wrapper">
            {myJobs.length > 0 ? (
              myJobs.map(job => (
                <div key={job.id} className="stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>{job.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {job.location} • Posted on {formatDate(job.created_at)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span className="status-pill">Active</span>
                    <button 
                      className="btn-outline" 
                      style={{ color: '#dc2626', borderColor: '#fee2e2' }}
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
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