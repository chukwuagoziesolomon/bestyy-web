import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: 'verified' | 'pending' | 'rejected' | 'under_review';
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  showIcon = true,
  size = 'medium',
  className = '',
  style = {}
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />,
          text: 'Verified',
          bgColor: '#d1fae5',
          textColor: '#065f46',
          borderColor: '#10b981'
        };
      case 'pending':
        return {
          icon: <Clock size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />,
          text: 'Pending Verification',
          bgColor: '#fef3c7',
          textColor: '#92400e',
          borderColor: '#f59e0b'
        };
      case 'rejected':
        return {
          icon: <XCircle size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />,
          text: 'Rejected',
          bgColor: '#fee2e2',
          textColor: '#dc2626',
          borderColor: '#ef4444'
        };
      case 'under_review':
        return {
          icon: <AlertCircle size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />,
          text: 'Under Review',
          bgColor: '#dbeafe',
          textColor: '#1e40af',
          borderColor: '#3b82f6'
        };
      default:
        return {
          icon: <Clock size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />,
          text: 'Unknown Status',
          bgColor: '#f3f4f6',
          textColor: '#6b7280',
          borderColor: '#9ca3af'
        };
    }
  };

  const config = getStatusConfig();
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '4px 8px',
          fontSize: '11px',
          gap: '4px'
        };
      case 'large':
        return {
          padding: '8px 16px',
          fontSize: '16px',
          gap: '8px'
        };
      default: // medium
        return {
          padding: '6px 12px',
          fontSize: '14px',
          gap: '6px'
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        borderRadius: '20px',
        background: config.bgColor,
        color: config.textColor,
        fontSize: sizeStyles.fontSize,
        fontWeight: '600',
        border: `1px solid ${config.borderColor}`,
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {showIcon && config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default VerificationBadge;

