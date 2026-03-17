import { useState, useEffect, useContext } from 'react';
import { Bookmark, Calendar, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import EventCard from '../components/events/EventCard';

const BookmarksPage = () => {
  const { user } = useContext(AuthContext);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await api.get('bookmarks');
        setBookmarkedEvents(data);
      } catch (error) {
        console.error('Failed to fetch bookmarks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [user]);

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[var(--color-surface-primary)]">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-4">
              <Bookmark className="w-4 h-4 text-rose-500 fill-current" />
              <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">Saved Events</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-4">
              Your Bookmarks
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Events you've saved for later. Keep track of what's happening around campus.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-[var(--color-surface-secondary)] animate-pulse border border-[var(--color-border)]"></div>
            ))}
          </div>
        ) : bookmarkedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl border border-[var(--color-border)] shadow-sm text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-rose-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">No bookmarks yet</h3>
            <p className="text-[var(--color-text-secondary)] max-w-md mb-8">
              When you see an event you like, click the bookmark icon to save it here for quick access.
            </p>
            <Link 
              to="/"
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-px transition-all"
            >
              Discover Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarkedEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
