import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, Edit, Trash2, Plus } from 'lucide-react';
import { fetchUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress } from '../api';
import { showError, showSuccess } from '../toast';
import BottomNav from '../components/BottomNav';
import HamburgerMenu from '../components/HamburgerMenu';
import { useResponsive } from '../hooks/useResponsive';

interface Address {
  id: number;
  address_type: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

const MobileSavedAddressesPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAddresses() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await fetchUserAddresses(token);
          setAddresses(data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Could not fetch addresses');
        showError(err.message || 'Could not fetch addresses');
      } finally {
        setLoading(false);
      }
    }
    getAddresses();
  }, [token]);

  const getAddressIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home size={24} color="#10b981" />;
      case 'work':
        return <Briefcase size={24} color="#10b981" />;
      default:
        return <Home size={24} color="#10b981" />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const formatAddress = (address: Address) => {
    return `${address.street_address}, ${address.city} ${address.state}, ${address.postal_code}`;
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
      {/* Header Section */}
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
          Saved Addresses
        </h1>
        <HamburgerMenu size={24} color="#6c757d" />
      </div>

      {/* Description */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6c757d',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px' }}>
        {loading ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '16px'
          }}>
            Loading addresses...
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#dc3545',
            fontSize: '16px'
          }}>
            {error}
          </div>
        ) : addresses.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '16px'
          }}>
            No saved addresses found.
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {addresses.map((address, index) => (
              <div key={address.id}>
                <div style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  {/* Address Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#e6f7f2',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getAddressIcon(address.address_type)}
                  </div>

                  {/* Address Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#212529',
                        margin: 0
                      }}>
                        {getAddressTypeLabel(address.address_type)}
                      </h3>
                      {address.is_default && (
                        <span style={{
                          backgroundColor: '#d1fae5',
                          color: '#065f46',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          Default
                        </span>
                      )}
                    </div>
                    
                    <p style={{
                      fontSize: '14px',
                      color: '#6c757d',
                      margin: '0 0 12px 0',
                      lineHeight: '1.4'
                    }}>
                      {formatAddress(address)}
                    </p>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}>
                        <Edit size={16} color="#6c757d" />
                      </button>
                      
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}>
                        <Trash2 size={16} color="#dc3545" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divider (except for last item) */}
                {index < addresses.length - 1 && (
                  <div style={{
                    borderBottom: '1px solid #f3f4f6',
                    marginLeft: '64px'
                  }}></div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Address Button */}
        <button
          onClick={() => navigate('/user/dashboard/addresses/add')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            margin: '20px 0',
            padding: '16px',
            backgroundColor: '#10b981',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
          }}
        >
          <Plus size={20} />
          <span>Add new Address</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MobileSavedAddressesPage;
