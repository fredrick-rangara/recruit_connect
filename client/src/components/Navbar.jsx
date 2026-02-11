import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, loginSuccess } from '../store/authSlice';
import API from '../api';

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = React.useState(false);
  const [showSignup, setShowSignup] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const [authData, setAuthData] = React.useState({
    username: '',
    email: '',
    password: '',
    role: 'seeker'
  });

  const handleAuth = async (type, e) => {
    e.preventDefault();
    try {
      const endpoint = type === 'login' ? '/auth/login' : '/auth/signup';
      const payload = type === 'login' ? { email: authData.email, password: authData.password } : authData;
      const response = await API.post(endpoint, payload);
      dispatch(loginSuccess(response.data));
      setShowLogin(false);
      setShowSignup(false);

      if (response.data.user.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(`${type} failed: ` + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/images/logo.png" alt="Logo" style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
          RecruitConnect
        </Link>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobs" onClick={() => setMenuOpen(false)}>Find Jobs</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'employer' ? '/employer-dashboard' : '/dashboard'} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button className="btn btn-primary" onClick={() => { 
                dispatch(logout()); 
                setMenuOpen(false);
                navigate('/');
              }}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-link" onClick={() => { setShowLogin(true); setMenuOpen(false); }}>Login</button>
              <button className="btn btn-primary" style={{ color: 'white' }} onClick={() => { setShowSignup(true); setMenuOpen(false); }}>Sign Up</button>
            </>
          )}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Auth Modals */}
      {(showLogin || showSignup) && (
        <div className="modal-overlay" onClick={() => { setShowLogin(false); setShowSignup(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => { setShowLogin(false); setShowSignup(false); }}>&times;</button>
            <h2 style={{ marginBottom: '20px' }}>{showLogin ? 'Login' : 'Create Account'}</h2>
            <form onSubmit={e => handleAuth(showLogin ? 'login' : 'signup', e)}>
              {showSignup && (
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" placeholder="johndoe" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} required />
                </div>
              )}
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="john@example.com" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} required />
              </div>
              {showSignup && (
                <div className="form-group">
                  <label>I am a:</label>
                  <select value={authData.role} onChange={e => setAuthData({...authData, role: e.target.value})}>
                    <option value="seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                {showLogin ? 'Login to RecruitConnect' : 'Create Account'}
              </button>
            </form>
            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
              {showLogin ? "Don't have an account? " : "Already have an account? "}
              <span 
                className="link-text" 
                onClick={() => { setShowLogin(!showLogin); setShowSignup(!showSignup); }}
                style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {showLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
