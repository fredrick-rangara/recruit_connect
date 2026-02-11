import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { loginSuccess } from '../store/authSlice';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'seeker'
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/signup', formData);
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="container" style={{ padding: '80px 0', maxWidth: '450px' }}>
      <div className="job-card" style={{ borderLeft: 'none', borderTop: '5px solid var(--primary-color)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Username</label>
            <input 
              type="text" 
              className="btn" 
              style={{ width: '100%', border: '1px solid #ddd', cursor: 'text', padding: '12px', marginTop: '5px' }} 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input 
              type="email" 
              className="btn" 
              style={{ width: '100%', border: '1px solid #ddd', cursor: 'text', padding: '12px', marginTop: '5px' }} 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password</label>
            <input 
              type="password" 
              className="btn" 
              style={{ width: '100%', border: '1px solid #ddd', cursor: 'text', padding: '12px', marginTop: '5px' }} 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label>I am a:</label>
            <select 
              className="btn" 
              style={{ width: '100%', border: '1px solid #ddd', padding: '12px', marginTop: '5px' }}
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
