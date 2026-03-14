import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Calendar } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed w-full top-0 z-50 glass-card border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-black text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <Calendar className="h-5 w-5" strokeWidth={2.5}/>
            </div>
            <span className="font-bold text-xl tracking-tight text-black group-hover:opacity-80 transition-opacity">
              EventHub.
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'organizer' && (
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                )}
                {user.role === 'student' && (
                  <Link to="/my-events" className="nav-link">
                    My RSVPs
                  </Link>
                )}
                <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm shadow-inner cursor-default">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-black transition-colors rounded-full hover:bg-slate-100"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2.5}/>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="nav-link">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
