import { Link } from 'react-router-dom';
import { Calendar, Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-white/60 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="bg-[var(--color-primary)] text-white p-1.5 rounded-lg">
                <Calendar className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)]">
                Event<span className="text-[var(--color-primary)]">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
              Your one-stop platform for discovering, organizing, and managing campus events. Personalized for your campus life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <FooterLink to="/">Browse Events</FooterLink>
              <FooterLink to="/leaderboard">Leaderboard</FooterLink>
              <FooterLink to="/bookmarks">Saved Events</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-widest mb-4">Account</h4>
            <ul className="space-y-2.5">
              <FooterLink to="/login">Sign In</FooterLink>
              <FooterLink to="/register">Create Account</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-tertiary)] font-medium flex items-center gap-1">
            © {year} EventHub. Built with <Heart className="w-3 h-3 text-red-400 fill-current inline" /> for campus life.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)] transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)] transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium">
      {children}
    </Link>
  </li>
);

export default Footer;
