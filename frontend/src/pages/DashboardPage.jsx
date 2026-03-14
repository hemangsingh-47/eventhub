import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plus, BarChart3, Users, Trash2, ArrowUpRight, TrendingUp, Pencil } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/events');
        const myEvents = data.events.filter(e => e.organizerId?._id === user?._id || e.organizerId === user?._id);
        setEvents(myEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyEvents();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  const totalSeats = events.reduce((s, e) => s + e.totalSeats, 0);
  const totalRSVPs = events.reduce((s, e) => s + (e.totalSeats - e.availableSeats), 0);

  const stats = [
    { label: 'Active Events', value: events.length, icon: <BarChart3 className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50', change: '+2 this week' },
    { label: 'Total RSVPs', value: totalRSVPs, icon: <Users className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+12% growth' },
    { label: 'Total Capacity', value: totalSeats, icon: <TrendingUp className="w-5 h-5" />, color: 'text-violet-600', bg: 'bg-violet-50', change: 'Across all events' },
  ];

  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Here's an overview of your events</p>
          </div>
          <Link to="/create-event"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px transition-all duration-300"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-card-hover transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                <span className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">{stat.value}</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1 font-medium">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Your Events</h2>
            <span className="text-xs font-semibold text-[var(--color-text-tertiary)] bg-[var(--color-surface-tertiary)] px-2.5 py-1 rounded-lg">{events.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="h-8 w-8 border-2 border-[var(--color-surface-tertiary)] rounded-full"></div>
                <div className="absolute top-0 h-8 w-8 border-2 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin"></div>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="bg-[var(--color-surface-tertiary)] h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-[var(--color-text-tertiary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No events yet</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">Create your first event to get started</p>
              <Link to="/create-event" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-all">
                <Plus className="w-4 h-4" strokeWidth={3} /> Create Event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {events.map(event => (
                <div key={event._id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--color-surface-secondary)] transition-colors group">
                  {/* Thumbnail */}
                  <div className="h-12 w-12 rounded-xl bg-[var(--color-surface-tertiary)] overflow-hidden flex-shrink-0">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)]"><Calendar className="w-5 h-5"/></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] mt-0.5 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{event.location}</span>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{event.availableSeats}<span className="text-[var(--color-text-tertiary)] font-normal">/{event.totalSeats}</span></p>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">seats left</p>
                    </div>
                    <Link to={`/edit-event/${event._id}`} className="p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <Link to={`/events/${event._id}`} className="p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(event._id)}
                      className="p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
