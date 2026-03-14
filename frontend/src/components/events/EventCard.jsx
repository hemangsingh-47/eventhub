import { Link } from 'react-router-dom';
import { MapPin, Clock, CalendarDays, ArrowUpRight } from 'lucide-react';

const EventCard = ({ event }) => {
  const isFull = event.availableSeats === 0;

  return (
    <Link 
      to={`/events/${event._id}`}
      className="group block bg-white rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-500 ease-out hover:-translate-y-1 flex flex-col h-full relative"
    >
      {/* Decorative Gradient Background behind card image */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10"></div>

      <div className="h-56 w-full bg-slate-100 relative overflow-hidden">
        {event.imageUrl ? (
          <>
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 group-hover:bg-slate-50 transition-colors duration-500">
            <CalendarDays className="h-14 w-14 mb-3 opacity-30 transform group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500" />
            <span className="font-semibold text-xs tracking-widest uppercase opacity-60">{event.category}</span>
          </div>
        )}
        
        {/* Clean Pill Badges */}
        <div className="absolute top-5 left-5 flex gap-2">
          <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-800 shadow-sm border border-white/20">
            {event.category}
          </div>
        </div>

        <div className="absolute top-5 right-5">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 ${
              isFull 
                ? 'bg-red-500/90 text-white' 
                : 'bg-black/80 text-white'
            }`}>
            {isFull ? 'Sold Out' : `${event.availableSeats} Left`}
          </span>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-black tracking-tight leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors pr-6">
            {event.title}
          </h3>
          <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 absolute right-6 top-7" />
        </div>
        
        <p className="text-slate-500 mb-8 line-clamp-2 flex-grow leading-relaxed font-normal text-[15px]">
          {event.description}
        </p>
        
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="flex items-center text-[13px] font-medium text-slate-600">
            <CalendarDays className="h-4 w-4 mr-3 text-slate-400" strokeWidth={2.5} />
            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center text-[13px] font-medium text-slate-600">
            <Clock className="h-4 w-4 mr-3 text-slate-400" strokeWidth={2.5} />
            {event.time}
          </div>
          <div className="flex items-center text-[13px] font-medium text-slate-600">
            <MapPin className="h-4 w-4 mr-3 text-slate-400" strokeWidth={2.5} />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
