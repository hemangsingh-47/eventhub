const badgesMap = {
  'first_rsvp': { label: 'First Mover', icon: '🚀', color: 'from-amber-400 to-amber-500' },
  'social_butterfly': { label: 'Social Butterfly', icon: '🦋', color: 'from-pink-400 to-rose-500' },
  'commenter': { label: 'Opinionated', icon: '💬', color: 'from-blue-400 to-indigo-500' },
  'top_reviewer': { label: 'Top Critic', icon: '⭐', color: 'from-yellow-400 to-amber-500' },
  'event_creator': { label: 'Organizer', icon: '👑', color: 'from-violet-500 to-purple-600' }
};

const BadgeDisplay = ({ badges = [], size = 'md' }) => {
  if (!badges || badges.length === 0) return null;

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badgeKey, index) => {
        const badge = badgesMap[badgeKey];
        if (!badge) return null;

        return (
          <div 
            key={index}
            className={`flex items-center justify-center rounded-full bg-gradient-to-br ${badge.color} text-white shadow-sm ring-2 ring-white cursor-help transition-transform hover:scale-110 ${sizeClasses[size]}`}
            title={badge.label}
          >
            {badge.icon}
          </div>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;
