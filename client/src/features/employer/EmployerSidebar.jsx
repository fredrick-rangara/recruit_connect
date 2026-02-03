import React from 'react';
import { NavLink } from 'react-router-dom';
import './EmployerSidebar.css';

/**
 * EmployerSidebar: Specialized navigation for recruitment professionals.
 */
const EmployerSidebar = () => {
  const menuItems = [
    { name: 'Hiring Overview', path: '/employer' },
    { name: 'Manage Postings', path: '/employer/jobs' },
    { name: 'Post New Job', path: '/employer/post-job' },
    { name: 'Talent Pool', path: '/employer/candidates' },
    { name: 'Company Settings', path: '/employer/settings' },
  ];

  return (
    <aside className="employer-sidebar">
      <div className="sidebar-header">
        <h3>Hiring Suite</h3>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            end={item.path === '/employer'}
          >
            <span className="sidebar-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom-action">
        <div className="recruit-status-card">
          <h4>Active Recruitment</h4>
          <p>3 active roles | 24 new applicants</p>
        </div>
      </div>
    </aside>
  );
};

export default EmployerSidebar;
