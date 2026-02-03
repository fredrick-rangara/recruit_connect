import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployerSidebar from './EmployerSidebar';
import './EmployerDashboard.css';

/**
 * EmployerDashboard: Root container for all employer-side hiring tools.
 */
const EmployerDashboard = () => {
  return (
    <div className="employer-dashboard-container">
      <EmployerSidebar />
      <main className="employer-main-content">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
