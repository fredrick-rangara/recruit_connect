import React, { useState } from 'react';
import ContactModal from './ContactModal';

function TalentCard({ talent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="horizontal-job-card talent-horizontal-card">
      <div className="job-main-info">
        <div className="company-logo-placeholder" style={{ borderRadius: '50%', background: 'var(--primary-color)', color: 'white' }}>
          {talent.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{talent.username}</h3>
          <p style={{ margin: '4px 0', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '600' }}>
            {talent.email}
          </p>
          <div className="job-details-meta">
            <div className="job-meta-item">
              <span style={{ marginRight: '5px' }}>🌟</span> {talent.interests || 'Multi-disciplinary'}
            </div>
            <div className="job-meta-item" style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ marginRight: '5px' }}>📝</span> {talent.biography || 'Professional talent looking for new opportunities.'}
            </div>
          </div>
        </div>
      </div>
      <button 
        className="btn btn-primary" 
        onClick={() => setIsModalOpen(true)}
        style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: '700' }}
      >
        Contact Talent
      </button>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        talentName={talent.username} 
      />
    </div>
  );
}

export default TalentCard;
