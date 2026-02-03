import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from './authSlice';
import './Login.css';

/**
 * Login Component: Handles user authentication by taking email and password 
 * and updating the global Redux state.
 */
const Login = () => {
  // Local state for the login form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'job_seeker', // New: Track role during login
  });
  
  // State for handling potential errors and loading status
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * handleChange: Updates the local state as the user types in the form fields.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit: Processes the login request.
   * Currently uses a mock timeout to simulate an API request.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock login logic - this will be replaced with a real fetch/axios call later
      setTimeout(() => {
        if (formData.email && formData.password) {
          // Dispatching success to the Redux store with the selected role
          dispatch(setCredentials({
            user: { name: 'Demo User', email: formData.email },
            token: 'mock-jwt-token',
            role: formData.role,
          }));
          
          // Redirect the user based on their specific role
          if (formData.role === 'employer') {
            navigate('/employer');
          } else {
            navigate('/');
          }
        } else {
          setError('Invalid email or password');
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your RecruitConnect account</p>
        
        {/* Render error message if it exists */}
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Login as:</label>
            <div className="role-selector">
              <label className={`role-option ${formData.role === 'job_seeker' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="job_seeker"
                  checked={formData.role === 'job_seeker'}
                  onChange={handleChange}
                />
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
                <div className="role-text">Employer</div>
              </label>
            </div>
          </div>
          
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
          
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" title="Coming soon">Forgot password?</Link>
          </div>
          
          {/* Submit button with loading state */}
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
