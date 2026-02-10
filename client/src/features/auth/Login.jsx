import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../../store/authSlice';
import api from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/login', formData);
      dispatch(setCredentials(response.data));
      
      // Navigate based on user role
      if (response.data.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Welcome back!</h2>
          <p className="text-muted">Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input 
              name="email"
              type="email" 
              placeholder="jane@techcorp.com"
              value={formData.email}
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="btn-purple" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="or-divider">or</div>

        <div className="social-login-container">
          <button type="button" className="social-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
            <span>Google</span>
          </button>
          <button type="button" className="social-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            <span>Apple</span>
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--figma-purple)', fontWeight: '700', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;