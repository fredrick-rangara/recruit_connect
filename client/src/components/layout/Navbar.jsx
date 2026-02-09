import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">RecruitConnect</Link>

        <div className="flex items-center gap-6">
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium">Browse Jobs</Link>
          
          {user ? (
            <>
              {/* Dynamic Dashboard Link based on Role */}
              <Link to={user.role === 'employer' ? '/dashboard' : '/my-applications'} className="text-gray-600 hover:text-blue-600">
                {user.role === 'employer' ? 'Employer Dashboard' : 'My Apps'}
              </Link>
              <span className="text-gray-800 font-semibold border-l pl-4">{user.name}</span>
              <button 
                onClick={() => dispatch(logout())}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
              {/* THE MISSING REGISTER BUTTON */}
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;