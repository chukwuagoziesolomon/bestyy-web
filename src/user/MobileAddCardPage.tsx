import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import HamburgerMenu from '../components/HamburgerMenu';
import { useResponsive } from '../hooks/useResponsive';

const MobileAddCardPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cardNumber: '1234 0000 0000 0000',
    cvv: '',
    expiry: '',
    nameOnCard: '',
    saveCard: true
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.cardNumber || !formData.cvv || !formData.expiry || !formData.nameOnCard) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to add card
      console.log('Adding card:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to payment methods
      navigate('/user/dashboard/payment-methods');
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to add card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user/dashboard/payment-methods');
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.length <= 19) { // Max length for formatted card number
      handleInputChange('cardNumber', formatted);
    }
  };

  const formatExpiry = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after MM
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 6);
    }
    return digits;
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value);
    if (formatted.length <= 7) { // MM/YYYY
      handleInputChange('expiry', formatted);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: isTablet ? '768px' : '414px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeft size={24} color="#333" />
        </button>
        <HamburgerMenu size={24} color="#333" />
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Title */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          margin: '0 0 8px 0'
        }}>
          Add Card
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: '0 0 32px 0'
        }}>
          Add new card and save for later
        </p>

        <form onSubmit={handleSubmit}>
          {/* Card Number */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              Card Number
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '16px',
              gap: '12px'
            }}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" 
                alt="Mastercard" 
                style={{ 
                  width: '32px', 
                  height: '20px', 
                  objectFit: 'contain' 
                }} 
              />
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 0000 0000 0000"
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  fontWeight: '600'
                }}
              />
            </div>
          </div>

          {/* CVV and Expiry Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* CVV */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#999',
                marginBottom: '8px'
              }}>
                CVV
              </label>
              <input
                type="password"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="•••"
                maxLength={4}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontWeight: '600'
                }}
              />
            </div>

            {/* Expiry */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#999',
                marginBottom: '8px'
              }}>
                Expiry
              </label>
              <input
                type="text"
                value={formData.expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM/YYYY"
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Name on Card */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              Name on Card
            </label>
            <input
              type="text"
              value={formData.nameOnCard}
              onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
              placeholder="e.g. Silver Snow"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#333',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Save Card Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px'
          }}>
            <div
              onClick={() => handleInputChange('saveCard', !formData.saveCard)}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: formData.saveCard ? '#10b981' : '#f5f5f5',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: formData.saveCard ? '2px solid #10b981' : '2px solid #e0e0e0'
              }}
            >
              {formData.saveCard && <Check size={16} color="white" />}
            </div>
            <label
              onClick={() => handleInputChange('saveCard', !formData.saveCard)}
              style={{
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              Save Card
            </label>
          </div>

          {/* Add Card Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: loading ? '#9ca3af' : '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
          >
            {loading ? 'Adding Card...' : 'Add Card'}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancel}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              color: '#333',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileAddCardPage;
