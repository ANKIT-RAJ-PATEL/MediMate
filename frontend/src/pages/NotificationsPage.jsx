import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBell, HiCheck, HiCheckCircle } from 'react-icons/hi';
import API from '../config/api';
import { formatDateTime } from '../utils/helpers';
import { LoadingSkeleton, EmptyState, PageHeader } from '../components/common/UIComponents';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch { console.error(); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch { console.error(); }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { console.error(); }
  };

  const getIcon = (type) => {
    const icons = {
      medicine_reminder: '💊', appointment: '📅', report_ready: '📄',
      ai_analysis: '🤖', message: '💬', system: '⚙️', emergency: '🚨'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread notifications`}
        action={unreadCount > 0 && <button onClick={markAllAsRead} className="btn-outline text-sm flex items-center gap-2"><HiCheck className="w-4 h-4" /> Mark all read</button>} />

      {loading ? <LoadingSkeleton type="card" count={5} /> : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div key={notif._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`glass-card p-4 flex items-start gap-4 cursor-pointer transition-all ${!notif.isRead ? 'border-l-4 border-primary-500' : 'opacity-70'}`}>
              <span className="text-2xl">{getIcon(notif.type)}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{notif.title}</h4>
                <p className="text-sm text-muted mt-1">{notif.message}</p>
                <p className="text-xs text-muted mt-2">{formatDateTime(notif.createdAt)}</p>
              </div>
              {!notif.isRead && <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 mt-1"></div>}
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiBell} title="No notifications" description="You're all caught up! Notifications will appear here." />
      )}
    </div>
  );
}
