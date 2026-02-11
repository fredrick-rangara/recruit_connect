import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import JobCard from '../components/JobCard';

function EmployerProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd have a specific endpoint for companies
    // For now, we'll fetch jobs and extract company info or add a company endpoint
    API.get(`/jobs`).then(res => {
      const found = res.data.find(j => j.company.id === parseInt(id));
      if (found) setCompany(found.company);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading Profile...</div>;
  if (!company) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Company not found</div>;

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="job-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '40px', borderLeft: 'none', borderTop: '8px solid var(--primary-color)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{company.name}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto 20px' }}>
          {company.description || "Building the future of technology and innovation."}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: 'var(--primary-color)', fontWeight: '600' }}>
          <span>Location: {company.location}</span>
          <a href={company.website} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>Website</a>
        </div>
      </div>

      <section>
        <h2 style={{ marginBottom: '30px' }}>Open Roles at {company.name}</h2>
        <div className="job-grid">
          {/* In a real app, this would be filtered by company */}
          <p style={{ color: 'var(--text-light)' }}>View our currently listed positions on the home page.</p>
        </div>
      </section>
    </div>
  );
}

export default EmployerProfile;
