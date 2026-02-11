import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { loginSuccess } from '../store/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', { email, password });
      dispatch(loginSuccess(response.data));
      // Redirect based on role
      if (response.data.user.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="container" style={{ padding: '80px 0', maxWidth: '400px' }}>
      <div className="job-card" style={{ borderLeft: 'none', borderTop: '5px solid var(--primary-color)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Email</label>
            <input 
              type="email" 
              className="btn" 
              style={{ width: '100%', border: '1px solid #ddd', cursor: 'text', padding: '12px', marginTop: '5px' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label>Password</label>
            <input 
              type="password" 
              className="btn" 
              style={{ width: '100%', border: '1px solid #ddd', cursor: 'text', padding: '12px', marginTop: '5px' }} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/reset-password" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
