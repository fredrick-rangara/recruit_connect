import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FIX 1: Use variables from formData
      const { email, password } = formData;
      
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      
      // FIX 2: res.data contains the info from our backend logic
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user || res.data));
      
      toast.success(`Welcome back, ${res.data.user?.name || 'User'}!`);

      // SUCCESS: Navigate
      navigate(from, { replace: true }); 
      
    } catch (err) {
      console.error("Login detail error:", err.response?.data);
      setError(err.response?.data?.message || 'Invalid email or password');
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex pt-20">
      {/* LEFT SIDE: Brand/Marketing Section */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center p-20 text-white relative overflow-hidden m-4 rounded-[40px]">
        <div className="relative z-10">
          <span className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-4 block">Welcome Back</span>
          <h2 className="text-5xl font-black leading-tight mb-6">Your next big opportunity is just a login away.</h2>
          <p className="text-slate-400 text-xl font-medium">Access your personalized dashboard, track applications, and message recruiters instantly.</p>
        </div>
        
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-purple-600/20 to-transparent"></div>
      </div>

      {/* RIGHT SIDE: Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Sign In</h2>
            <p className="text-slate-500 font-bold">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-50 transition-all font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-sm font-bold text-purple-600 hover:underline">Forgot password?</a>
              </div>
              <input 
                name="password"
                type="password" 
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-50 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-purple-600 text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-purple-100 active:scale-95 flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : 'Sign In to Account'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-bold text-sm">
              New to JobHunter? <Link to="/signup" className="text-purple-600 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}