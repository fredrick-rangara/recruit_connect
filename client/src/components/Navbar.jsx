import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          <Link to="/jobs">Jobs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* AUTH SECTION */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <Link 
                to={role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'} 
                className="nav-item-active"
                style={{ color: 'var(--figma-purple)', fontWeight: 'bold', textDecoration: 'none' }}
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
              <Link to="/login" className="login-link" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>
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