import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              💼 Recruit Connect
            </div>
            <p className="footer-desc">
              Quis enim pellentesque viverra tellus<br />
              eget malesuada facilisis. Congue<br />
              nibh vivamus aliquet nunc mauris d...
            </p>
          </div>

          {/* Company Column - Pushed to the right */}
          <div className="footer-links-container">
            <div className="footer-links-group">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/team">Our Team</Link></li>
                <li><Link to="/partners">Partners</Link></li>
                <li><Link to="/candidates">For Candidates</Link></li>
                <li><Link to="/employers">For Employers</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar - Centered per image */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;