import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="flex-grow flex items-center justify-center relative w-full overflow-hidden px-4 md:py-12 py-6">
      
      {/* Premium Background */}
      <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] bg-purple-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-8 md:p-12 relative z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-black mb-3">Create an account</h2>
          <p className="text-sm text-slate-500 font-medium tracking-wide">Join Campus Event Hub today.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-2xl text-sm font-medium text-center border border-red-100 animate-fade-in-up">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 relative group">
            <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-black transition-colors" />
              </div>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-slate-200 bg-white/50 border focus:border-black focus:ring-0 text-slate-900 transition-all text-sm outline-none placeholder:text-slate-400 font-medium hover:border-slate-300 focus:bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1 relative group">
            <label className="text-[13px] font-semibold text-slate-700 ml-1">Email Address</label>
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
            <label className="text-[13px] font-semibold text-slate-700 ml-1">Strong Password</label>
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

          <div className="space-y-1 relative group">
            <label className="text-[13px] font-semibold text-slate-700 ml-1">Account Role</label>
            <div className="relative mt-1">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full pl-11 pr-10 py-3.5 rounded-2xl border-slate-200 bg-white/50 border focus:border-blue-500 focus:ring-0 text-slate-900 transition-all text-sm outline-none font-semibold hover:border-slate-300 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="student" className="font-medium text-slate-900 py-2">👨‍🎓 Student Attendee</option>
                <option value="organizer" className="font-medium text-slate-900 py-2">📋 Event Organizer</option>
              </select>
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
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline underline-offset-4 font-bold transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
