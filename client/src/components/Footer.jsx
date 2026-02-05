import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer-dark">
    <div className="container">
      <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px', padding: '60px 0' }}>
        
        {/* Brand Column */}
        <div className="footer-brand">
          <h3 style={{ color: 'white', marginBottom: '20px' }}>💼 RecruitConnect</h3>
          <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
            Quis enim pellentesque viverra tellus eget malesuada facilisis. 
            Congue nibh vivamus aliquet nunc mauris d...
          </p>
        </div>

        {/* Company Column */}
        <div className="footer-links">
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>About Us</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/team" style={{ color: '#9ca3af', textDecoration: 'none' }}>Our Team</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/partners" style={{ color: '#9ca3af', textDecoration: 'none' }}>Partners</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/employer/dashboard" style={{ color: '#9ca3af', textDecoration: 'none' }}>For Employers</Link></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="footer-links">
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Job Categories</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link to="/jobs" style={{ color: '#9ca3af', textDecoration: 'none' }}>Telecommunications</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/jobs" style={{ color: '#9ca3af', textDecoration: 'none' }}>Hotels & Tourism</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/jobs" style={{ color: '#9ca3af', textDecoration: 'none' }}>Construction</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/jobs" style={{ color: '#9ca3af', textDecoration: 'none' }}>Financial Services</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-newsletter">
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Newsletter</h4>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '15px' }}>
            Eu non pretium vitae platea. Nec tellus elementum vulputate.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: 'white' }}
            />
            <button className="btn-purple-main" style={{ width: '100%' }}>Subscribe now</button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom" style={{ borderTop: '1px solid #374151', padding: '30px 0', display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.85rem' }}>
        <p>© Copyright Job Portal 2026. Designed by Figma.guru</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/privacy" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms & Conditions</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;