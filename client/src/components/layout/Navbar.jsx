import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-brand-purple">RecruitConnect</Link>
      
      <div className="flex gap-8 items-center font-medium text-gray-600">
        <Link to="/jobs" className="hover:text-brand-purple">Find Jobs</Link>
        <Link to="/about" className="hover:text-brand-purple">About</Link>
        
        {isAuthenticated ? (
          <>
            <Link 
              to={role === 'employer' ? '/recruitment-hub' : '/dashboard'} 
              className="hover:text-brand-purple"
            >
              Dashboard
            </Link>
            <button 
              onClick={() => dispatch(logout())}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="px-5 py-2">Login</Link>
            <Link to="/signup" className="bg-brand-purple text-white px-5 py-2 rounded-xl shadow-md">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;