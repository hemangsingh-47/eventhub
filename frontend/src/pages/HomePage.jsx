import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import { Search, Sparkles, ArrowRight, Calendar, Users, Zap, X, Info, Loader2 } from 'lucide-react';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`events?page=${page}&limit=6${debouncedSearch ? `&q=${debouncedSearch}` : ''}`);
        setEvents(data.events);
        setTotalPages(data.pages);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, debouncedSearch]);


  return (
    <div className="w-full relative overflow-hidden">
      
      {/* Premium Background Mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-500/8 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          
          {/* Chip Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary-muted)] border border-indigo-200/50 mb-8 animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-[var(--color-primary)] tracking-wide uppercase">Your Campus. Your Events.</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-[var(--color-text-primary)] mb-6 leading-[1.05] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Discover Events That
            <br/>
            <span className="text-gradient">Shape Your Future</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 font-normal leading-relaxed max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Find hackathons, workshops, and cultural fests happening on campus. RSVP instantly and never miss an opportunity.
          </p>
          
          {/* Search Bar — Vercel/Linear style */}
          <div className="w-full max-w-2xl relative group animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur-sm transition-opacity duration-500"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-5 h-5 w-5 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors duration-300" />
              <input
                type="text"
                className="w-full pl-14 pr-6 py-4.5 rounded-2xl border border-[var(--color-border)] bg-white/80 backdrop-blur-sm shadow-card focus:shadow-card-hover focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-500/10 text-[var(--color-text-primary)] transition-all duration-300 text-base outline-none placeholder:text-[var(--color-text-tertiary)] font-medium"
                placeholder="Search events, workshops, hackathons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setDebouncedSearch(searchTerm)}
              />
              <button 
                onClick={() => setDebouncedSearch(searchTerm)}
                className="absolute right-3 p-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-8 mt-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Stat icon={<Calendar className="w-4 h-4"/>} value="50+" label="Events" />
            <div className="w-px h-8 bg-[var(--color-border)]"></div>
            <Stat icon={<Users className="w-4 h-4"/>} value="2K+" label="Students" />
            <div className="w-px h-8 bg-[var(--color-border)]"></div>
            <Stat icon={<Zap className="w-4 h-4"/>} value="98%" label="Satisfaction" />
          </div>
        </div>


        {/* Events Feed */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {debouncedSearch ? `Results for "${debouncedSearch}"` : 'Upcoming Events'}
              </h2>
              <p className="text-sm text-[var(--color-text-tertiary)] mt-1 font-medium">Browse and RSVP to events happening near you</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-32">
              <div className="relative">
                <div className="h-10 w-10 border-3 border-[var(--color-surface-tertiary)] rounded-full"></div>
                <div className="absolute top-0 h-10 w-10 border-3 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin"></div>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-28 bg-white/60 backdrop-blur-sm rounded-3xl border border-[var(--color-border)] border-dashed shadow-card">
              <div className="bg-[var(--color-surface-tertiary)] h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="h-7 w-7 text-[var(--color-text-tertiary)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No events found</h3>
              <p className="text-[var(--color-text-secondary)] max-w-md mx-auto text-sm">We couldn't find any events matching your search. Try adjusting your keywords.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <div key={event._id} className="animate-fade-in-up" style={{animationDelay: `${i * 0.08}s`}}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-14 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:bg-white disabled:opacity-30 transition-all"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === i + 1 ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-indigo-500/25' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:bg-white disabled:opacity-30 transition-all flex items-center gap-1"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, value, label }) => (
  <div className="flex items-center gap-2.5 text-[var(--color-text-secondary)]">
    <div className="p-1.5 rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]">{icon}</div>
    <div>
      <p className="text-lg font-bold text-[var(--color-text-primary)] leading-none">{value}</p>
      <p className="text-xs font-medium text-[var(--color-text-tertiary)]">{label}</p>
    </div>
  </div>
);

export default HomePage;
