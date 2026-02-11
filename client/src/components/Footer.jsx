import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'white', 
      padding: '50px 0', 
      marginTop: '80px',
      borderTop: '1px solid #eee'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        <div>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>RecruitConnect</h3>
          <p style={{ color: 'var(--text-light)' }}>Connecting the world's best talent with the most innovative companies.</p>
        </div>
        <div>
          <h4>For Seekers</h4>
          <ul style={{ listStyle: 'none', marginTop: '20px', color: 'var(--text-light)' }}>
            <li style={{ marginBottom: '10px' }}>Browse Jobs</li>
            <li style={{ marginBottom: '10px' }}>Job Alerts</li>
            <li style={{ marginBottom: '10px' }}>Career Advice</li>
          </ul>
        </div>
        <div>
          <h4>For Employers</h4>
          <ul style={{ listStyle: 'none', marginTop: '20px', color: 'var(--text-light)' }}>
            <li style={{ marginBottom: '10px' }}>Post a Job</li>
            <li style={{ marginBottom: '10px' }}>ATS Features</li>
            <li style={{ marginBottom: '10px' }}>Pricing</li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul style={{ listStyle: 'none', marginTop: '20px', color: 'var(--text-light)' }}>
            <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</Link></li>
            <li style={{ marginBottom: '10px' }}>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #f5f5f5', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} RecruitConnect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
