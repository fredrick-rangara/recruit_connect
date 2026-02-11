import React from 'react';

function AboutUs() {
  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '1000px' }}>
      <section style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Building the Future of Recruitment
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
          RecruitConnect is more than just a job board. We are a talent ecosystem designed to bridge the gap between visionary companies and world-class professionals.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '80px' }}>
        <div className="job-card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1e293b' }}>Our Mission</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            To empower Every individual with the tools they need to find purposeful work, and every employer with the talent to build incredible things.
          </p>
        </div>
        <div className="job-card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1e293b' }}>Our Vision</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            A world where recruitment is transparent, real-time, and human-centric, powered by intelligent design and seamless technology.
          </p>
        </div>
      </div>

      <section style={{ background: '#f8fafc', padding: '60px', borderRadius: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Why RecruitConnect?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', marginTop: '40px' }}>
          {['Real-time Pipeline', 'High-end UI', 'Direct Communication', 'Curated Talent'].map((feature) => (
            <div key={feature} style={{ background: 'white', padding: '15px 30px', borderRadius: '50px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontWeight: '600', color: '#3b82f6' }}>
              {feature}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
