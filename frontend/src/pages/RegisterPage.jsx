import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, Loader2, Calendar, Eye, EyeOff } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center relative w-full overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-[var(--color-primary)] text-white p-1.5 rounded-lg">
              <Calendar className="h-4.5 w-4.5" strokeWidth={2.5}/>
            </div>
            <span className="font-bold text-lg">Event<span className="text-[var(--color-primary)]">Hub</span></span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Create your account</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1.5">Start discovering campus events</p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 mb-6 rounded-xl text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--color-text-primary)]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
                <input type="text" required placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-tertiary)]"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--color-text-primary)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
                <input type="email" required placeholder="you@university.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-tertiary)]"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--color-text-primary)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
                <input type={showPassword ? "text" : "password"} required placeholder="Min. 6 characters"
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


            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-300 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            <span className="text-xs font-medium text-[var(--color-text-tertiary)]">or</span>
            <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          </div>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
