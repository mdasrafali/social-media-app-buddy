import { useState, useEffect, useCallback } from 'react';
import NotificationItem from './NotificationItem';
import {
  getNotificationsApi,
  markAllReadApi,
  markOneReadApi,
} from '../../api/notificationApi';

export default function Notifications({ isOpen, onMarkAllRead, onMarkOneRead }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async (activeFilter) => {
    setLoading(true);
    try {
      const { data } = await getNotificationsApi({ filter: activeFilter, limit: 20 });
      setNotifications(data.data.notifications);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when dropdown opens or filter changes
  useEffect(() => {
    if (isOpen) fetchNotifications(filter);
  }, [isOpen, filter, fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      if (onMarkAllRead) onMarkAllRead();
    } catch {
      // silently ignore
    }
  };

  const handleItemClick = async (notification) => {
    if (notification.read) return;
    try {
      await markOneReadApi(notification._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      );
      onMarkOneRead?.();
    } catch {
      // silently ignore
    }
  };

  return (
    <>
      <div
        id="_notify_drop"
        className={`_notification_dropdown ${isOpen ? 'show' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="_notifications_content">
          <h4 className="_notifications_content_title">Notifications</h4>
          <div className="_notification_box_right">
            <button type="button" className="_notification_box_right_link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="4"
                height="17"
                fill="none"
                viewBox="0 0 4 17"
              >
                <circle cx="2" cy="2" r="2" fill="#C4C4C4"></circle>
                <circle cx="2" cy="8" r="2" fill="#C4C4C4"></circle>
                <circle cx="2" cy="15" r="2" fill="#C4C4C4"></circle>
              </svg>
            </button>
            <div className="_notifications_drop_right">
              <ul className="_notification_list">
                <li className="_notification_item">
                  <span
                    className="_notification_link"
                    onClick={handleMarkAllRead}
                    style={{ cursor: 'pointer' }}
                  >
                    Mark as all read
                  </span>
                </li>
                <li className="_notification_item">
                  <span className="_notification_link">Notification settings</span>
                </li>
                <li className="_notification_item">
                  <span className="_notification_link">Open Notifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="_notifications_drop_box">
          <div className="_notifications_drop_btn_grp">
            <button
              className={filter === 'all' ? '_notifications_btn_link' : '_notifications_btn_link1'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'unread' ? '_notifications_btn_link' : '_notifications_btn_link1'}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
          <div className="_notifications_all">
            {loading && (
              <div className="_notification_box">
                <div className="_notification_txt">
                  <p className="_notification_para">Loading...</p>
                </div>
              </div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="_notification_box">
                <div className="_notification_txt">
                  <p className="_notification_para">No notifications yet.</p>
                </div>
              </div>
            )}
            {!loading &&
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="_notification_box"
                  onClick={() => handleItemClick(notification)}
                  style={{ cursor: 'pointer', opacity: notification.read ? 0.6 : 1 }}
                >
                  <NotificationItem notification={notification} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
