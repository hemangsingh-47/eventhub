import { CalendarPlus } from 'lucide-react';

const CalendarExport = ({ eventId }) => {
  const handleExport = () => {
    // Relative URL works thanks to Vite proxy in dev and express.static in prod
    window.open(`/api/calendar/${eventId}`, '_blank');
  };

  return (
    <button
      onClick={handleExport}
      className="p-3 rounded-xl border flex items-center justify-center transition-all duration-300 bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]"
      aria-label="Add to Calendar"
      title="Download .ics Calendar File"
    >
      <CalendarPlus className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
};

export default CalendarExport;
