import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import socket from '../../utils/socket';

const EventRating = ({ eventId, user }) => {
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data } = await api.get(`/ratings/${eventId}`);
        setAvgRating(data.average);
        setTotalRatings(data.count);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchRating();

    // Listen for real-time rating updates
    socket.on('rating:update', (data) => {
      if (data.eventId === eventId) {
        setAvgRating(data.average);
        setTotalRatings(data.count);
      }
    });

    return () => {
      socket.off('rating:update');
    };
  }, [eventId]);

  const handleRate = async (value) => {
    if (!user) return alert('Please log in to rate this event.');
    setLoading(true);
    try {
      await api.post('ratings', { eventId, value });
      setRating(value);
    } catch (error) {
      alert('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-6 w-24 bg-indigo-50 animate-pulse rounded-lg"></div>;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={loading || !user}
            onMouseEnter={() => user && setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(star)}
            className={`transition-transform duration-200 ${user ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`w-5 h-5 ${
                (hover || rating || avgRating) >= star
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200 fill-gray-200'
              } transition-colors duration-200`}
            />
          </button>
        ))}
        {avgRating > 0 && (
          <span className="text-sm font-black text-[var(--color-text-primary)] ml-2">{avgRating}</span>
        )}
      </div>
      <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest px-0.5">
        {totalRatings} {totalRatings === 1 ? 'Rating' : 'Ratings'}
      </p>
    </div>
  );
};

export default EventRating;
