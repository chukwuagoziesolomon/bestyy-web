import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';
import MobileHeader from '../components/MobileHeader';
import { useResponsive } from '../hooks/useResponsive';

interface AddressFormData {
  address_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

const MobileAddAddressPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AddressFormData>({
    address_type: 'home',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    is_default: false
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.address_type || !formData.address || !formData.city || !formData.state || !formData.zip_code) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Simulate successful address creation
      console.log('Address created:', formData);
      alert('Address added successfully!');
      navigate('/user/addresses');
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/user/addresses');
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
                           <MobileHeader
          title="Add Address"
          subtitle="Add new address and save for later"
          showBackButton={true}
          variant="default"
          profileImageSize="medium"
          showProfileImage={true}
        />

      {/* Content */}
      <div style={{ 
        padding: '20px',
        marginTop: '8px'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          margin: '0 0 8px 0'
        }}>
          Add Address
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: '0 0 32px 0'
        }}>
          Add new Address and save for later
        </p>

        <form onSubmit={handleSubmit}>
          {/* Address Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="11, add street ave"
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

          {/* Address Type Dropdown */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              Address Type
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={formData.address_type}
                onChange={(e) => handleInputChange('address_type', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  appearance: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown
                size={20}
                color="#999"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>

          {/* State Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Enter your state"
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

          {/* City Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter your city"
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

          {/* ZIP Code */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.zip_code}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
              placeholder="Enter ZIP Code"
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

          {/* Set as Default Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px'
          }}>
            <div
              onClick={() => handleInputChange('is_default', !formData.is_default)}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: formData.is_default ? '#10b981' : '#f5f5f5',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: formData.is_default ? '2px solid #10b981' : '2px solid #e0e0e0'
              }}
            >
              {formData.is_default && <Check size={16} color="white" />}
            </div>
            <label
              onClick={() => handleInputChange('is_default', !formData.is_default)}
              style={{
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              Set as Default Address
            </label>
          </div>

          {/* Add Address Button */}
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
            {loading ? 'Adding Address...' : 'Add Address'}
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

export default MobileAddAddressPage;
