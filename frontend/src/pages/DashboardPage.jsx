import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plus, ArrowUpRight, Pencil, Trash2, Loader2, RefreshCw } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import StatsCards from '../components/dashboard/StatsCards';
import RSVPChart from '../components/dashboard/RSVPChart';
import SeatUtilization from '../components/dashboard/SeatUtilization';

import { useAI } from '../hooks/useAI';
import { FileDown, Sparkles, Brain, X as CloseX, Send, Download, Mail } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [rsvpTrend, setRsvpTrend] = useState([]);
  const [seatUtil, setSeatUtil] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Summary State
  const { call: generateSummary, loading: isGeneratingSummary } = useAI('event-summary');
  const [selectedEventSummary, setSelectedEventSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const handleGenerateSummary = async (eventId) => {
    const result = await generateSummary({ eventId });
    if (result) {
      setSelectedEventSummary(result);
      setShowSummaryModal(true);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats and events in parallel
      const [eventsRes, statsRes, trendRes, utilRes] = await Promise.all([
        api.get('/events'),
        api.get('/analytics/overview'),
        api.get('/analytics/rsvp-trend'),
        api.get('/analytics/seat-util')
      ]);

      const myEvents = eventsRes.data.events.filter(e => e.organizerId?._id === user?._id || e.organizerId === user?._id);
      
      setEvents(myEvents);
      setStats(statsRes.data);
      setRsvpTrend(trendRes.data);
      setSeatUtil(utilRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      // Refresh stats after deletion
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-[var(--color-surface-primary)]">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">Analytics Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Here's an overview of your events performance</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link to="/create-event"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#000000] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-px transition-all duration-300"
            >
              <Plus className="w-4 h-4" strokeWidth={3} /> New Event
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
            <p className="text-sm font-semibold text-[var(--color-text-tertiary)] animate-pulse">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Top Level Stats */}
            <StatsCards stats={stats} />

            {/* Charts Row */}
            {events.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[var(--color-text-primary)]">RSVP Trend</h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Total RSVPs across your latest events</p>
                  </div>
                  <RSVPChart data={rsvpTrend} />
                </div>
                
                <div className="lg:col-span-1 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[var(--color-text-primary)]">Overall Seat Utilization</h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Booked vs Available Capacity</p>
                  </div>
                  <SeatUtilization data={seatUtil} />
                </div>
              </div>
            )}

            {/* Events Table List */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-secondary)]/50">
                <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Your Events</h2>
                <span className="text-xs font-bold text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] shadow-sm px-2.5 py-1 rounded-lg">{events.length} total</span>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="bg-[var(--color-surface-tertiary)] h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-border)]">
                    <Calendar className="h-6 w-6 text-[var(--color-text-tertiary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No events yet</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6">Create your first event to start seeing analytics</p>
                  <Link to="/create-event" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-px">
                    <Plus className="w-4 h-4" strokeWidth={3} /> Create Event
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {events.map(event => (
                    <div key={event._id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--color-surface-secondary)] transition-colors group">
                      {/* Thumbnail */}
                      <div className="h-12 w-12 rounded-xl bg-[var(--color-surface-tertiary)] overflow-hidden flex-shrink-0 border border-[var(--color-border)]">
                        {event.imageUrl ? (
                          <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)]"><Calendar className="w-5 h-5"/></div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-sm text-[var(--color-text-primary)] truncate">{event.title}</h3>
                        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)] mt-1 font-medium">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[var(--color-text-tertiary)]"/>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[var(--color-text-tertiary)]"/>{event.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[var(--color-text-tertiary)]"/>{event.location}</span>
                        </div>
                      </div>

                      {/* Seats & Actions */}
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold text-[var(--color-text-primary)] bg-[var(--color-surface-secondary)] px-2.5 py-1 rounded-lg border border-[var(--color-border)]">
                            {event.availableSeats} <span className="text-[var(--color-text-tertiary)]">/ {event.totalSeats}</span>
                          </p>
                          <p className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider mt-1 mr-1">Left</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleGenerateSummary(event._id)}
                            disabled={isGeneratingSummary}
                            className="p-2.5 rounded-xl text-violet-600 hover:bg-violet-50 transition-all"
                            title="Generate AI Summary"
                          >
                            <Sparkles className={`w-4 h-4 ${isGeneratingSummary ? 'animate-pulse' : ''}`} />
                          </button>
                          <Link to={`/edit-event/${event._id}`} className="p-2.5 rounded-xl text-[var(--color-text-tertiary)] hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <Link to={`/events/${event._id}`} className="p-2.5 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] transition-all">
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(event._id)}
                            className="p-2.5 rounded-xl text-[var(--color-text-tertiary)] hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100" title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* AI Summary Modal */}
      {showSummaryModal && selectedEventSummary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-premium-in flex flex-col max-h-[90vh]">
            <div className="p-6 bg-violet-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">AI Post-Event Summary</h3>
                  <p className="text-xs text-violet-200">Generated for {selectedEventSummary.eventTitle}</p>
                </div>
              </div>
              <button onClick={() => setShowSummaryModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <CloseX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
              <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Attendance</p>
                  <p className="text-2xl font-black text-violet-700">{selectedEventSummary.stats.attendeeCount}</p>
                </div>
                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Utilization</p>
                  <p className="text-2xl font-black text-violet-700">{Math.round((selectedEventSummary.stats.attendeeCount / selectedEventSummary.stats.totalSeats) * 100)}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Engagement</p>
                  <p className="text-2xl font-black text-violet-700">High</p>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h4 className="text-xs font-black text-[var(--color-text-primary)] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Executive Summary
                  </h4>
                  <div className="p-5 rounded-2xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] leading-relaxed italic">
                    "{selectedEventSummary.summary}"
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section>
                    <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">Key Highlights</h4>
                    <ul className="space-y-2">
                      {selectedEventSummary.highlights.map((h, i) => (
                        <li key={i} className="text-xs font-medium text-[var(--color-text-secondary)] flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {h}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">Improvement Areas</h4>
                    <ul className="space-y-2">
                      {selectedEventSummary.improvements.map((im, i) => (
                        <li key={i} className="text-xs font-medium text-[var(--color-text-secondary)] flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {im}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-surface-secondary)] border-t border-[var(--color-border)] flex items-center justify-between">
              <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">
                Confidential Report · Internal Use Only
              </p>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-border)] rounded-xl text-xs font-bold text-[var(--color-text-primary)] hover:border-violet-200 hover:text-violet-600 transition-all shadow-sm">
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20">
                  <Mail className="w-3.5 h-3.5" /> Email Organizers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
