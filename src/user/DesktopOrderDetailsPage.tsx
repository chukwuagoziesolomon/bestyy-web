import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, MessageCircle, MapPin, Clock, Package, CreditCard } from 'lucide-react';

const DesktopOrderDetailsPage: React.FC<{ orderId?: string }> = ({ orderId: propOrderId }) => {
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  
  // Use the orderId from props or from URL params
  const currentOrderId = propOrderId || paramOrderId;

  // Sample order data - in real app this would come from API
  const orderData = {
    id: currentOrderId || '1',
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
      background: '#f8fafc',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              color: '#64748b'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft size={24} />
            <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>Back to Orders</span>
          </button>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
          }}>
            Order Details
          </h1>

          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              color: '#64748b'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Order Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            gap: '24px',
            alignItems: 'center',
            padding: '24px',
            background: '#f8fafc',
            borderRadius: '12px',
            marginBottom: '32px'
          }}>
            {/* Vendor Logo */}
            <div style={{
              width: '80px',
              height: '80px',
              background: '#ef4444',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{
                color: '#fbbf24',
                fontSize: '32px',
                fontWeight: '700'
              }}>
                B
              </span>
            </div>
            
            {/* Vendor Info */}
            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                {orderData.vendor.name}
              </h2>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                color: '#64748b'
              }}>
                {orderData.date}
              </p>
              <span style={{
                ...getStatusColor(orderData.status),
                padding: '6px 16px',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {orderData.status}
              </span>
            </div>

            {/* Total Amount */}
            <div style={{
              textAlign: 'right'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                {orderData.total}
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '32px'
          }}>
            {/* Left Column */}
            <div>
              {/* Items Section */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Package size={20} />
                  Order Items
                </h3>
                <div>
                  {orderData.items.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      fontSize: '16px',
                      borderBottom: index < orderData.items.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}>
                      <span style={{ color: '#64748b', fontWeight: '400' }}>{item.name}</span>
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

              {/* Delivery Info */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MapPin size={20} />
                  Delivery Information
                </h3>
                <div style={{
                  fontSize: '16px',
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Address:</strong> {orderData.delivery.address}</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Recipient:</strong> {orderData.delivery.recipient}</p>
                  <p style={{ margin: '0' }}><strong>Phone:</strong> {orderData.delivery.phone}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Payment Info */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CreditCard size={20} />
                  Payment Details
                </h3>
                <div style={{
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{ color: '#64748b' }}>Method:</span>
                    <span style={{ color: '#1e293b', fontWeight: '600' }}>{orderData.payment.method}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#64748b' }}>Status:</span>
                    <span style={{
                      color: '#10b981',
                      fontWeight: '700'
                    }}>
                      {orderData.payment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reorder Button */}
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
                  padding: '20px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                <MessageCircle size={24} />
                Reorder on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopOrderDetailsPage;
