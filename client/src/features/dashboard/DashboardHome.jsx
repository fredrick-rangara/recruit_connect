import React from 'react';
import './DashboardHome.css';

/**
 * DashboardHome: The default view (overview) for the Job Seeker.
 * Features stats and quick actions.
 */
const DashboardHome = () => {
  const stats = [
    { label: 'Total Applications', value: '12', icon: '📝', trend: '+2 this week', color: '#6c5ce7' },
    { label: 'Profile Views', value: '45', icon: '👤', trend: '+10% from last month', color: '#00b894' },
    { label: 'Unread Messages', value: '3', icon: '💬', trend: 'Response expected', color: '#0984e3' },
    { label: 'Saved Jobs', value: '8', icon: '🔖', trend: '2 expiring soon', color: '#fdcb6e' },
  ];

  return (
    <div className="dashboard-home">
      <header className="dashboard-header">
        <div>
          <h1 className="welcome-text">Dashboard Overview</h1>
          <p className="welcome-subtext">Hey Abigael, here's what's happening today.</p>
        </div>
        <button className="primary-action-btn">+ Browse New Jobs</button>
      </header>

      {/* Stats Grid */}
      <section className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-header">
              <span className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </span>
              <span className="stat-trend">{stat.trend}</span>
            </div>
            <div className="stat-body">
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Activity Placeholder */}
      <section className="recent-activity">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <p>You haven't applied to any jobs today. Start your search now! 🚀</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
