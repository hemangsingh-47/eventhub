import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, CalendarDays, ArrowUpRight, Users, Star } from 'lucide-react';
import api from '../../utils/api';

const categoryColors = {
  hackathon: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200/50' },
  workshop: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/50' },
  seminar: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/50' },
  cultural: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200/50' },
  tech: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/50' },
  design: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/50' },
  coding: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200/50' },
  sports: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200/50' },
  other: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200/50' },
};

const EventCard = ({ event }) => {
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data } = await api.get(`/ratings/${event._id}`);
        setRatingData(data);
      } catch (error) {
        // Silent fail for feed
      }
    };
    fetchRating();
  }, [event._id]);
  const isFull = event.availableSeats === 0;
  const colors = categoryColors[event.category] || categoryColors.other;
  const seatPercent = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;

  return (
    <Link 
      to={`/events/${event._id}`}
      className="group block bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-card-hover hover:border-[var(--color-border-hover)] transition-all duration-500 ease-out hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Image */}
      <div className="h-48 w-full bg-[var(--color-surface-tertiary)] relative overflow-hidden">
        {event.imageUrl ? (
          <>
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors duration-500">
            <CalendarDays className="h-10 w-10 mb-2 opacity-40" />
            <span className="font-semibold text-xs tracking-widest uppercase opacity-50">{event.category}</span>
          </div>
        )}
        
        {/* Floating Arrow */}
        <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
          <ArrowUpRight className="h-4 w-4 text-[var(--color-text-primary)]" strokeWidth={2.5} />
        </div>

      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Tags Row */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
            {event.category}
          </span>
          {ratingData.count > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black text-amber-700">{ratingData.average}</span>
            </div>
          )}
          {isFull && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200/50">
              Sold Out
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight leading-snug line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
          {event.title}
        </h3>
        
        <p className="text-sm text-[var(--color-text-secondary)] mb-auto line-clamp-2 leading-relaxed">
          {event.description}
        </p>
        
        {/* Meta Info */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-2">
          <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)]">
            <CalendarDays className="h-3.5 w-3.5 mr-2 text-[var(--color-text-tertiary)]" strokeWidth={2.5} />
            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            <span className="mx-2 text-[var(--color-border)]">·</span>
            <Clock className="h-3.5 w-3.5 mr-1.5 text-[var(--color-text-tertiary)]" strokeWidth={2.5} />
            {event.time}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)]">
              <MapPin className="h-3.5 w-3.5 mr-2 text-[var(--color-text-tertiary)]" strokeWidth={2.5} />
              <span className="truncate max-w-[160px]">{event.location}</span>
            </div>
            {/* Seat Progress */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isFull ? 'bg-red-400' : seatPercent > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{width: `${seatPercent}%`}}></div>
              </div>
              <span className="text-[11px] font-semibold text-[var(--color-text-tertiary)]">{event.availableSeats} left</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
