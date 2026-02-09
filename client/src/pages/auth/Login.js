import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import API from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      dispatch(setCredentials({ 
        token: res.data.access_token, 
        role: res.data.role, 
        user: res.data.name 
      }));
      // Redirect based on role
      navigate(res.data.role === 'employer' ? '/recruitment-hub' : '/dashboard');
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Brand/Image */}
      <div className="hidden lg:flex w-1/2 bg-brand-purple items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-lg opacity-80">Login to stay connected with your professional community and job alerts.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-brand-dark mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">Enter your details to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-purple"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-purple"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <button className="w-full bg-brand-purple text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="text-brand-purple font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;