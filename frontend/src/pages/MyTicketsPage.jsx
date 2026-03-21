import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket as TicketIcon, Calendar, Clock, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const MyTicketsPage = () => {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const success = searchParams.get('success');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('tickets/my-tickets');
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen bg-[var(--color-surface-primary)]">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">My Tickets</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your event registrations and QR codes</p>
        </div>

        {success && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-800">Payment Successful!</h3>
              <p className="text-xs text-emerald-600 mt-1">Your ticket has been generated and is ready for check-in.</p>
            </div>
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[var(--color-border)] shadow-card">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">No tickets yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Discover amazing campus events and get your first ticket!</p>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm hover:bg-[var(--color-primary-hover)] transition-all shadow-sm">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map(ticket => (
              <div key={ticket._id} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-card overflow-hidden flex flex-col md:flex-row">
                
                {/* QR Code Section */}
                <div className="bg-[#f8f9fa] border-b md:border-b-0 md:border-r border-dashed border-gray-300 p-8 flex flex-col items-center justify-center shrink-0 min-w-[240px]">
                  {ticket.status === 'checked-in' ? (
                     <div className="w-40 h-40 bg-gray-100 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center text-center p-4">
                        <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Checked In</span>
                     </div>
                  ) : ticket.qrCodeData ? (
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                      <QRCodeSVG value={ticket.qrCodeData} size={150} level="H" />
                    </div>
                  ) : (
                     <div className="w-40 h-40 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-amber-400" />
                     </div>
                  )}
                  <p className="text-[10px] font-mono text-gray-400 mt-4 uppercase tracking-widest">{ticket._id.substring(ticket._id.length - 8)}</p>
                </div>

                {/* Ticket Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${ticket.status === 'checked-in' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                         {ticket.status}
                       </span>
                       <span className="text-xl font-bold text-gray-900">${ticket.event.price.toFixed(2)}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{ticket.event.title}</h2>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] font-medium">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        {new Date(ticket.event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] font-medium">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        {ticket.event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] font-medium">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        {ticket.event.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center mt-4">
                     <div className="text-xs text-[var(--color-text-tertiary)]">
                        Purchased on {new Date(ticket.purchaseDate).toLocaleDateString()}
                     </div>
                     <Link to={`/events/${ticket.event._id}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                        View Event Details
                     </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
