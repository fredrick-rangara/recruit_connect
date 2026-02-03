import React from 'react';
import './EmployerHome.css';

/**
 * EmployerHome: Overview of hiring activity for the employer.
 */
const EmployerHome = () => {
  const stats = [
    { label: 'Total Postings', value: '3', trend: 'All active', color: '#6c5ce7' },
    { label: 'New Applicants', value: '24', trend: '+5 since yesterday', color: '#00b894' },
    { label: 'Interviews', value: '8', trend: '3 scheduled today', color: '#0984e3' },
    { label: 'Unread Feedbacks', value: '12', trend: 'Action required', color: '#fdcb6e' },
  ];

  return (
    <div className="employer-home">
      <header className="page-header">
        <h1>Hiring Performance</h1>
        <p>Monitor your company's recruitment progress and team growth.</p>
      </header>

      <div className="stats-strip">
        {stats.map((stat) => (
          <div key={stat.label} className="employer-stat-card">
            <span className="stat-label">{stat.label}</span>
            <h2 className="stat-value">{stat.value}</h2>
            <p className="stat-trend" style={{ color: stat.color }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="quick-actions-grid">
        <section className="action-card">
          <h3>Need to hire?</h3>
          <p>Create a high-impact job posting and reach qualified candidates across the globe.</p>
          <button className="create-job-btn">Post New Job</button>
        </section>

        <section className="action-card secondary">
          <h3>Company Brand</h3>
          <p>Update your company profile and mission to attract the best cultural fits.</p>
          <button className="settings-btn">Manage Settings</button>
        </section>
      </div>
    </div>
  );
};

export default EmployerHome;
