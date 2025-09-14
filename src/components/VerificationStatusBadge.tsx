import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import { verificationApi, VendorVerificationStatus, CourierVerificationStatus } from '../services/verificationApi';

interface VerificationStatusBadgeProps {
  userType: 'vendor' | 'courier';
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ 
  userType, 
  className = '', 
  size = 'medium',
  onClick
}) => {
  const [vendorStatus, setVendorStatus] = useState<VendorVerificationStatus | null>(null);
  const [courierStatus, setCourierStatus] = useState<CourierVerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerificationStatus();
  }, [userType]);

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      if (userType === 'vendor') {
        const status = await verificationApi.getVendorVerificationStatus();
        setVendorStatus(status);
      } else {
        const status = await verificationApi.getCourierVerificationStatus();
        setCourierStatus(status);
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (userType === 'vendor' && vendorStatus) {
      return {
        status: vendorStatus.status,
        verified: vendorStatus.verified
      };
    } else if (userType === 'courier' && courierStatus?.success) {
      return {
        status: courierStatus.data.verification_status,
        verified: courierStatus.data.verified
      };
    }
    return { status: 'pending', verified: false };
  };

  const getStatusIcon = (status: string) => {
    const iconSize = size === 'small' ? 12 : size === 'large' ? 20 : 16;
    
    switch (status) {
      case 'approved':
        return <CheckCircle size={iconSize} color="#10b981" />;
      case 'rejected':
        return <XCircle size={iconSize} color="#ef4444" />;
      case 'pending':
        return <Clock size={iconSize} color="#f59e0b" />;
      case 'suspended':
        return <AlertCircle size={iconSize} color="#ef4444" />;
      case 'incomplete':
        return <AlertCircle size={iconSize} color="#f59e0b" />;
      default:
        return <Shield size={iconSize} color="#6b7280" />;
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
      case 'suspended':
        return '#ef4444';
      case 'incomplete':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      case 'suspended':
        return 'Suspended';
      case 'incomplete':
        return 'Incomplete';
      default:
        return 'Unknown';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '4px 8px',
          fontSize: '12px',
          borderRadius: '6px'
        };
      case 'large':
        return {
          padding: '8px 16px',
          fontSize: '16px',
          borderRadius: '12px'
        };
      default: // medium
        return {
          padding: '6px 12px',
          fontSize: '14px',
          borderRadius: '8px'
        };
    }
  };

  if (loading) {
    return (
      <div 
        className={`verification-status-badge ${className}`}
        style={{
          ...getSizeStyles(),
          background: '#f3f4f6',
          color: '#6b7280',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '500'
        }}
      >
        <Shield size={size === 'small' ? 12 : size === 'large' ? 20 : 16} />
        <span>Loading...</span>
      </div>
    );
  }

  const { status } = getStatusInfo();
  const statusColor = getStatusColor(status);

  return (
    <div 
      className={`verification-status-badge ${className}`}
      style={{
        ...getSizeStyles(),
        background: `${statusColor}15`,
        color: statusColor,
        border: `1px solid ${statusColor}30`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      title={`Verification Status: ${getStatusText(status)} - Click to view details`}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      {getStatusIcon(status)}
      <span>{getStatusText(status)}</span>
    </div>
  );
};

export default VerificationStatusBadge;
