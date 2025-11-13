import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface VerificationNotificationData {
  type: 'verification.status_changed';
  user_type: 'vendor' | 'courier';
  status: 'approved' | 'rejected' | 'pending';
  business_name?: string;
  admin_notes?: string;
  timestamp: string;
}

interface VerificationNotificationPopupProps {
  notification: VerificationNotificationData;
  onClose: () => void;
  onViewStatus?: () => void;
  onResubmit?: () => void;
}

const VerificationNotificationPopup: React.FC<VerificationNotificationPopupProps> = ({
  notification,
  onClose,
  onViewStatus,
  onResubmit
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-close after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={24} color="#10b981" />;
      case 'rejected':
        return <XCircle size={24} color="#ef4444" />;
      case 'pending':
        return <Clock size={24} color="#f59e0b" />;
      default:
        return <Clock size={24} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusTitle = (status: string, userType: string) => {
    switch (status) {
      case 'approved':
        return `🎉 Account Approved!`;
      case 'rejected':
        return `❌ Application Update`;
      case 'pending':
        return `📋 Status Update`;
      default:
        return `📋 ${userType} Update`;
    }
  };

  const getStatusMessage = (status: string, userType: string) => {
    switch (status) {
      case 'approved':
        return `Congratulations! Your ${userType} account has been approved.`;
      case 'rejected':
        return `Your ${userType} application was not approved. Check the details below.`;
      case 'pending':
        return `Your ${userType} account status has been updated.`;
      default:
        return `Your ${userType} account status has been updated.`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Just now';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '400px',
        width: '100%',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: `2px solid ${getStatusColor(notification.status)}`,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
        fontFamily: 'Nunito Sans, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 12px 20px',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getStatusIcon(notification.status)}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: 0,
              color: '#1f2937'
            }}>
              {getStatusTitle(notification.status, notification.user_type)}
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: 0
            }}>
              {formatTimestamp(notification.timestamp)}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px' }}>
        <p style={{
          fontSize: '14px',
          color: '#374151',
          margin: '0 0 12px 0',
          lineHeight: '1.4'
        }}>
          {getStatusMessage(notification.status, notification.user_type)}
        </p>

        {notification.business_name && (
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Business: {notification.business_name}
          </div>
        )}

        {notification.admin_notes && (
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '4px'
            }}>
              Admin Notes:
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.4'
            }}>
              {notification.admin_notes}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {onViewStatus && (
            <button
              onClick={onViewStatus}
              style={{
                background: getStatusColor(notification.status),
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flex: 1,
                minWidth: '120px'
              }}
            >
              <ExternalLink size={16} />
              View Status
            </button>
          )}

          {notification.status === 'rejected' && onResubmit && (
            <button
              onClick={onResubmit}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flex: 1,
                minWidth: '120px'
              }}
            >
              <RefreshCw size={16} />
              Resubmit
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '3px',
        background: '#f3f4f6',
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            background: getStatusColor(notification.status),
            width: '100%',
            animation: 'shrink 15s linear forwards'
          }}
        />
      </div>

      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default VerificationNotificationPopup;
