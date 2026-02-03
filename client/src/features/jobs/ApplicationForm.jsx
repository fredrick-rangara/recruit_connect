import React, { useState } from 'react';
import './ApplicationForm.css';

/**
 * ApplicationForm Component: Handles the submission of a job application.
 */
const ApplicationForm = ({ jobTitle, company, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: 'Abigael', // Pre-filled for demo
    email: 'abigael@example.com',
    resume: null,
    coverLetter: '',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulated submission logic
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="application-success">
        <h2>Application Sent!</h2>
        <p>Your application for <strong>{jobTitle}</strong> at <strong>{company}</strong> has been successfully submitted. The hiring team will review it shortly.</p>
        <button className="done-btn" onClick={onClose}>Done</button>
      </div>
    );
  }

  return (
    <div className="application-form-wrapper">
      <div className="form-header">
        <h2>Apply for {jobTitle}</h2>
        <p>{company}</p>
        <button className="close-form-btn" onClick={onClose}>Close</button>
      </div>
      
      <form className="app-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" value={formData.fullName} readOnly />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={formData.email} readOnly />
        </div>

        <div className="form-group">
          <label>Upload Resume (PDF)</label>
          <div className="file-input-container">
            <input type="file" accept=".pdf" required />
            <p className="file-hint">Drag and drop or click to upload</p>
          </div>
        </div>

        <div className="form-group">
          <label>Cover Letter (Optional)</label>
          <textarea 
            placeholder="Introduce yourself and explain why you're a great fit for this role..."
            value={formData.coverLetter}
            onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
          ></textarea>
        </div>

        <button type="submit" className="submit-application-btn">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
