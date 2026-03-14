import { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/events/EventCard';
import { Search, Sparkles } from 'lucide-react';

const HomePage = () => {
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
        const { data } = await api.get(`/events?page=${page}&limit=6${debouncedSearch ? `&q=${debouncedSearch}` : ''}`);
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
      
      {/* Premium Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* FAANG Style Hero */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6 text-xs font-semibold text-slate-800 tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Discover What's Next</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-black mb-6 leading-[1.1]">
            Experience Campus <br/>
            <span className="text-gradient">Events Reimagined.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 font-light leading-relaxed max-w-2xl">
            Seamlessly discover hackathons, technical workshops, and incredible cultural fests happening right now.
          </p>
          
          {/* Apple Spotlight Style Search */}
          <div className="w-full relative group max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-black transition-colors duration-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-6 py-5 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:border-slate-300 focus:bg-white focus:ring-0 text-black transition-all duration-300 text-lg outline-none placeholder:text-slate-400 font-medium"
              placeholder="Search by title, club, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Keyboard shortcut hint (visual only) */}
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none opacity-0 md:opacity-100">
              <kbd className="hidden sm:inline-block border border-slate-200 rounded px-2 text-xs font-sans text-slate-400 bg-slate-50 font-medium">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Feed Section */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-10 border-b border-slate-200/60 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-black">
              {debouncedSearch ? `Results for "${debouncedSearch}"` : 'Upcoming Events'}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed">
              <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No events found</h3>
              <p className="text-slate-500 max-w-md mx-auto">We couldn't find any events matching your search criteria. Try adjusting your keywords.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>

              {/* Minimalist Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-6">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-black hover:border-black disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-sm font-semibold text-slate-800 tracking-widest uppercase">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-black hover:border-black disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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

export default HomePage;
