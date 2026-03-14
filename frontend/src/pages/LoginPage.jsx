import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="flex-grow flex items-center justify-center relative w-full overflow-hidden px-4">
      
      {/* Premium Background Orbs for Auth */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-10 md:p-12 relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-6 text-black border border-slate-200/60 shadow-sm">
            <Lock className="w-5 h-5" strokeWidth={2.5}/>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-3">Welcome back</h2>
          <p className="text-sm text-slate-500 font-medium tracking-wide">Enter your details to sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-2xl text-sm font-medium text-center border border-red-100 animate-fade-in-up">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 relative group">
            <label className="text-[13px] font-semibold text-slate-700 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-black transition-colors" />
              </div>
              <input
                type="email"
                required
                placeholder="you@university.edu"
                className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-slate-200 bg-white/50 border focus:border-black focus:ring-0 text-slate-900 transition-all text-sm outline-none placeholder:text-slate-400 font-medium hover:border-slate-300 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1 relative group">
             <div className="flex justify-between items-center ml-1">
                <label className="text-[13px] font-semibold text-slate-700">Password</label>
                <a href="#" className="text-[13px] font-medium text-blue-600 hover:text-black transition-colors">Forgot password?</a>
             </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-black transition-colors" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-slate-200 bg-white/50 border focus:border-black focus:ring-0 text-slate-900 transition-all text-sm outline-none placeholder:text-slate-400 font-medium hover:border-slate-300 focus:bg-white tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative flex items-center justify-center gap-2 py-4 px-4 mt-8 rounded-2xl text-sm font-bold text-white bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 hover:-translate-y-0.5 shadow-lg shadow-black/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 ml-1 opacity-70" strokeWidth={3}/>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] font-medium text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-black hover:underline underline-offset-4 font-bold transition-all">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
