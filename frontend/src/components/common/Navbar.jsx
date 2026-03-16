import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Calendar, Menu, X, LayoutDashboard, Bookmark } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full top-0 z-50 glass border-b border-white/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-primary)] blur-lg opacity-30 group-hover:opacity-50 transition-opacity rounded-lg"></div>
              <div className="relative bg-[var(--color-primary)] text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
                <Calendar className="h-4.5 w-4.5" strokeWidth={2.5}/>
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)]">
              Event<span className="text-[var(--color-primary)]">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" active={isActive('/')}>Events</NavLink>
            {user && (
              <NavLink to="/bookmarks" active={isActive('/bookmarks')}>
                <Bookmark className="w-3.5 h-3.5" />Saved
              </NavLink>
            )}
            {user?.role === 'organizer' && (
              <NavLink to="/dashboard" active={isActive('/dashboard')}>
                <LayoutDashboard className="w-3.5 h-3.5" />Dashboard
              </NavLink>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-tertiary)] border border-[var(--color-border)]">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-red-50 transition-all rounded-xl"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2.5}/>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-xl hover:bg-[var(--color-surface-tertiary)]">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px transition-all duration-300"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-[var(--color-border)] mt-2 animate-fade-in-up">
            <MobileLink to="/" onClick={() => setMobileOpen(false)}>Events</MobileLink>
            {user && <MobileLink to="/bookmarks" onClick={() => setMobileOpen(false)}>Saved Events</MobileLink>}
            {user?.role === 'organizer' && <MobileLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>}
            {!user ? (
              <>
                <MobileLink to="/login" onClick={() => setMobileOpen(false)}>Log in</MobileLink>
                <MobileLink to="/register" onClick={() => setMobileOpen(false)}>Sign up</MobileLink>
              </>
            ) : (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, children }) => (
  <Link to={to} className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${active ? 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)]'}`}>
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} className="block px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
    {children}
  </Link>
);

export default Navbar;
