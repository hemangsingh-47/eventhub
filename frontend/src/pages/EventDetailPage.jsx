import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Users, ArrowLeft, Share2, Star } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import RSVPButton from '../components/events/RSVPButton';
import EventComments from '../components/events/EventComments';
import EventRating from '../components/events/EventRating';
import BookmarkButton from '../components/events/BookmarkButton';
import CalendarExport from '../components/events/CalendarExport';
import ShareButton from '../components/events/ShareButton';

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="relative">
          <div className="h-10 w-10 border-3 border-[var(--color-surface-tertiary)] rounded-full"></div>
          <div className="absolute top-0 h-10 w-10 border-3 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-[var(--color-text-secondary)] font-medium">Event not found.</p>
      </div>
    );
  }

  const isFull = event.availableSeats === 0;

  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> All Events
        </Link>

        {/* Hero Image */}
        {event.imageUrl && (
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-card border border-[var(--color-border)]">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-200/50">
                {event.category}
              </span>
              {event.tags && event.tags.length > 0 && event.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-violet-50 text-violet-600 rounded-lg text-[11px] font-semibold border border-violet-200/50">
                  {tag}
                </span>
              ))}
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isFull ? 'bg-red-50 text-red-600 border border-red-200/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'}`}>
                {isFull ? 'Sold Out' : `${event.availableSeats} seats left`}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4 leading-tight">{event.title}</h1>
            
            {/* Real-Time Rating */}
            <div className="mb-6">
              <EventRating eventId={id} user={user} />
            </div>

            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8">{event.description}</p>

            {/* Detail Cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <DetailCard icon={<CalendarDays className="w-5 h-5"/>} label="Date" value={new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} color="text-indigo-600" bg="bg-indigo-50" />
              <DetailCard icon={<Clock className="w-5 h-5"/>} label="Time" value={event.time} color="text-violet-600" bg="bg-violet-50" />
              <DetailCard icon={<MapPin className="w-5 h-5"/>} label="Location" value={event.location} color="text-emerald-600" bg="bg-emerald-50" />
              <DetailCard icon={<Users className="w-5 h-5"/>} label="Capacity" value={`${event.availableSeats} / ${event.totalSeats} available`} color="text-amber-600" bg="bg-amber-50" />
            </div>

            {/* Organizer */}
            {event.organizerId && (
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">Organized by</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white font-bold text-sm">
                    {(event.organizerId.name || 'O').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{event.organizerId.name || 'Campus Organizer'}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{event.organizerId.email || ''}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Discussion Section */}
            <EventComments eventId={id} user={user} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Register for this event</h3>

              {/* Real-Time RSVP Button with Socket.io */}
              <RSVPButton event={event} user={user} />

              <div className="grid grid-cols-3 gap-2 mt-4">
                <BookmarkButton eventId={id} />
                <CalendarExport eventId={id} />
                <ShareButton eventId={id} title={event.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, color, bg }) => (
  <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 hover:shadow-sm transition-shadow">
    <div className={`p-1.5 rounded-lg ${bg} ${color} w-fit mb-2`}>{icon}</div>
    <p className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{label}</p>
    <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">{value}</p>
  </div>
);

export default EventDetailPage;
