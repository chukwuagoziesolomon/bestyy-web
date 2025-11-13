import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../context/AuthContext';

interface NotificationBellProps {
  userId: number;
  userType: string;
  className?: string;
}

interface NotificationMessage {
  type: string;
  data: any;
  timestamp: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  userId,
  userType,
  className = ''
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get WebSocket path based on user type
  const getWebSocketPath = (userType: string) => {
    switch (userType.toLowerCase()) {
      case 'vendor':
        return '/ws/vendor/notifications/';
      case 'courier':
        return '/ws/courier/notifications/';
      default:
        return '/ws/notifications/';
    }
  };

  // Get JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('access_token') || '';
  };

  // Handle incoming WebSocket messages
  const handleMessage = (message: NotificationMessage) => {
    console.log('Notification received:', message);

    // Update unread count
    setUnreadCount(prev => prev + 1);

    // Add to recent notifications (keep only last 5)
    setNotifications(prev => [message, ...prev.slice(0, 4)]);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      const formatted = formatNotification(message);
      new Notification(formatted.title, {
        body: formatted.message,
        icon: '/favicon.ico',
      });
    }
  };

  // Use WebSocket hook
  useWebSocket(getToken(), getWebSocketPath(userType), {
    onMessage: handleMessage,
    onOpen: () => {
      console.log('WebSocket connected for notifications');
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    }
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleBellClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewAllClick = () => {
    setIsDropdownOpen(false);
    navigate('/notifications');
  };

  const formatNotification = (message: NotificationMessage) => {
    switch (message.type) {
      case 'connection.established':
        return {
          title: 'Connected',
          message: message.data.message || 'Successfully connected to notifications',
          icon: '🔗'
        };
      case 'order.new':
        return {
          title: 'New Order',
          message: `Order #${message.data.order_number} received`,
          icon: '📦'
        };
      case 'status.updated':
        return {
          title: 'Status Update',
          message: message.data.message || 'Your status has been updated',
          icon: '📋'
        };
      case 'account.approved':
        return {
          title: 'Account Approved',
          message: message.data.message || 'Your account has been approved!',
          icon: '✅'
        };
      case 'account.rejected':
        return {
          title: 'Account Update',
          message: message.data.message || 'Account status changed',
          icon: '⚠️'
        };
      default:
        return {
          title: 'Notification',
          message: 'You have a new notification',
          icon: '🔔'
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`notification-bell ${className}`} ref={dropdownRef}>
      <div className="bell-icon relative" onClick={handleBellClick}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
        >
          <path
            d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V16L22 18V19H2V18L4 16V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"
            fill="currentColor"
          />
        </svg>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="notification-badge">
            <span className="badge-count">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
      </div>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} unread</span>
            )}
          </div>

          <div className="dropdown-content">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <div className="no-notifications-icon">🔔</div>
                <p>No recent notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const formatted = formatNotification(notification);
                return (
                  <div key={index} className="notification-item">
                    <div className="notification-icon">
                      {formatted.icon}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{formatted.title}</div>
                      <div className="notification-message">{formatted.message}</div>
                      <div className="notification-time">
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="dropdown-footer">
            <button
              className="view-all-button"
              onClick={handleViewAllClick}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}

      <style>{`
        .notification-bell {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .notification-bell:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }

        .bell-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #EF4444, #DC2626);
          border: 2px solid white;
          border-radius: 12px;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: pulse 2s infinite;
        }

        .badge-count {
          color: white;
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          padding: 0 4px;
        }

        .notification-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 380px;
          max-height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          z-index: 1000;
          overflow: hidden;
        }

        .dropdown-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdown-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .unread-count {
          font-size: 12px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .dropdown-content {
          max-height: 350px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          padding: 12px 20px;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s ease;
        }

        .notification-item:hover {
          background-color: #f9fafb;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-icon {
          font-size: 20px;
          margin-right: 12px;
          margin-top: 2px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 2px;
        }

        .notification-message {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .notification-time {
          font-size: 11px;
          color: #9ca3af;
        }

        .no-notifications {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .no-notifications-icon {
          font-size: 32px;
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .dropdown-footer {
          padding: 12px 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .view-all-button {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .view-all-button:hover {
          background: #2563eb;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .notification-bell {
            padding: 6px;
          }

          .notification-dropdown {
            width: 320px;
            right: -20px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .bell-icon svg {
            color: #E5E7EB;
          }

          .notification-bell:hover {
            background-color: rgba(59, 130, 246, 0.2);
          }

          .notification-dropdown {
            background: #1f2937;
            border-color: #374151;
          }

          .dropdown-header {
            border-color: #374151;
          }

          .dropdown-header h3 {
            color: #f9fafb;
          }

          .notification-item {
            border-color: #374151;
          }

          .notification-item:hover {
            background-color: #111827;
          }

          .notification-title {
            color: #f9fafb;
          }

          .notification-message {
            color: #9ca3af;
          }

          .dropdown-footer {
            background: #111827;
            border-color: #374151;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
