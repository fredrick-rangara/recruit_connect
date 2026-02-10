import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
        Connecting talent with <span style={{ color: 'var(--figma-purple)' }}>opportunity</span>.
      </h1>
      <p className="subtitle" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
        Recruit Connect was founded with a simple goal: to make the hiring process transparent, efficient, and human. 
        Whether you are an employer looking for your next star hire or a seeker looking for your dream role, 
        we provide the tools to make it happen.
      </p>
      
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="job-card-figma">
          <h4>For Seekers</h4>
          <p>Track your applications in real-time and get direct feedback from employers.</p>
        </div>
        <div className="job-card-figma">
          <h4>For Employers</h4>
          <p>Manage applicants with our built-in ATS and find the best fit faster.</p>
        </div>
      </div>
    </div>
  );
};

export default About;