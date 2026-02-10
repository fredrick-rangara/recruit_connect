import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const EmployerLayout = () => {
  return (
    <div className="dashboard-container">
      {/* The Sidebar is defined ONCE here */}
      <aside className="dashboard-sidebar">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '40px', color: 'white' }}>JobConnect</h2>
        <nav>
          <NavLink to="/employer/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/employer/my-jobs" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            💼 My Jobs
          </NavLink>
          <NavLink to="/employer/candidates" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            👥 Candidates
          </NavLink>
          <NavLink to="/employer/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            ⚙️ Settings
          </NavLink>
        </nav>
      </aside>

      {/* The Outlet is where MyJobs, Candidates, or the Dashboard will render */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployerLayout;