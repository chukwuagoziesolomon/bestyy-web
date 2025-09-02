import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileHeader from '../components/MobileHeader';
import { ArrowLeft, X, MessageCircle } from 'lucide-react';

const MobileOrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Sample order data - in real app this would come from API
  const orderData = {
    id: orderId || '1',
    vendor: {
      name: 'Mr Biggs',
      logo: '/mr-biggs-logo.png'
    },
    status: 'Delivered',
    total: 'N5,000',
    date: '15, Jun 2025, 12:00 PM',
    delivery: {
      address: '12, Enugu ave,222',
      recipient: 'Silver snow',
      phone: '08090530061'
    },
    items: [
      { name: '1x fried chicken and Turkey', price: 'N4,000' },
      { name: '1x Sprite (50CL)', price: 'N1,000' }
    ],
    payment: {
      method: 'Opay ***** 2206',
      status: 'Paid'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { background: '#2dd4bf', color: 'white' };
      case 'in transit':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'pending':
        return { background: '#fef3c7', color: '#d97706' };
      default:
        return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      color: '#1e293b',
      minHeight: '100vh',
      background: '#ffffff',
      maxWidth: '414px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <MobileHeader 
        title="Order Details"
        showBackButton={true}
        variant="compact"
        profileImageSize="medium"
        showProfileImage={false}
        rightAction={
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} color="#64748b" />
          </button>
        }
      />

      {/* Order Summary */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          {/* Vendor Logo */}
          <div style={{
            width: '48px',
            height: '48px',
            background: '#ef4444',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{
              color: '#fbbf24',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              B
            </span>
          </div>
          
          {/* Vendor Info */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              margin: '0 0 4px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              {orderData.vendor.name}
            </h2>
            <span style={{
              ...getStatusColor(orderData.status),
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              {orderData.status}
            </span>
          </div>

          {/* Total Amount */}
          <div style={{
            textAlign: 'right',
            flexShrink: 0
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              {orderData.total}
            </span>
          </div>
        </div>

        {/* Order Date */}
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '14px',
          color: '#64748b',
          fontWeight: '400'
        }}>
          {orderData.date}
        </p>
      </div>

      {/* Delivery Info */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1e293b'
        }}>
          Delivery Info
        </h3>
        <div style={{
          fontSize: '14px',
          color: '#64748b',
          fontWeight: '400',
          lineHeight: '1.5'
        }}>
          <p style={{ margin: '0 0 4px 0' }}>{orderData.delivery.address}</p>
          <p style={{ margin: '0 0 4px 0' }}>{orderData.delivery.recipient}</p>
          <p style={{ margin: '0' }}>{orderData.delivery.phone}</p>
        </div>
      </div>

      {/* Items */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1e293b'
        }}>
          Items
        </h3>
        <div>
          {orderData.items.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              <span>{item.name}</span>
              <span style={{
                color: '#1e293b',
                fontWeight: '700'
              }}>
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1e293b'
        }}>
          Payment
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}>
          <span style={{
            color: '#64748b',
            fontWeight: '400'
          }}>
            {orderData.payment.method}
          </span>
          <span style={{
            color: '#1e293b',
            fontWeight: '700'
          }}>
            {orderData.payment.status}
          </span>
        </div>
      </div>

      {/* Reorder Button */}
      <div style={{
        padding: '20px 16px',
        position: 'sticky',
        bottom: 0,
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0'
      }}>
        <button
          onClick={() => {
            // WhatsApp reorder functionality
            const message = `Hi! I'd like to reorder from ${orderData.vendor.name}. Order ID: ${orderData.id}`;
            const whatsappUrl = `https://wa.me/2348090530061?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          style={{
            width: '100%',
            background: '#10b981',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
          }}
        >
          <MessageCircle size={20} />
          Reorder on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default MobileOrderDetailsPage;
