import { BarChart3, Users, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    { 
      label: 'Active Events', 
      value: stats.totalEvents || 0, 
      icon: <BarChart3 className="w-5 h-5" />, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      change: 'Currently active' 
    },
    { 
      label: 'Total RSVPs', 
      value: stats.totalRSVPs || 0, 
      icon: <Users className="w-5 h-5" />, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      change: 'All time' 
    },
    { 
      label: 'Total Capacity', 
      value: stats.totalCapacity || 0, 
      icon: <TrendingUp className="w-5 h-5" />, 
      color: 'text-violet-600', 
      bg: 'bg-violet-50', 
      change: 'Across all events' 
    },
    { 
      label: 'Ticket Revenue', 
      value: `$${(stats.totalRevenue || 0).toFixed(2)}`, 
      icon: <div className="w-5 h-5 flex items-center justify-center font-bold font-mono">$</div>, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      change: 'Lifetime sales' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((stat, i) => (
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
  );
};

export default StatsCards;
