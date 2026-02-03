import React, { useState } from 'react';
import './ATSView.css';

/**
 * ATSView Component: The core candidate management interface.
 * Allows recruiters to track applicants through various stages.
 */
const ATSView = () => {
  // Mock data for applicants
  const [applicants, setApplicants] = useState([
    { id: 1, name: 'Alice Johnson', job: 'Senior Frontend Developer', stage: 'Screening', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', job: 'UI/UX Product Designer', stage: 'Interviewing', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Davis', job: 'Senior Frontend Developer', stage: 'New', email: 'charlie@example.com' },
    { id: 4, name: 'Diana Prince', job: 'Backend Engineer', stage: 'Hired', email: 'diana@example.com' },
    { id: 5, name: 'Ethan Hunt', job: 'Mobile Lead', stage: 'Rejected', email: 'ethan@example.com' },
  ]);

  const stages = ['New', 'Screening', 'Interviewing', 'Hired', 'Rejected'];

  const moveStage = (id, newStage) => {
    setApplicants(applicants.map(app => 
      app.id === id ? { ...app, stage: newStage } : app
    ));
  };

  return (
    <div className="ats-container">
      <header className="page-header">
        <h1>Talent Pipeline</h1>
        <p>Manage candidate progress and collaborate on hiring decisions.</p>
      </header>

      <div className="ats-board">
        {stages.map(stage => (
          <div key={stage} className="ats-column">
            <div className="column-header">
              <h3>{stage}</h3>
              <span className="count-pill">{applicants.filter(a => a.stage === stage).length}</span>
            </div>
            
            <div className="column-content">
              {applicants.filter(a => a.stage === stage).map(applicant => (
                <div key={applicant.id} className="applicant-card">
                  <div className="applicant-info">
                    <h4 className="app-name">{applicant.name}</h4>
                    <p className="app-job">{applicant.job}</p>
                  </div>
                  
                  <div className="card-actions">
                    <select 
                      className="stage-select"
                      value={applicant.stage}
                      onChange={(e) => moveStage(applicant.id, e.target.value)}
                    >
                      {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              
              {applicants.filter(a => a.stage === stage).length === 0 && (
                <div className="empty-column-msg">No candidates</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATSView;
