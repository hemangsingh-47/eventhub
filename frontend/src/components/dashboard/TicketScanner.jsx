import { useState } from 'react';
import { QrCode, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../common/Toast';

const TicketScanner = () => {
  const toast = useToast();
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!uuid.trim()) return;

    setLoading(true);
    setTicketData(null);
    try {
      const { data } = await api.get(`tickets/validate/${uuid}`);
      setTicketData({ ...data, isValid: true });
    } catch (error) {
       setTicketData({ isValid: false, message: error.response?.data?.message || 'Invalid or unrecognized QR Code' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!ticketData || !ticketData.isValid) return;

    setLoading(true);
    try {
      await api.post(`tickets/checkin/${uuid}`);
      toast('Ticket successfully checked-in!', 'success');
      setTicketData({ ...ticketData, status: 'checked-in' });
      setUuid(''); // Clear input for next scan
    } catch (error) {
      toast(error.response?.data?.message || 'Check-in failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 flex items-center justify-between">
         <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-500" /> Ticket Scanner
            </h3>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Validate student QR codes</p>
         </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
          <form onSubmit={handleValidate} className="mb-6 relative">
             <input
               type="text"
               value={uuid}
               onChange={(e) => setUuid(e.target.value)}
               placeholder="Enter Ticket UUID..."
               className="w-full pl-4 pr-12 py-3 bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
             />
             <button
               type="submit"
               disabled={loading || !uuid.trim()}
               className="absolute right-2 top-2 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
             >
                {loading && !ticketData ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
             </button>
          </form>

          {/* Result Area */}
          <div className="flex-grow flex flex-col justify-center">
             {!ticketData && !loading && (
                 <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl relative group overflow-hidden">
                    <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-3">
                       <QrCode className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Waiting for scan...</p>
                 </div>
             )}

             {ticketData && ticketData.isValid && (
                 <div className={`p-5 rounded-xl border relative overflow-hidden transition-all text-left ${ticketData.status === 'checked-in' ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                                {ticketData.user.profileImage ? (
                                    <img src={ticketData.user.profileImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-gray-400">{ticketData.user.name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                               <p className="font-bold text-sm text-[var(--color-text-primary)]">{ticketData.user.name}</p>
                               <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Valid Ticket</p>
                            </div>
                        </div>
                        {ticketData.status === 'checked-in' ? (
                            <CheckCircle className="w-6 h-6 text-gray-400" />
                        ) : (
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                        )}
                    </div>
                    
                    <div className="bg-white/60 p-3 rounded-lg border border-black/5 mb-4">
                        <p className="text-xs font-semibold text-[var(--color-text-secondary)] truncate">{ticketData.event.title}</p>
                        <p className="text-[10px] font-mono text-[var(--color-text-tertiary)] mt-1">{ticketData._id}</p>
                    </div>

                    <button
                        onClick={handleCheckIn}
                        disabled={loading || ticketData.status === 'checked-in'}
                        className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${ticketData.status === 'checked-in' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'}`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : ticketData.status === 'checked-in' ? 'Already Checked-In' : 'Admit Attendee'}
                    </button>
                 </div>
             )}

             {ticketData && !ticketData.isValid && (
                 <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-center animate-shake">
                     <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                     <h4 className="font-bold text-red-800 text-sm mb-1">Validation Failed</h4>
                     <p className="text-xs text-red-600">{ticketData.message}</p>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default TicketScanner;
