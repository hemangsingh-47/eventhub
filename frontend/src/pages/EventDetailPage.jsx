import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Users, ArrowLeft, Ticket, CheckCircle, Share2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        // Check if the current user already RSVPd
        if (user && data.attendees && data.attendees.includes(user._id)) {
          setRsvpDone(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  const handleRSVP = async () => {
    if (!user) return alert('Please log in to RSVP.');
    setRsvpLoading(true);
    try {
      await api.post(`/events/${id}/rsvp`);
      setRsvpDone(true);
      setEvent(prev => ({ ...prev, availableSeats: prev.availableSeats - 1 }));
    } catch (err) {
      alert(err.response?.data?.message || 'RSVP failed.');
    } finally {
      setRsvpLoading(false);
    }
  };

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
  const seatPercent = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;

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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-200/50">
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isFull ? 'bg-red-50 text-red-600 border border-red-200/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'}`}>
                {isFull ? 'Sold Out' : `${event.availableSeats} seats left`}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4 leading-tight">{event.title}</h1>
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Register for this event</h3>

              {/* Seat Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-[var(--color-text-secondary)]">{event.totalSeats - event.availableSeats} registered</span>
                  <span className="text-[var(--color-text-tertiary)]">{event.totalSeats} total</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-400' : seatPercent > 70 ? 'bg-amber-400' : 'bg-[var(--color-primary)]'}`} style={{width: `${seatPercent}%`}}></div>
                </div>
              </div>

              {rsvpDone ? (
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200">
                  <CheckCircle className="w-4 h-4" /> You're registered!
                </div>
              ) : (
                <button onClick={handleRSVP} disabled={isFull || rsvpLoading || !user}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ticket className="w-4 h-4" />
                  {isFull ? 'Sold Out' : !user ? 'Log in to RSVP' : rsvpLoading ? 'Registering...' : 'RSVP — Free'}
                </button>
              )}

              <button className="w-full flex items-center justify-center gap-2 py-3 mt-3 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-surface-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all">
                <Share2 className="w-4 h-4" /> Share Event
              </button>
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
