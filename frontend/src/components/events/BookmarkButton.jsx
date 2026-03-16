import { useState, useEffect, useContext } from 'react';
import { Bookmark } from 'lucide-react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookmarkButton = ({ eventId }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      try {
        const { data } = await api.get(`/api/bookmarks/check/${eventId}`);
        setIsBookmarked(data.bookmarked);
      } catch (error) {
        console.error('Failed to check bookmark status', error);
      }
    };
    checkStatus();
  }, [eventId, user]);

  const toggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      // Optimistic UI update
      setIsBookmarked(!isBookmarked);
      
      const { data } = await api.post(`/api/bookmarks/${eventId}`);
      // Ensure sync with server state
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark', error);
      // Revert if error
      setIsBookmarked(!isBookmarked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-3 rounded-xl border flex items-center justify-center transition-all duration-300 ${
        isBookmarked 
          ? 'bg-rose-50 text-rose-500 border-rose-200 shadow-sm' 
          : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]'
      }`}
      aria-label="Bookmark Event"
      title={isBookmarked ? "Remove Bookmark" : "Bookmark Event"}
    >
      <Bookmark 
        className={`w-5 h-5 transition-all duration-300 ${isBookmarked ? 'fill-current' : ''} ${loading ? 'animate-pulse' : ''}`} 
        strokeWidth={isBookmarked ? 2 : 2.5}
      />
    </button>
  );
};

export default BookmarkButton;
