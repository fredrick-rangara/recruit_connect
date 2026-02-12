import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [role, setRole] = useState('seeker'); // Default role
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { 
      full_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email, 
      password: formData.password,
      role: role 
    };
    
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/register', finalData);
      navigate('/login');
    } catch (err) {
      console.error("Signup failed", err);
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex pt-20">
      {/* Left Side (Same as before) */}
      <div className="hidden lg:flex w-1/2 bg-purple-600 items-center justify-center p-20 text-white relative overflow-hidden m-4 rounded-[40px]">
        <div className="relative z-10">
          <h2 className="text-5xl font-black leading-tight mb-6">Join thousands of professionals.</h2>
          <p className="text-purple-100 text-xl font-medium">Choose your path and start your journey today.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20">
        <div className="max-w-md w-full">
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-slate-500 font-bold mb-8">Choose how you want to use Recruit Connect.</p>

          {/* ROLE SELECTOR CARDS */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('seeker')}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                role === 'seeker' 
                ? 'border-purple-600 bg-purple-50' 
                : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">🔍</div>
              <div className="font-black text-slate-900">Job Seeker</div>
              <div className="text-xs text-slate-500 font-bold">I want to find a job</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                role === 'employer' 
                ? 'border-purple-600 bg-purple-50' 
                : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">💼</div>
              <div className="font-black text-slate-900">Employer</div>
              <div className="text-xs text-slate-500 font-bold">I want to hire talent</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
              <input name="firstName" onChange={handleChange} type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all" placeholder="John" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
              <input name="lastName" onChange={handleChange} type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all" placeholder="Doe" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input name="email" onChange={handleChange} type="email" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all" placeholder="john@example.com" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input name="password" onChange={handleChange} type="password" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all" placeholder="••••••••" />
            </div>
            <button className="col-span-2 mt-4 bg-purple-600 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-purple-100">
              Create {role === 'seeker' ? 'Seeker' : 'Employer'} Account
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-bold text-sm">
            Already a member? <Link to="/login" className="text-purple-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}