import { useState, useEffect } from 'react';
import { Ticket, CheckCircle, Loader2 } from 'lucide-react';
import socket from '../../utils/socket';
import api from '../../utils/api';
import { useToast } from '../common/Toast';

const RSVPButton = ({ event, user, onRsvpSuccess }) => {
  const toast = useToast();
  const [rsvpd, setRsvpd] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(event?.availableSeats || 0);
  const [totalSeats] = useState(event?.totalSeats || 0);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Check if user already RSVP'd
  useEffect(() => {
    if (user && event?.attendees) {
      const isRegistered = event.attendees.some(
        a => (typeof a === 'string' ? a : a?._id || a) === user._id
      );
      setRsvpd(isRegistered);
    }
  }, [user, event]);

  // Join Socket.io room and listen for real-time updates
  useEffect(() => {
    if (!event?._id) return;

    socket.emit('join:event', event._id);

    const handleRsvpUpdate = (data) => {
      if (data.eventId === event._id) {
        setAvailableSeats(data.availableSeats);
        // Pulse animation when someone else RSVPs
        if (data.userId !== user?._id) {
          setPulse(true);
          setTimeout(() => setPulse(false), 800);
        }
      }
    };

    socket.on('rsvp:update', handleRsvpUpdate);

    return () => {
      socket.emit('leave:event', event._id);
      socket.off('rsvp:update', handleRsvpUpdate);
    };
  }, [event?._id, user?._id]);

  const handleRSVP = async () => {
    if (!user) {
      toast('Please log in to RSVP.', 'info');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`events/${event._id}/rsvp`);
      setRsvpd(true);
      setAvailableSeats(data.availableSeats);
      toast('You\'re registered! See you there 🎉', 'success');
      if (onRsvpSuccess) onRsvpSuccess(data);
    } catch (err) {
      toast(err.response?.data?.message || 'RSVP failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFull = availableSeats <= 0;
  const seatPercent = totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;
  const attendeeCount = totalSeats - availableSeats;

  return (
    <div>
      {/* Seat Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold mb-2">
          <span className={`text-[var(--color-text-secondary)] transition-all duration-300 ${pulse ? 'text-[var(--color-primary)] scale-105' : ''}`}>
            {attendeeCount} registered
          </span>
          <span className="text-[var(--color-text-tertiary)]">{totalSeats} total</span>
        </div>
        <div className="w-full h-2.5 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${isFull ? 'bg-red-400' : seatPercent > 70 ? 'bg-amber-400' : 'bg-[var(--color-primary)]'}`}
            style={{ width: `${seatPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Live Updates</span>
      </div>

      {/* RSVP Button */}
      {rsvpd ? (
        <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200 transition-all duration-300">
          <CheckCircle className="w-4 h-4" /> You're registered!
        </div>
      ) : (
        <button
          onClick={handleRSVP}
          disabled={isFull || loading || !user}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Ticket className="w-4 h-4" />
          )}
          {isFull ? 'Sold Out' : !user ? 'Log in to RSVP' : loading ? 'Registering...' : 'RSVP — Free'}
        </button>
      )}
    </div>
  );
};

export default RSVPButton;
