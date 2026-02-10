import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-5 bg-white shadow-sm">
      <div className="text-2xl font-bold text-slate-900">
        Recruit<span className="text-indigo-600">Connect</span>
      </div>
      
      <ul className="hidden md:flex space-x-8 text-slate-600 font-medium">
        <li className="hover:text-indigo-600 cursor-pointer">Home</li>
        <li className="hover:text-indigo-600 cursor-pointer">Find Jobs</li>
        <li className="hover:text-indigo-600 cursor-pointer">Employers</li>
        <li className="hover:text-indigo-600 cursor-pointer">Admin</li>
      </ul>

      <div className="flex items-center space-x-4">
        <button className="text-slate-700 font-semibold px-4 py-2 hover:text-indigo-600">Login</button>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;