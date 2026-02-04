import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from './authSlice';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker', // default role
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Mock signup logic
    try {
      setTimeout(() => {
        dispatch(setCredentials({
          user: { name: formData.name, email: formData.email },
          token: 'mock-jwt-token',
          role: formData.role,
        }));
        navigate('/');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('An error occurred during signup');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join RecruitConnect to find your next opportunity</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>I am a:</label>
            <div className="role-selector">
              <label className={`role-option ${formData.role === 'job_seeker' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="job_seeker"
                  checked={formData.role === 'job_seeker'}
                  onChange={handleChange}
                />
                <div className="role-icon">👤</div>
                <div className="role-text">Job Seeker</div>
              </label>
              <label className={`role-option ${formData.role === 'employer' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="employer"
                  checked={formData.role === 'employer'}
                  onChange={handleChange}
                />
                <div className="role-icon">💼</div>
                <div className="role-text">Employer</div>
              </label>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
