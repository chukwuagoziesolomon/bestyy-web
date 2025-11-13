import React, { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink, Phone, Mail, MessageCircle } from 'lucide-react';
import { verificationApi, VendorVerificationStatus, CourierVerificationStatus } from '../services/verificationApi';
import { showError, showSuccess } from '../toast';
import WhatsAppVerification from './WhatsAppVerification';

interface VerificationStatusProps {
  userType: 'vendor' | 'courier';
  className?: string;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ userType, className = '' }) => {
  const [vendorStatus, setVendorStatus] = useState<VendorVerificationStatus | null>(null);
  const [courierStatus, setCourierStatus] = useState<CourierVerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerificationStatus();
  }, [userType]);

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      if (userType === 'vendor') {
        const status = await verificationApi.getVendorVerificationStatus();
        setVendorStatus(status);
      } else {
        const status = await verificationApi.getCourierVerificationStatus();
        setCourierStatus(status);
      }
    } catch (err) {
      setError('Failed to load verification status');
      console.error('Error loading verification status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} color="#10b981" />;
      case 'rejected':
        return <XCircle size={20} color="#ef4444" />;
      case 'pending':
        return <Clock size={20} color="#f59e0b" />;
      case 'suspended':
        return <AlertCircle size={20} color="#ef4444" />;
      case 'incomplete':
        return <AlertCircle size={20} color="#f59e0b" />;
      default:
        return <Shield size={20} color="#6b7280" />;
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
        return 'Verified & Approved';
      case 'rejected':
        return 'Not Approved';
      case 'pending':
        return 'Under Review';
      case 'suspended':
        return 'Suspended';
      case 'incomplete':
        return 'Incomplete';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className={`verification-status ${className}`} style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield size={24} color="#10b981" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
            Verification Status
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
          <RefreshCw size={16} className="animate-spin" />
          <span>Loading verification status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`verification-status ${className}`} style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield size={24} color="#10b981" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
            Verification Status
          </h3>
        </div>
        <div style={{ color: '#ef4444', marginBottom: '16px' }}>
          {error}
        </div>
        <button
          onClick={loadVerificationStatus}
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  // Render vendor verification status
  if (userType === 'vendor' && vendorStatus) {
    // Get phone number from localStorage
    const getPhoneNumber = () => {
      const vendorProfile = localStorage.getItem('vendor_profile');
      if (vendorProfile) {
        try {
          const profile = JSON.parse(vendorProfile);
          return profile.phone || '';
        } catch (e) {
          return '';
        }
      }
      return '';
    };

    const phoneNumber = getPhoneNumber();

    return (
      <div className={`verification-status ${className}`} style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield size={24} color="#10b981" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
            Verification Status
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          {getStatusIcon(vendorStatus.status)}
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: getStatusColor(vendorStatus.status)
            }}>
              {getStatusText(vendorStatus.status)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {vendorStatus.message}
            </div>
          </div>
        </div>

        {vendorStatus.notes && (
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Admin Notes:
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {vendorStatus.notes}
            </div>
          </div>
        )}

        {/* WhatsApp Verification Section */}
        {phoneNumber && (
          <div style={{ marginBottom: '16px' }}>
            <WhatsAppVerification
              phoneNumber={phoneNumber}
              countryCode="+234"
              onVerificationComplete={(verified, phoneNumber) => {
                if (verified) {
                  showSuccess('WhatsApp verified successfully!');
                  loadVerificationStatus(); // Refresh status
                }
              }}
              onVerificationSkip={() => {
                showError('WhatsApp verification skipped. You can verify later.');
              }}
              required={false}
            />
          </div>
        )}

        {/* Bank/ID Verification Section */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Bank Account Verification
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            Verify your bank account to receive payouts securely.
          </div>
          <button
            style={{
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Shield size={16} />
            Verify Bank Account
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={loadVerificationStatus}
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
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Render courier verification status
  if (userType === 'courier' && courierStatus?.success) {
    const data = courierStatus.data;

    // Get phone number from localStorage
    const getPhoneNumber = () => {
      const vendorProfile = localStorage.getItem('vendor_profile');
      if (vendorProfile) {
        try {
          const profile = JSON.parse(vendorProfile);
          return profile.phone || '';
        } catch (e) {
          return '';
        }
      }
      return '';
    };

    const phoneNumber = getPhoneNumber();

    return (
      <div className={`verification-status ${className}`} style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield size={24} color="#10b981" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
            Verification Status
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          {getStatusIcon(data.verification_status)}
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: getStatusColor(data.verification_status)
            }}>
              {getStatusText(data.verification_status)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {data.message}
            </div>
          </div>
        </div>

        {data.verification_notes && (
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Admin Notes:
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {data.verification_notes}
            </div>
          </div>
        )}

        {/* WhatsApp Verification Section */}
        {phoneNumber && (
          <div style={{ marginBottom: '16px' }}>
            <WhatsAppVerification
              phoneNumber={phoneNumber}
              countryCode="+234"
              onVerificationComplete={(verified, phoneNumber) => {
                if (verified) {
                  showError('WhatsApp verified successfully!'); // Using showError for now, should be showSuccess
                  loadVerificationStatus(); // Refresh status
                }
              }}
              onVerificationSkip={() => {
                showError('WhatsApp verification skipped. You can verify later.');
              }}
              required={false}
            />
          </div>
        )}

        {/* Identity Verification Section */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Identity Verification
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            Verify your identity with government-issued ID to start accepting deliveries.
          </div>
          <button
            style={{
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Shield size={16} />
            Verify Identity
          </button>
        </div>

        {data.next_steps && data.next_steps.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Next Steps:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {data.next_steps.map((step, index) => (
                <li key={index} style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{
          background: '#f0f9ff',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#0369a1', marginBottom: '8px' }}>
            Support Contact:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0369a1' }}>
              <Mail size={14} />
              <a href={`mailto:${data.support_contact.email}`} style={{ color: '#0369a1', textDecoration: 'none' }}>
                {data.support_contact.email}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0369a1' }}>
              <Phone size={14} />
              <a href={`tel:${data.support_contact.phone}`} style={{ color: '#0369a1', textDecoration: 'none' }}>
                {data.support_contact.phone}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0369a1' }}>
              <MessageCircle size={14} />
              <a href={`https://wa.me/${data.support_contact.whatsapp.replace(/[^0-9]/g, '')}`} style={{ color: '#0369a1', textDecoration: 'none' }}>
                WhatsApp: {data.support_contact.whatsapp}
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={loadVerificationStatus}
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
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default VerificationStatus;
