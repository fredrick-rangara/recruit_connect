import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call a backend API
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '80px 0', maxWidth: '400px' }}>
      <div className="job-card" style={{ borderLeft: 'none', borderTop: '5px solid var(--primary-color)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#2ecc71', marginBottom: '20px' }}>Check your email for a reset link!</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'block' }}>Return to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label>Email Address</label>
              <input 
                type="email" 
                className="btn" 
                style={{ width: '100%', border: '1px solid #ddd', padding: '12px', marginTop: '5px', cursor: 'text' }} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Reset Link</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
