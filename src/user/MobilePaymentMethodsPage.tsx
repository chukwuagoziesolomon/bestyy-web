import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, CreditCard } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import HamburgerMenu from '../components/HamburgerMenu';
import { useResponsive } from '../hooks/useResponsive';

const paymentMethods = [
  {
    id: 1,
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
    isPrimary: true,
  },
  {
    id: 2,
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
    isPrimary: false,
  },
  {
    id: 3,
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
    isPrimary: false,
  },
  {
    id: 4,
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
    isPrimary: false,
  },
];

const MobilePaymentMethodsPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();

  const handleAddPaymentMethod = () => {
    navigate('/user/dashboard/payment-methods/add');
  };

  const handleEditPaymentMethod = (id: number) => {
    // TODO: Navigate to edit payment method page
    console.log('Edit payment method:', id);
  };

  const handleDeletePaymentMethod = (id: number) => {
    // TODO: Show confirmation modal and delete payment method
    console.log('Delete payment method:', id);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: isTablet ? '768px' : '414px',
      margin: '0 auto',
      position: 'relative',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e9ecef',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: 0,
          color: '#212529'
        }}>
          Payment Methods
        </h1>
        <HamburgerMenu size={24} color="#6c757d" />
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Description */}
        <p style={{
          fontSize: '14px',
          color: '#6c757d',
          margin: '0 0 24px 0',
          lineHeight: '1.5'
        }}>
          Quickly select saved delivery locations when placing food orders. Add or update them anytime.
        </p>

        {/* Payment Methods List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                position: 'relative'
              }}
            >
              {/* Card Content */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                {/* Left Side - Card Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  {/* Card Logo */}
                  <div style={{
                    width: '48px',
                    height: '32px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={method.logo} 
                      alt={method.brand}
                      style={{
                        width: '40px',
                        height: '24px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Card Details */}
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                      color: '#212529'
                    }}>
                      {method.brand}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6c757d',
                      margin: 0
                    }}>
                      {method.number} | Expiry{method.expiry}
                    </p>
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handleEditPaymentMethod(method.id)}
                    style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Edit size={18} color="#6c757d" />
                  </button>
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={18} color="#dc3545" />
                  </button>
                </div>
              </div>

              {/* Primary Badge */}
              {method.isPrimary && (
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '20px',
                  backgroundColor: '#d1fae5',
                  color: '#10b981',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '6px'
                }}>
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Payment Method Button */}
        <button
          onClick={handleAddPaymentMethod}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '16px',
            backgroundColor: '#10b981',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
          }}
        >
          <CreditCard size={20} />
          <span>Add Payment Method</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MobilePaymentMethodsPage;
