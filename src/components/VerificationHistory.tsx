import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Calendar, FileText } from 'lucide-react';
import { verificationApi, VerificationHistory as VerificationHistoryType } from '../services/verificationApi';
import { showError } from '../toast';

interface VerificationHistoryProps {
  className?: string;
}

const VerificationHistory: React.FC<VerificationHistoryProps> = ({ className = '' }) => {
  const [history, setHistory] = useState<VerificationHistoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerificationHistory();
  }, []);

  const loadVerificationHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const historyData = await verificationApi.getCourierVerificationHistory();
      setHistory(historyData);
    } catch (err) {
      setError('Failed to load verification history');
      console.error('Error loading verification history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText size={16} color="#3b82f6" />;
      case 'approved':
        return <CheckCircle size={16} color="#10b981" />;
      case 'rejected':
        return <XCircle size={16} color="#ef4444" />;
      case 'estimated':
        return <Clock size={16} color="#f59e0b" />;
      default:
        return <AlertCircle size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#3b82f6';
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'estimated':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className={`verification-history ${className}`} style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Clock size={24} color="#10b981" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
            Verification History
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
          <RefreshCw size={16} className="animate-spin" />
          <span>Loading verification history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`verification-history ${className}`} style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Clock size={24} color="#10b981" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
            Verification History
          </h3>
        </div>
        <div style={{ color: '#ef4444', marginBottom: '16px' }}>
          {error}
        </div>
        <button
          onClick={loadVerificationHistory}
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

  if (!history?.success || !history.data) {
    return null;
  }

  const { data } = history;

  return (
    <div className={`verification-history ${className}`} style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Clock size={24} color="#10b981" />
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
          Verification History
        </h3>
      </div>

      {/* Current Status Summary */}
      <div style={{
        background: '#f9fafb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Calendar size={16} color="#6b7280" />
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Application Date: {formatDate(data.application_date)}
          </span>
        </div>
        {data.verification_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <CheckCircle size={16} color="#10b981" />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Verification Date: {formatDate(data.verification_date)}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={16} color="#f59e0b" />
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Estimated Review Time: {data.estimated_review_time}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#1f2937' }}>
          Timeline
        </h4>
        <div style={{ position: 'relative' }}>
          {data.timeline.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: index === data.timeline.length - 1 ? '0' : '24px',
              position: 'relative'
            }}>
              {/* Timeline line */}
              {index < data.timeline.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '32px',
                  width: '2px',
                  height: '24px',
                  background: '#e5e7eb'
                }} />
              )}
              
              {/* Timeline icon */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#fff',
                border: `2px solid ${getStatusColor(item.status)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                {getStatusIcon(item.status)}
              </div>
              
              {/* Timeline content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: 0,
                    color: '#1f2937'
                  }}>
                    {item.title}
                  </h5>
                  <span style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {item.icon}
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 4px 0',
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </p>
                {item.date && (
                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Calendar size={12} />
                    {formatDate(item.date)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes */}
      {data.verification_notes && (
        <div style={{
          background: '#fef3c7',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          border: '1px solid #fbbf24'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#92400e', marginBottom: '4px' }}>
            Admin Notes:
          </div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>
            {data.verification_notes}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={loadVerificationHistory}
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
};

export default VerificationHistory;
