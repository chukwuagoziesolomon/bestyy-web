import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';
import { createUserAddress } from '../api';
import { showError, showSuccess } from '../toast';
import HamburgerMenu from '../components/HamburgerMenu';
import { useResponsive } from '../hooks/useResponsive';

interface AddressFormData {
  address_type: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

const MobileAddAddressPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState<AddressFormData>({
    address_type: 'Work',
    street_address: '',
    city: 'Alimosho',
    state: 'Lagos',
    postal_code: '',
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

    if (!token) {
      showError('Authentication required');
      return;
    }

    // Validation
    if (!formData.address_type || !formData.street_address || !formData.city || !formData.state || !formData.postal_code) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createUserAddress(token, formData);
      showSuccess('Address added successfully!');
      navigate('/user/dashboard/addresses');
    } catch (err: any) {
      showError(err.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user/dashboard/addresses');
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
              value={formData.street_address}
              onChange={(e) => handleInputChange('street_address', e.target.value)}
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

          {/* State Dropdown */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              State
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
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
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Rivers">Rivers</option>
                <option value="Kano">Kano</option>
                <option value="Oyo">Oyo</option>
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

          {/* City Dropdown */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#999',
              marginBottom: '8px'
            }}>
              City
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
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
                <option value="Alimosho">Alimosho</option>
                <option value="Ikeja">Ikeja</option>
                <option value="Victoria Island">Victoria Island</option>
                <option value="Lekki">Lekki</option>
                <option value="Surulere">Surulere</option>
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
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
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
