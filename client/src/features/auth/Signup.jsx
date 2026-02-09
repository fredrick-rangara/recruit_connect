import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'job_seeker' 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Sends role as either 'job_seeker' or 'employer' to Flask
      await api.post('/register', formData);
      alert("Registration successful! Please log in.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="auth-card" style={{ maxWidth: '450px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' }}>Get Started Now</h2>
          <p className="text-muted">Create an account to start your journey</p>
        </div>
        
        {error && (
          <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Full Name</label>
            <input 
              name="username" 
              type="text" 
              className="auth-input"
              placeholder="Enter your name" 
              required 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Email address</label>
            <input 
              name="email" 
              type="email" 
              className="auth-input"
              placeholder="jane@techcorp.com" 
              required 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Password</label>
            <input 
              name="password" 
              type="password" 
              className="auth-input"
              placeholder="••••••••" 
              required 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          </div>

          {/* MODERN ROLE SELECTION CARDS */}
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px' }}>I am a:</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div 
                onClick={() => setFormData({...formData, role: 'job_seeker'})}
                style={{
                  flex: 1, padding: '15px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                  transition: '0.2s', border: formData.role === 'job_seeker' ? '2px solid #6366f1' : '2px solid #f1f5f9',
                  backgroundColor: formData.role === 'job_seeker' ? '#f5f3ff' : 'white'
                }}
              >
                <span style={{ fontSize: '1.2rem', display: 'block' }}>🔍</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: formData.role === 'job_seeker' ? '#6366f1' : '#64748b' }}>Job Seeker</span>
              </div>

              <div 
                onClick={() => setFormData({...formData, role: 'employer'})}
                style={{
                  flex: 1, padding: '15px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                  transition: '0.2s', border: formData.role === 'employer' ? '2px solid #6366f1' : '2px solid #f1f5f9',
                  backgroundColor: formData.role === 'employer' ? '#f5f3ff' : 'white'
                }}
              >
                <span style={{ fontSize: '1.2rem', display: 'block' }}>💼</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: formData.role === 'employer' ? '#6366f1' : '#64748b' }}>Employer</span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-purple-main" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '10px', fontWeight: '700', border: 'none', backgroundColor: '#6366f1', color: 'white', cursor: 'pointer' }}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="or-divider" style={{ textAlign: 'center', margin: '20px 0', color: '#94a3b8', fontSize: '0.8rem' }}>OR</div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="social-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '18px' }} />
            Google
          </button>
          <button type="button" className="social-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{ width: '18px' }} />
            Apple
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;