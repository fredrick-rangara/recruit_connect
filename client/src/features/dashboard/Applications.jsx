import React from 'react';
import './Applications.css';

/**
 * Applications Component: Displays a list of job applications with their current status.
 */
const Applications = () => {
  const applications = [
    { id: 1, title: 'Senior Frontend Developer', company: 'TechFlow', date: '2023-10-15', status: 'In Review', statusColor: '#0984e3' },
    { id: 2, title: 'UI/UX Designer', company: 'CreativeSpace', date: '2023-10-12', status: 'Interview', statusColor: '#6c5ce7' },
    { id: 3, title: 'React Developer', company: 'StartupHub', date: '2023-10-10', status: 'Rejected', statusColor: '#ff7675' },
    { id: 4, title: 'Frontend Engineer', company: 'GlobalTech', date: '2023-10-08', status: 'Applied', statusColor: '#b2bec3' },
  ];

  return (
    <div className="applications-container">
      <header className="applications-header">
        <h1 className="section-title">My Applications</h1>
        <div className="filter-group">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Pending</button>
          <button className="filter-btn">Interviews</button>
        </div>
      </header>

      <div className="applications-list">
        {applications.map((app) => (
          <div key={app.id} className="application-item">
            <div className="app-info">
              <div className="app-logo-placeholder">{app.company[0]}</div>
              <div>
                <h3 className="app-title">{app.title}</h3>
                <p className="app-company">{app.company}</p>
              </div>
            </div>
            <div className="app-details">
              <span className="app-date">Applied on {app.date}</span>
              <span className="app-status" style={{ backgroundColor: `${app.statusColor}15`, color: app.statusColor }}>
                {app.status}
              </span>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
