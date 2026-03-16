import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CalendarPlus, Image, MapPin, Clock, Users, Tag, FileText, Loader2, ArrowLeft, CheckCircle, X, Brain } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { useAI } from '../hooks/useAI';
import { Sparkles } from 'lucide-react';

const categories = [
  { value: 'hackathon', label: '💻 Hackathon' },
  { value: 'workshop', label: '🔧 Workshop' },
  { value: 'seminar', label: '🎤 Seminar' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'tech', label: '🚀 Tech' },
  { value: 'design', label: '🎨 Design' },
  { value: 'coding', label: '👨‍💻 Coding' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'E-sports', label: '🎮 E-sports' },
  { value: 'other', label: '📌 Other' },
];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', location: '', category: 'hackathon', totalSeats: '', imageUrl: '', tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { call: generateDescription, loading: isGenerating } = useAI('generate-description');
  const { call: predictAttendance, loading: isPredicting } = useAI('predict-attendance');
  const [prediction, setPrediction] = useState(null);

  // Trigger prediction when key fields are filled
  useEffect(() => {
    const triggerPrediction = async () => {
      if (form.title && form.category && form.totalSeats && form.date) {
        const result = await predictAttendance(form);
        if (result) setPrediction(result);
      }
    };
    const handler = setTimeout(triggerPrediction, 1000);
    return () => clearTimeout(handler);
  }, [form.title, form.category, form.totalSeats, form.date]);

  const handleAIDescription = async () => {
    if (!form.title || !form.category) {
      alert('Please fill in Event Title and Category first.');
      return;
    }

    const result = await generateDescription({
      title: form.title,
      category: form.category,
      date: form.date,
      location: form.location
    });

    if (result?.description) {
      // Typewriter effect
      setIsTyping(true);
      setForm(prev => ({ ...prev, description: '' }));
      const words = result.description.split(' ');
      let currentDesc = '';
      
      for (let i = 0; i < words.length; i++) {
        currentDesc += words[i] + ' ';
        const tempDesc = currentDesc;
        setTimeout(() => {
          setForm(prev => ({ ...prev, description: tempDesc }));
          if (i === words.length - 1) setIsTyping(false);
        }, i * 50);
      }
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setError(null);
    try {
      await api.post('/events', { ...form, totalSeats: parseInt(form.totalSeats), tags: form.tags });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex-grow flex items-center justify-center animate-fade-in-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-pulse-glow" style={{boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'}}>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Event Published!</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      
      <div className="max-w-2xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Create New Event</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Fill in the details to publish a new campus event</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 mb-6 rounded-xl text-sm font-medium text-center border border-red-100">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Event Title" icon={<CalendarPlus/>} name="title" type="text" required placeholder="e.g. Campus Hackathon 2026" value={form.title} onChange={handleChange} />
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--color-text-primary)]">Description</label>
              <textarea name="description" required placeholder="Describe the event..." rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-tertiary)] resize-none"
                value={form.description} onChange={handleChange}
                disabled={isTyping}
              />
              <button
                type="button"
                onClick={handleAIDescription}
                disabled={isGenerating || isTyping}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5" /> {form.description ? 'Regenerate with AI' : '✦ Generate with AI'}</>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date" icon={<CalendarPlus/>} name="date" type="date" required value={form.date} onChange={handleChange} />
              <FormField label="Time" icon={<Clock/>} name="time" type="text" required placeholder="e.g. 10:00 AM" value={form.time} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Location" icon={<MapPin/>} name="location" type="text" required placeholder="Engineering Hall B" value={form.location} onChange={handleChange} />
              <FormField label="Total Seats" icon={<Users/>} name="totalSeats" type="number" required placeholder="200" value={form.totalSeats} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--color-text-primary)]">Category</label>
                <select name="category" required value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition-all appearance-none cursor-pointer"
                >
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <FormField label="Image URL" icon={<Image/>} name="imageUrl" type="url" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                Tags <span className="text-xs font-normal text-[var(--color-text-tertiary)]">(powers AI recommendations)</span>
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus-within:bg-white focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all min-h-[48px]">
                {form.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/50">
                    {tag}
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={form.tags.length === 0 ? 'Type a tag and press Enter...' : ''}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                      e.preventDefault();
                      const newTag = tagInput.trim().toLowerCase();
                      if (!form.tags.includes(newTag)) {
                        setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
                      }
                      setTagInput('');
                    }
                  }}
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
                />
              </div>
            </div>

            {/* AI Prediction Section */}
            {prediction && (
              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 animate-premium-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-bold text-violet-900">AI Attendance Prediction</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    prediction.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' : 
                    prediction.confidence === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {prediction.confidence} Confidence
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/50 p-3 rounded-xl border border-violet-100/50">
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-tight">Expected RSVPs</p>
                    <p className="text-xl font-black text-violet-700">~{prediction.predictedRSVPs}</p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-xl border border-violet-100/50">
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-tight">Expected Turnout</p>
                    <p className="text-xl font-black text-violet-700">~{prediction.predictedAttendance}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-violet-900 flex items-center gap-1.5 mt-1">
                    <Sparkles className="w-3 h-3" /> AI Optimization Tips
                  </p>
                  <ul className="space-y-1.5">
                    {prediction.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-violet-700/80 flex items-start gap-2">
                        <span className="mt-1 w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-300 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, icon, name, type, required, placeholder, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
        {icon && <span className="[&>svg]:w-4.5 [&>svg]:h-4.5">{icon}</span>}
      </div>
      <input type={type} name={name} required={required} placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-tertiary)]"
        value={value} onChange={onChange}
      />
    </div>
  </div>
);

export default CreateEventPage;
