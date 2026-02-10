import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const [role, setRole] = useState('job-seeker'); // 'job-seeker' or 'employer'
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Get Started Now</h2>
          <p className="text-slate-500 mb-8">Create your account to start your journey.</p>

          {/* User Role Selection */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setRole('job-seeker')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${role === 'job-seeker' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500'}`}
            >
              <User size={18} />
              <span className="font-semibold text-sm">Job Seeker</span>
            </button>
            <button 
              onClick={() => setRole('employer')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${role === 'employer' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500'}`}
            >
              <Building2 size={18} />
              <span className="font-semibold text-sm">Employer</span>
            </button>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input type="text" placeholder="Enter your name" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input type="email" placeholder="Enter your email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition" />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a password" 
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="terms" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <label htmlFor="terms" className="text-sm text-slate-500">I agree to the Terms & Conditions</label>
            </div>

            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image/Branding */}
        <div className="hidden md:block w-1/2 relative bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
            alt="Office space" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
            <h3 className="text-4xl font-bold mb-4 italic">"Find the best talent or the best jobs with RecruitConnect."</h3>
            <div className="w-20 h-1 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;