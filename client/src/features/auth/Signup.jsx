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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Get Started Now</h2>
          <p className="text-muted">Create an account to start your journey</p>
        </div>
        
        {error && (
          <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              name="username" 
              type="text" 
              placeholder="Enter your name" 
              required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="jane@techcorp.com" 
              required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>I am a:</label>
            <div className="role-selection">
              <button 
                type="button" 
                className={`role-btn ${formData.role === 'job_seeker' ? 'active' : ''}`} 
                onClick={() => setFormData({...formData, role: 'job_seeker'})}
              >
                Job Seeker
              </button>
              <button 
                type="button" 
                className={`role-btn ${formData.role === 'employer' ? 'active' : ''}`} 
                onClick={() => setFormData({...formData, role: 'employer'})}
              >
                Employer
              </button>
            </div>
          </div>

          <button type="submit" className="btn-purple" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="or-divider">or</div>

        <div className="social-login-container">
          <button type="button" className="social-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
            Google
          </button>
          <button type="button" className="social-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            Apple
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--figma-purple)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;