import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SeatUtilization = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-[var(--color-surface-secondary)] rounded-xl border border-dashed border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-tertiary)] font-medium">No event data available yet.</p>
      </div>
    );
  }

  // Calculate totals for a combined donut chart
  const totalSeats = data.reduce((sum, e) => sum + e.totalSeats, 0);
  const totalRSVPs = data.reduce((sum, e) => sum + e.rsvps, 0);
  const available = totalSeats - totalRSVPs;

  const chartData = [
    { name: 'Booked', value: totalRSVPs },
    { name: 'Available', value: available > 0 ? available : 0 }
  ];

  const COLORS = ['#10B981', '#E5E7EB']; // Emerald for booked, Gray for available

  return (
    <div className="h-72 w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Booked ({totalRSVPs})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Available ({available > 0 ? available : 0})</span>
        </div>
      </div>
    </div>
  );
};

export default SeatUtilization;
