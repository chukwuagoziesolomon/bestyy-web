import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';
import { notificationService, NotificationData } from '../services/notificationService';

interface NotificationsPageProps {
  userId: number;
  userType: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userId, userType }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'verification' | 'order' | 'payment' | 'delivery'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await notificationService.getNotifications(userId, userType);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && userType) {
      fetchNotifications();
    }
  }, [userId, userType]);

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    if (userId && userType) {
      const handleNewNotification = (notification: NotificationData) => {
        setNotifications(prev => [notification, ...prev]);
      };

      notificationService.connectWebSocket(userId, userType, handleNewNotification);

      return () => {
        notificationService.disconnectWebSocket();
      };
    }
  }, [userId, userType]);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'verification':
        return notification.type === 'verification';
      case 'order':
        return notification.type === 'order';
      case 'payment':
        return notification.type === 'payment';
      case 'delivery':
        return notification.type === 'delivery';
      default:
        return true;
    }
  });

  // Handle marking notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    const success = await notificationService.markAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    const success = await notificationService.markAllAsRead(userId, userType);
    if (success) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  };

  // Handle deleting notification
  const handleDeleteNotification = async (notificationId: string) => {
    const success = await notificationService.deleteNotification(notificationId);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setSelectedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  // Handle selecting/deselecting notifications
  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // Handle selecting all notifications
  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  // Handle deleting selected notifications
  const handleDeleteSelected = async () => {
    const deletePromises = Array.from(selectedNotifications).map(id => 
      notificationService.deleteNotification(id)
    );
    
    const results = await Promise.all(deletePromises);
    const successCount = results.filter(Boolean).length;
    
    if (successCount > 0) {
      setNotifications(prev => 
        prev.filter(n => !selectedNotifications.has(n.id))
      );
      setSelectedNotifications(new Set());
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const diffInHoursRounded = Math.floor(diffInHours);
      return `${diffInHoursRounded} hour${diffInHoursRounded !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>
        <PremiumLoadingAnimation message="Loading notifications..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>
        <div className="notifications-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Notifications</h3>
          <p>There was a problem loading your notifications. Please try again.</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1>Notifications</h1>
          <div className="header-actions">
            {filteredNotifications.length > 0 && (
              <button 
                className="mark-all-read-button"
                onClick={handleMarkAllAsRead}
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="notifications-filters">
        <div className="filter-buttons">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
            { key: 'verification', label: 'Verification', count: notifications.filter(n => n.type === 'verification').length },
            { key: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
            { key: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
            { key: 'delivery', label: 'Delivery', count: notifications.filter(n => n.type === 'delivery').length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              className={`filter-button ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key as any)}
            >
              {label}
              {count > 0 && <span className="filter-count">{count}</span>}
            </button>
          ))}
        </div>
      </div>

      {selectedNotifications.size > 0 && (
        <div className="bulk-actions">
          <div className="bulk-actions-content">
            <span>{selectedNotifications.size} selected</span>
            <button 
              className="delete-selected-button"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">🔔</div>
            <h3>No notifications</h3>
            <p>
              {filter === 'all' 
                ? "You don't have any notifications yet."
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            <div className="notifications-list-header">
              <label className="select-all-checkbox">
                <input
                  type="checkbox"
                  checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                />
                Select All
              </label>
            </div>
            
            {filteredNotifications.map((notification) => {
              const formatted = notificationService.formatNotification(notification);
              const isSelected = selectedNotifications.has(notification.id);
              
              return (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectNotification(notification.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="notification-icon" style={{ color: formatted.color }}>
                    {formatted.icon}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4 className="notification-title">{formatted.title}</h4>
                      <span className="notification-time">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="notification-message">{formatted.message}</p>
                    <div className="notification-meta">
                      <span className={`notification-type ${notification.type}`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                      <span className={`notification-priority ${notification.priority}`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .notifications-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .notifications-header {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-button {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #111827;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .mark-all-read-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .mark-all-read-button:hover {
          background: #2563eb;
        }

        .notifications-filters {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-button {
          background: #f3f4f6;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-button:hover {
          background: #e5e7eb;
        }

        .filter-button.active {
          background: #3b82f6;
          color: white;
        }

        .filter-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
        }

        .bulk-actions {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
        }

        .bulk-actions-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .delete-selected-button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .delete-selected-button:hover {
          background: #dc2626;
        }

        .notifications-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .notifications-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .notifications-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .retry-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          margin-top: 16px;
        }

        .retry-button:hover {
          background: #2563eb;
        }

        .no-notifications {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
        }

        .no-notifications-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .notifications-list-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .select-all-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .notification-item:hover {
          background: #f9fafb;
        }

        .notification-item.unread {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
        }

        .notification-item.selected {
          background: #fef3c7;
        }

        .notification-checkbox {
          margin-right: 12px;
          margin-top: 2px;
        }

        .notification-icon {
          font-size: 24px;
          margin-right: 16px;
          margin-top: 2px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .notification-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .notification-time {
          font-size: 12px;
          color: #6b7280;
        }

        .notification-message {
          margin: 0 0 8px 0;
          color: #4b5563;
          line-height: 1.5;
        }

        .notification-meta {
          display: flex;
          gap: 8px;
        }

        .notification-type {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .notification-type.verification {
          background: #dbeafe;
          color: #1e40af;
        }

        .notification-type.order {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .notification-type.payment {
          background: #dcfce7;
          color: #166534;
        }

        .notification-type.delivery {
          background: #fef3c7;
          color: #92400e;
        }

        .notification-priority {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .notification-priority.high {
          background: #fee2e2;
          color: #dc2626;
        }

        .notification-priority.medium {
          background: #fef3c7;
          color: #d97706;
        }

        .notification-priority.low {
          background: #f3f4f6;
          color: #6b7280;
        }

        .notification-actions {
          margin-left: 12px;
        }

        .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .delete-button:hover {
          background: #fee2e2;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .notifications-page {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .filter-buttons {
            justify-content: center;
          }

          .notification-item {
            padding: 12px 16px;
          }

          .notification-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
