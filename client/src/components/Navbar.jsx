import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, selectCurrentRole, logout } from '../features/auth/authSlice';
import { APP_NAME } from '../constants';
import './Navbar.css';

/**
 * Navbar Component: The main navigation bar for the application.
 * It dynamically changes its content based on whether the user is authenticated.
 */
const Navbar = () => {
  // Accessing the authentication state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectCurrentRole);
  const dispatch = useDispatch();

  /**
   * handleLogout: Dispatches the logout action to clear user credentials.
   */
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo that links back to the home page */}
        <NavLink to="/" className="navbar-logo">
          {APP_NAME}
        </NavLink>
        
        <div className="navbar-links">
          {/* Main navigation links */}
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          
          {/* Conditional rendering based on auth state */}
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
