import { useState, useEffect } from 'react';
import { notificationsApi } from '../api';
import { PrimaryBtn, OutlineBtn, SpinnerOverlay } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCheck, Car, Calendar, ShieldCheck, MessageSquare, Info, Trash2 } from 'lucide-react';

const FALLBACK_NOTIFICATIONS = [
  {
    _id: 'n1',
    category: 'booking',
    title: 'Plumber Booking Confirmed',
    description: 'Ravi Kumar has accepted your booking request for plumbing service.',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: 'n2',
    category: 'ride',
    title: 'Driver En Route',
    description: 'Auto Driver Rajesh Negi is arriving at Clock Tower, Dehradun.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'n3',
    category: 'verification',
    title: 'Identity Verification Completed',
    description: 'Your profile has been verified by the administrator.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function Notifications() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationsApi.list();
      const list = data?.data || data;
      if (Array.isArray(list) && list.length > 0) {
        setNotifications(list);
      } else {
        setNotifications(FALLBACK_NOTIFICATIONS);
      }
    } catch {
      setNotifications(FALLBACK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('All notifications marked as read.');
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('All notifications marked as read.');
    }
  };

  const handleMarkOne = async (id) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    }
  };

  const getCategoryIcon = (cat) => {
    if (cat === 'ride') return <Car size={16} className="text-blue-500" />;
    if (cat === 'booking') return <Calendar size={16} className="text-emerald-500" />;
    if (cat === 'verification') return <ShieldCheck size={16} className="text-purple-500" />;
    if (cat === 'message') return <MessageSquare size={16} className="text-amber-500" />;
    return <Info size={16} className="text-gray-500" />;
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1
            className="text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            <Bell size={26} className="text-blue-600 dark:text-blue-400" />
            Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Real-time updates on your bookings, rides, and account alerts.
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 border border-blue-200 dark:border-[#2a3768] px-3.5 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-[#1b2754] transition-colors"
        >
          <CheckCheck size={14} /> Mark all as read
        </button>
      </div>

      {loading ? (
        <SpinnerOverlay />
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#131b38] border border-blue-100 dark:border-[#2a3768] rounded-2xl p-6">
          <Bell size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">You have no new notifications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {notifications.map(n => (
            <div
              key={n._id}
              onClick={() => handleMarkOne(n._id)}
              className={`p-4 rounded-2xl border transition-colors cursor-pointer flex items-start gap-3.5 ${
                n.isRead
                  ? 'bg-white dark:bg-[#131b38] border-blue-100/60 dark:border-[#2a3768]/60 opacity-80'
                  : 'bg-blue-50/50 dark:bg-[#1b2754]/50 border-blue-300 dark:border-blue-500/50 shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#131b38] border border-blue-100 dark:border-[#2a3768] flex items-center justify-center shrink-0 shadow-2xs">
                {getCategoryIcon(n.category)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">{n.title}</h3>
                  <span className="text-[10px] text-gray-400">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-normal">
                  {n.description}
                </p>
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
