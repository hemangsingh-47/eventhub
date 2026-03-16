import { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, RefreshCw } from 'lucide-react';
import { 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications, 
  checkSubscriptionStatus 
} from '../../utils/pushSubscription';

const NotificationBell = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setLoading(true);
      if (!('Notification' in window)) {
        setError('Not supported');
        setLoading(false);
        return;
      }
      
      if (Notification.permission === 'denied') {
        setError('Permission denied');
        setIsSubscribed(false);
        setLoading(false);
        return;
      }

      const status = await checkSubscriptionStatus();
      setIsSubscribed(status);
      setError(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isSubscribed) {
        await unsubscribeFromPushNotifications();
        setIsSubscribed(false);
      } else {
        await subscribeToPushNotifications();
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('denied')) {
        setError('Permission denied');
      } else {
        setError('Error toggling');
      }
    } finally {
      setLoading(false);
    }
  };

  // If notifications aren't supported by browser, don't show the bell
  if (error === 'Not supported') return null;

  return (
    <div className="relative group">
      <button
        onClick={toggleSubscription}
        disabled={loading || error === 'Permission denied'}
        className={`p-2 rounded-xl transition-all duration-300 relative ${
          isSubscribed
            ? 'text-[var(--color-primary)] bg-[var(--color-primary-muted)] hover:bg-indigo-100'
            : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)]'
        } ${error === 'Permission denied' ? 'opacity-50 cursor-not-allowed text-red-500 bg-red-50' : ''}`}
        aria-label="Toggle Push Notifications"
      >
        {loading ? (
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--color-text-tertiary)]" />
        ) : error === 'Permission denied' ? (
          <BellOff className="w-5 h-5" />
        ) : isSubscribed ? (
          <BellRing className="w-5 h-5 animate-pulse-slow" strokeWidth={2.5} />
        ) : (
          <Bell className="w-5 h-5" />
        )}

        {/* Unread indicator dot wrapper (could be tied to actual unread count later) */}
        {isSubscribed && !loading && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
          </span>
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute right-0 top-full mt-2 w-max px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
        {error === 'Permission denied' 
          ? 'Notifications blocked in browser' 
          : isSubscribed 
            ? 'Disable reminders' 
            : 'Enable event reminders'}
      </div>
    </div>
  );
};

export default NotificationBell;
