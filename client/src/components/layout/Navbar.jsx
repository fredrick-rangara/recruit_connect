import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { LogOut, User, Briefcase } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Briefcase size={24} />
          <span>RecruitConnect</span>
        </Link>

        <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium">
          Browse Jobs
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-gray-600 flex items-center gap-2">
                <User size={18} /> {user.full_name}
              </span>
              <button 
                onClick={() => dispatch(logout())}
                className="flex items-center gap-1 text-red-500 hover:text-red-700"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;