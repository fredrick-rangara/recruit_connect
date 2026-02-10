import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* Left Side (Now Right for variety): Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 mb-8">Please enter your details to sign in.</p>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-indigo-600 hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Sign In
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-slate-100 w-full"></div>
              <span className="bg-white px-4 text-xs text-slate-400 uppercase tracking-widest absolute">Or continue with</span>
            </div>
            
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                <span className="text-sm font-semibold">Google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="h-5 w-5" alt="LinkedIn" />
                <span className="text-sm font-semibold">LinkedIn</span>
              </button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>

        {/* Right Side (Now Left): Visual Branding */}
        <div className="hidden md:block w-1/2 relative bg-indigo-600">
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" 
            alt="Collaboration" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-white">
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl">
              <Lock size={48} className="text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Secure Access</h3>
            <p className="text-center text-indigo-100 leading-relaxed">
              Log in to manage your applications, update your profile, and connect with top-tier employers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;