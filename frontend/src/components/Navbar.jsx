import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role; 

  const handleLogout = () => {
    localStorage.clear();
    setIsOpen(false);
    navigate('/login');
  };

  const handleFindJobsScroll = (e) => {
    setIsOpen(false); // Close menu on click
    if (location.pathname === '/') {
      e.preventDefault();
      const section = document.getElementById('job-listings');
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black tracking-tighter text-purple-600 hover:opacity-80 transition-opacity">
            RECRUIT CONNECT
          </Link>
          
          {/* DESKTOP NAV (Hidden on Mobile) */}
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <Link to="/" onClick={handleFindJobsScroll} className="hover:text-purple-600 transition-colors">Find Jobs</Link>
            <Link to="/about" className="hover:text-purple-600 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
            {token && userRole === 'employer' && (
              <Link to="/dashboard" className="text-purple-600 font-bold">Employer Console</Link>
            )}
          </div>
        </div>
        
        {/* AUTH & HAMBURGER */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Buttons (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6">
            {!token ? (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-purple-600">Login</Link>
                <Link to="/signup" className="bg-purple-600 text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">Logout</button>
            )}
          </div>

          {/* HAMBURGER BUTTON (Visible only on Mobile) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-purple-600 transition-colors"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={handleFindJobsScroll} className="text-lg font-bold text-slate-900">Find Jobs</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-900">About Us</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-900">Contact Us</Link>
          
          <hr className="border-slate-100" />
          
          {!token ? (
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center font-bold text-slate-600 py-3">Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-purple-600 text-white text-center py-4 rounded-2xl font-black">Sign Up</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="bg-red-50 text-red-500 py-4 rounded-2xl font-black">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}