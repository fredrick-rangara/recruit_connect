import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Signup = () => {
  const [role, setRole] = useState('seeker');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', { ...formData, role });
      alert("Registration successful! You can now log in.");
      navigate('/login');
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-brand-dark mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Join RecruitConnect and start your journey.</p>

          {/* Role Selection Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${role === 'seeker' ? 'bg-white shadow text-brand-purple' : 'text-gray-500'}`}
              onClick={() => setRole('seeker')}
            >
              Job Seeker
            </button>
            <button 
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${role === 'employer' ? 'bg-white shadow text-brand-purple' : 'text-gray-500'}`}
              onClick={() => setRole('employer')}
            >
              Employer
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <input 
              type="text" placeholder="Full Name" 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-purple"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              type="email" placeholder="Email Address" 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-purple"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input 
              type="password" placeholder="Create Password" 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-purple"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button className="w-full bg-brand-purple text-white py-3 rounded-xl font-bold mt-4">
              Register Now
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account? <Link to="/login" className="text-brand-purple font-bold">Login</Link>
          </p>
        </div>
      </div>

      {/* Right side - Dark brand side */}
      <div className="hidden lg:flex w-1/2 bg-brand-dark items-center justify-center p-12 text-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-purple rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg">RC</div>
          <h2 className="text-3xl font-bold mb-4">The #1 Talent Hub</h2>
          <p className="text-gray-400">Connecting elite talent with world-class companies since 2024.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;