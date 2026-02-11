import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Safely get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role; 

  const handleLogout = () => {
    localStorage.clear(); // Clears everything (token, user, role)
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO & PRIMARY NAV */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black tracking-tighter text-purple-600 hover:opacity-80 transition-opacity">
            RECRUIT CONNECT
          </Link>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <Link to="/" className="hover:text-purple-600 transition-colors">Find Jobs</Link>
            
            {/* Added Static Links */}
            <Link to="/about" className="hover:text-purple-600 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
            
            {/* Conditional Dashboard Links */}
            {token && userRole === 'employer' && (
              <Link 
                to="/dashboard" 
                className="text-purple-600 hover:text-black transition-colors flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                Employer Console
              </Link>
            )}

            {token && userRole === 'seeker' && (
              <Link to="/applications" className="hover:text-purple-600 transition-colors text-purple-600">
                My Applications
              </Link>
            )}
          </div>
        </div>
        
        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-6">
          {!token ? (
            <>
              <Link 
                to="/login" 
                className="text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-purple-600 text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-black hover:shadow-xl hover:shadow-purple-100 transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profile Avatar Placeholder */}
              <div className="flex items-center gap-3 pr-2">
                <span className="text-xs font-bold text-slate-400 hidden sm:block">
                  {user.name || 'Account'}
                </span>
                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                  {userRole === 'employer' ? 'EMP' : 'SEEK'}
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}