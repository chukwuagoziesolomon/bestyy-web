import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService, NotificationData } from '../services/notificationService';

interface NotificationBellProps {
  userId: number;
  userType: string;
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  userId, 
  userType, 
  className = '' 
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch unread count on component mount
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const count = await notificationService.getUnreadCount(userId, userType);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && userType) {
      fetchUnreadCount();
    }
  }, [userId, userType]);

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    if (userId && userType) {
      const handleNewNotification = (notification: NotificationData) => {
        // Update unread count when new notification arrives
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          const formatted = notificationService.formatNotification(notification);
          new Notification(formatted.title, {
            body: formatted.message,
            icon: '/favicon.ico',
            tag: notification.id,
          });
        }
      };

      notificationService.connectWebSocket(userId, userType, handleNewNotification);

      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      return () => {
        notificationService.disconnectWebSocket();
      };
    }
  }, [userId, userType]);

  const handleBellClick = () => {
    // Navigate to notifications page
    navigate('/notifications');
  };

  const handleBellHover = () => {
    // Optional: Prefetch notifications data on hover
    // This can improve perceived performance
  };

  if (isLoading) {
    return (
      <div className={`notification-bell loading ${className}`}>
        <div className="bell-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
          >
            <path 
              d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V16L22 18V19H2V18L4 16V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" 
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`notification-bell error ${className}`}>
        <div className="bell-icon" onClick={handleBellClick}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-red-500"
          >
            <path 
              d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V16L22 18V19H2V18L4 16V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" 
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="error-indicator">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`notification-bell ${className}`}
      onClick={handleBellClick}
      onMouseEnter={handleBellHover}
    >
      <div className="bell-icon relative">
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

      {/* Hover Tooltip */}
      <div className="bell-tooltip">
        {unreadCount > 0 
          ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
          : 'No new notifications'
        }
      </div>

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

        .notification-bell.loading {
          opacity: 0.6;
        }

        .notification-bell.error {
          opacity: 0.8;
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

        .error-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
        }

        .bell-tooltip {
          position: absolute;
          bottom: -35px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1000;
          pointer-events: none;
        }

        .bell-tooltip::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 4px solid rgba(0, 0, 0, 0.8);
        }

        .notification-bell:hover .bell-tooltip {
          opacity: 1;
          visibility: visible;
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
          
          .bell-tooltip {
            display: none; /* Hide tooltip on mobile */
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
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
