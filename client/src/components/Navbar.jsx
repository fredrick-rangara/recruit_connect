import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';
import './Navbar.css';

const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Recruit<span>Connect</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <span className="nav-user">Welcome, {user?.name || 'User'}</span>
              <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-btn signup-btn">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
