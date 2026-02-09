import React, { useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Added import
import api from '../../services/api';

const SeekerDashboard = () => {
  const { username } = useSelector((state) => state.auth); // Grab username from state
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);
    
    setIsUploading(true);
    try {
      await api.post('/seeker/upload-cv', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      alert("✅ CV Successfully Uploaded!");
    } catch (err) { 
      console.error(err);
      alert("❌ Upload failed. Please check your connection."); 
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR PANEL */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            💼 RecruitConnect
          </Link>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/seeker/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
            👤 My Profile
          </NavLink>
          <NavLink to="/jobs">
            🔍 Search Jobs
          </NavLink>
          <NavLink to="/applications">
            📂 My Applications
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header style={{ marginBottom: '30px' }}>
          {/* UPDATED: Personalized greeting */}
          <h1 style={{ fontWeight: 800, color: '#1e293b' }}>
            Welcome back, {username || 'Seeker'}!
          </h1>
          <p style={{ color: '#64748b' }}>Track your applications and update your profile.</p>
        </header>

        {/* PURPLE CV BANNER */}
        <div className="cv-banner" style={{ 
          background: 'linear-gradient(135deg, var(--figma-purple) 0%, #9333ea 100%)',
          padding: '40px',
          borderRadius: '24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', fontWeight: 700 }}>Update Your CV</h2>
            <p style={{ opacity: 0.9, maxWidth: '400px' }}>
              Employers always look for the most recent resumes. Keep yours up to date to increase your chances!
            </p>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }} 
          />
          
          <button 
            className="btn-outline" 
            disabled={isUploading}
            onClick={() => fileInputRef.current.click()}
            style={{ 
              backgroundColor: 'white', 
              color: 'var(--figma-purple)', 
              border: 'none', 
              padding: '12px 30px',
              fontWeight: 700,
              borderRadius: '12px',
              cursor: isUploading ? 'not-allowed' : 'pointer'
            }}
          >
            {isUploading ? "Uploading..." : "Browse Files"}
          </button>
        </div>

        {/* QUICK STATS / RECOMMENDATIONS */}
        <section style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 700 }}>Recommended for you</h2>
            <Link to="/jobs" style={{ color: 'var(--figma-purple)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              View all jobs →
            </Link>
          </div>
          
          <div className="stat-card" style={{ 
            textAlign: 'center', 
            padding: '60px 40px', 
            background: 'white', 
            borderRadius: '20px', 
            border: '1px solid #e2e8f0' 
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚀</div>
            <p style={{ color: '#64748b', marginBottom: '25px' }}>
              No specific recommendations yet. Browse the job board to find your perfect match!
            </p>
            <Link to="/jobs" className="btn-purple" style={{ 
              width: 'auto', 
              padding: '12px 40px', 
              display: 'inline-block', 
              textDecoration: 'none' 
            }}>
              Explore Job Openings
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SeekerDashboard;