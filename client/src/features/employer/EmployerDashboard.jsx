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
    switch (s) {
      case 'active': return <span className="status-badge status-active">Active</span>;
      case 'closed': return <span className="status-badge status-closed">Closed</span>;
      case 'draft': return <span className="status-badge status-draft">Draft</span>;
      case 'pending': return <span className="status-badge status-pending">Pending</span>;
      default: return <span className="status-badge status-active">Active</span>;
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
  }, [user?.user_id]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchDashboardData();
      } catch (err) { alert("Failed to delete the job."); }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="dashboard-layout">
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

      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontWeight: 800, color: '#1e293b', fontSize: '2.2rem' }}>Welcome back, {user?.username || 'Employer'}!</h1>
          <p style={{ color: '#64748b' }}>Manage your listings and track applicants in real-time.</p>
        </header>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card"><span>Active Jobs</span><h2>{stats.activeJobs}</h2></div>
          <div className="stat-card"><span>Total Applicants</span><h2>{stats.totalApplicants}</h2></div>
          <div className="stat-card"><span>Interviews</span><h2>{stats.interviews}</h2></div>
        </div>

        {/* HIRING PIPELINE SECTION */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Hiring Pipeline Overview</h2>
          <div className="pipeline-container">
            <div className="pipeline-stage">
              <div className="stage-count">{stats.pipeline.applied}</div>
              <div className="stage-label">Applied</div>
            </div>
            <div className="pipeline-stage">
              <div className="stage-count">{stats.pipeline.screening}</div>
              <div className="stage-label">Screening</div>
            </div>
            <div className="pipeline-stage">
              <div className="stage-count">{stats.pipeline.interview}</div>
              <div className="stage-label">Interview</div>
            </div>
            <div className="pipeline-stage">
              <div className="stage-count">{stats.pipeline.offered}</div>
              <div className="stage-label">Offered</div>
            </div>
            <div className="pipeline-stage">
              <div className="stage-count" style={{ background: '#dcfce7', color: '#166534' }}>{stats.pipeline.hired}</div>
              <div className="stage-label">Hired</div>
            </div>
          </div>
        </section>

        {/* JOB LIST SECTION */}
        <section style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Current Listings</h2>
            <Link to="/employer/post-job" className="btn-purple" style={{ textDecoration: 'none', width: 'auto' }}>+ Post New Job</Link>
          </div>
          <div className="job-list-wrapper">
            {myJobs.length > 0 ? myJobs.map(job => (
              <div key={job.id} className="job-item-card" style={{ padding: '20px' }}>
                <div className="job-info">
                  <h3 style={{ margin: 0 }}>{job.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{job.location} • Posted {formatDate(job.created_at)}</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {getStatusBadge(job.status)}
                  <button className="btn-delete" onClick={() => handleDeleteJob(job.id)}>Delete</button>
                </div>
              </div>
            )) : <div className="empty-state"><p>You haven't posted any jobs yet.</p></div>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployerDashboard;