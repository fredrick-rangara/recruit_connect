import React, { useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import api from '../../services/api';

const SeekerDashboard = () => {
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('cv', file);
    try {
      await api.post('/seeker/upload-cv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("CV Successfully Uploaded!");
    } catch (err) { alert("Upload failed"); }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR PANEL */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">RecruitConnect</Link>
        <nav className="sidebar-nav">
          <NavLink to="/seeker/dashboard" end>👤 My Profile</NavLink>
          <NavLink to="/jobs">🔍 Search Jobs</NavLink>
          <NavLink to="/seeker/applications">📂 My Applications</NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontWeight: 800 }}>Welcome back, Seeker!</h1>
          <p className="text-muted">Track your applications and update your profile.</p>
        </header>

        {/* PURPLE CV BANNER */}
        <div className="cv-banner">
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Upload Your CV</h2>
            <p style={{ opacity: 0.9 }}>Stand out to employers by keeping your documents fresh.</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} style={{ display: 'none' }} />
          <button 
            className="btn-outline" 
            onClick={() => fileInputRef.current.click()}
            style={{ backgroundColor: 'white', color: 'var(--figma-purple)', border: 'none' }}
          >
            Browse Files
          </button>
        </div>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '20px' }}>Recommended for you</h2>
          <div className="stat-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p className="text-muted">No specific recommendations yet. Browse the job board to find your match!</p>
            <Link to="/jobs" className="btn-purple" style={{ width: 'auto', marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>Explore Jobs</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SeekerDashboard;