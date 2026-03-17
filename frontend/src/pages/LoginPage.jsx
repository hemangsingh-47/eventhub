import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Calendar, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center relative w-full overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-[var(--color-primary)] text-white p-1.5 rounded-lg">
              <Calendar className="h-4.5 w-4.5" strokeWidth={2.5}/>
            </div>
            <span className="font-bold text-lg">Event<span className="text-[var(--color-primary)]">Hub</span></span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Welcome back</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1.5">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 mb-6 rounded-xl text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--color-text-primary)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
                <input
                  type="email" required placeholder="you@university.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-tertiary)]"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[var(--color-text-primary)]">Password</label>
                <a href="#" className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-tertiary)] tracking-widest"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-300 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-3.5 h-3.5" strokeWidth={3}/></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            <span className="text-xs font-medium text-[var(--color-text-tertiary)]">or</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          </div>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
              Create one
            </Link>
          </p>

          {/* Admin Access Section */}
          <div className="mt-8 pt-6 border-t border-dashed border-[var(--color-border)]">
            <div className="flex flex-col items-center gap-3">
              <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100/50">
                Admin Access Only
              </div>
              <p className="text-[11px] text-center text-[var(--color-text-tertiary)] max-w-[200px] leading-relaxed">
                Use authorized credentials to manage events and platform settings.
              </p>
              <button 
                type="button"
                onClick={() => {
                  setEmail('admin@eventhub.com');
                  setPassword('admin123');
                }}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Quick Admin Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
