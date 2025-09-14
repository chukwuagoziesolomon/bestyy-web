import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GuestOrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = (location.state as any)?.orderId;
  const orderData = (location.state as any)?.orderData;
  const guestInfo = (location.state as any)?.guestInfo;

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking page (you can implement this later)
    navigate('/track-order', { 
      state: { 
        orderId, 
        phone: guestInfo?.phone 
      } 
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'bounce 0.6s ease-in-out'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>

        {/* Success Message */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 16px 0',
          lineHeight: '1.2'
        }}>
          Order Confirmed! 🎉
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 24px 0',
          lineHeight: '1.5'
        }}>
          Thank you, {guestInfo?.firstName}! Your order has been successfully placed and will be prepared soon.
        </p>

        {/* Order Details */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '20px',
          margin: '24px 0',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 16px 0'
          }}>
            Order Details
          </h3>
          
          <div style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Order ID:</span>
              <span style={{ marginLeft: '8px', color: '#6b7280', fontFamily: 'monospace' }}>
                #{orderId || 'N/A'}
              </span>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Items:</span>
              <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                {orderData?.cartItems?.length || 0} item{(orderData?.cartItems?.length || 0) > 1 ? 's' : ''}
              </span>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Total:</span>
              <span style={{ marginLeft: '8px', color: '#10b981', fontWeight: '600' }}>
                ₦{(orderData?.total || 0).toLocaleString()}
              </span>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Delivery Address:</span>
              <div style={{ marginTop: '4px', color: '#6b7280', fontSize: '14px' }}>
                {guestInfo?.deliveryAddress}
              </div>
            </div>
            
            <div>
              <span style={{ fontWeight: '600', color: '#374151' }}>Phone:</span>
              <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                {guestInfo?.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px',
          margin: '24px 0',
          textAlign: 'left'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#92400e',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            What's Next?
          </h4>
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            color: '#92400e',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <li>You'll receive an SMS confirmation shortly</li>
            <li>Our vendor will start preparing your order</li>
            <li>A courier will be assigned and contact you</li>
            <li>Estimated delivery time: 30-45 minutes</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '32px'
        }}>
          <button
            onClick={handleBackToHome}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
            }}
          >
            Back to Home
          </button>
          
          <button
            onClick={handleTrackOrder}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#10b981';
            }}
          >
            Track Order
          </button>
        </div>

        {/* Contact Info */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            Need help? Contact us at{' '}
            <a href="tel:+2348012345678" style={{ color: '#10b981', textDecoration: 'none' }}>
              +234 801 234 5678
            </a>
          </p>
          <p style={{ margin: '0' }}>
            Or email us at{' '}
            <a href="mailto:support@bestyy.com" style={{ color: '#10b981', textDecoration: 'none' }}>
              support@bestyy.com
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @media (max-width: 640px) {
          .success-container {
            margin: 0 16px;
            padding: 24px;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestOrderSuccess;


