import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';

/**
 * Dashboard Component: The main layout for all user-specific views.
 * It provides a sidebar for navigation and an Outlet for nested routes.
 */
const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div className="dashboard-inner-container">
          <Outlet /> {/* This will render the specific dashboard tab selected */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
