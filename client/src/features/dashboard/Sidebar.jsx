import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar Component: Provides specific navigation links for the Job Seeker Dashboard.
 */
const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'My Applications', icon: '📝', path: '/dashboard/applications' },
    { name: 'Saved Jobs', icon: '🔖', path: '/dashboard/saved' },
    { name: 'Messages', icon: '💬', path: '/dashboard/messages' },
    { name: 'Profile Settings', icon: '⚙️', path: '/dashboard/settings' },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            end
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="help-card">
          <h4>Need help?</h4>
          <p>Check our support center</p>
          <button className="help-btn">Contact Support</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
