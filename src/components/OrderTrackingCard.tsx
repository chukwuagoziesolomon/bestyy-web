import React, { useState, useEffect } from 'react';
import { Clock, Package, Truck, CheckCircle } from 'lucide-react';
import { fetchOrderTracking } from '../api';

interface OrderTrackingCardProps {
  orderId: string;
  compact?: boolean;
  onViewDetails?: () => void;
}

const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({ orderId, compact = false, onViewDetails }) => {
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTracking();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadTracking, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  const loadTracking = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const data = await fetchOrderTracking(token, orderId);
      setTracking(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load tracking:', err);
      setError('Unable to load tracking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: compact ? '16px' : '20px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
          Loading tracking...
        </div>
      </div>
    );
  }

  if (error || !tracking?.success) {
    return null; // Don't show if tracking unavailable
  }

  const { order } = tracking;
  const currentStep = order?.timeline?.findIndex((step: any) => !step.completed) || 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: compact ? '16px' : '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: compact ? '12px' : '16px'
      }}>
        <div>
          <h4 style={{
            margin: '0 0 4px 0',
            fontSize: compact ? '14px' : '16px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Order Tracking
          </h4>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {order?.order_number}
          </p>
        </div>
        <div style={{
          background: getStatusColor(order?.status),
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {order?.status_display}
        </div>
      </div>

      {/* Progress Bar */}
      {order?.progress_percentage !== undefined && (
        <div style={{ marginBottom: compact ? '12px' : '16px' }}>
          <div style={{
            width: '100%',
            height: compact ? '6px' : '8px',
            background: '#f3f4f6',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${order.progress_percentage}%`,
              height: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              transition: 'width 0.5s ease',
              borderRadius: '10px'
            }} />
          </div>
          <p style={{
            margin: '6px 0 0 0',
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'right'
          }}>
            {order.progress_percentage}% Complete
          </p>
        </div>
      )}

      {/* Timeline - Compact */}
      {!compact && order?.timeline && order.timeline.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          {order.timeline.map((step: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: index < order.timeline.length - 1 ? '12px' : '0',
                opacity: step.completed ? 1 : 0.5
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step.completed ? '#10b981' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getStepIcon(step.icon, step.completed)}
              </div>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <p style={{
                  margin: '0 0 2px 0',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: step.completed ? '#1f2937' : '#9ca3af'
                }}>
                  {step.label}
                </p>
                {step.timestamp && (
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#9ca3af'
                  }}>
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Button */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          style={{
            marginTop: compact ? '12px' : '16px',
            width: '100%',
            padding: '10px',
            background: 'white',
            border: '1px solid #10b981',
            borderRadius: '8px',
            color: '#10b981',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#10b981';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#10b981';
          }}
        >
          View Full Details
        </button>
      )}
    </div>
  );
};

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'placed':
    case 'pending':
      return '#f59e0b';
    case 'confirmed':
    case 'preparing':
      return '#3b82f6';
    case 'ready':
    case 'out_for_delivery':
      return '#8b5cf6';
    case 'delivered':
    case 'completed':
      return '#10b981';
    case 'cancelled':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const getStepIcon = (icon: string, completed: boolean) => {
  const color = completed ? 'white' : '#9ca3af';
  const size = 16;

  switch (icon) {
    case '📝':
      return <Package size={size} color={color} />;
    case '💳':
      return <CheckCircle size={size} color={color} />;
    case '👨‍🍳':
    case '🍴':
      return <Package size={size} color={color} />;
    case '📦':
      return <Package size={size} color={color} />;
    case '🚚':
      return <Truck size={size} color={color} />;
    case '✅':
      return <CheckCircle size={size} color={color} />;
    default:
      return <Clock size={size} color={color} />;
  }
};

export default OrderTrackingCard;
