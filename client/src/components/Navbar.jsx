import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; // 1. Import HashLink
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* LOGO SECTION */}
        <Link to="/" className="nav-logo">
          💼 RecruitConnect
        </Link>
        
        {/* CENTER MENU */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {/* 2. THE FIX: HashLink for scroll, Link for Dashboard */}
          {!isAuthenticated ? (
            <HashLink smooth to="/#job-listings">Jobs</HashLink>
          ) : (
            <Link to={role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'}>
              My Jobs
            </Link>
          )}
          
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* AUTH SECTION */}
        <div className="nav-auth" style={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link 
                to={role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'} 
                style={{ 
                  color: 'var(--figma-purple)', 
                  fontWeight: 'bold', 
                  textDecoration: 'none',
                  marginRight: '20px' 
                }}
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn-purple" 
                style={{ padding: '8px 20px', fontSize: '0.9rem', width: 'auto' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                Login
              </Link>
              <Link to="/signup" className="btn-purple" style={{ padding: '8px 20px', fontSize: '0.9rem', width: 'auto', textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;