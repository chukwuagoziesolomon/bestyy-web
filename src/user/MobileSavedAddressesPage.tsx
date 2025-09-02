import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Edit, Trash2, Plus, Star } from 'lucide-react';
import MobileHeader from '../components/MobileHeader';
import { useResponsive } from '../hooks/useResponsive';
import { fetchUserAddresses, deleteUserAddress, setDefaultAddress } from '../api';

interface Address {
  id: number;
  address_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

const MobileSavedAddressesPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [defaultLoading, setDefaultLoading] = useState<number | null>(null);
  const token = localStorage.getItem('access_token');

  // Fetch addresses from API
  useEffect(() => {
    const loadAddresses = async () => {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserAddresses(token);
        console.log('Fetched addresses:', data);
        const addressesArray = data.results || data || [];
        setAddresses(addressesArray);
      } catch (err: any) {
        console.error('Error fetching addresses:', err);
        setError(err.message || 'Failed to fetch addresses');
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [token, location.search]);

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
    return `${address.address}, ${address.city} ${address.state}, ${address.zip_code}`;
  };

  const handleDeleteAddress = async (id: number) => {
    if (!token) return;
    
    try {
      setDeleteLoading(id);
      await deleteUserAddress(token, id);
      // Remove the deleted address from state
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err: any) {
      console.error('Error deleting address:', err);
      alert(err.message || 'Failed to delete address');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    if (!token) return;
    
    try {
      setDefaultLoading(id);
      await setDefaultAddress(token, id);
      // Update the addresses state to reflect the new default
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === id
      })));
    } catch (err: any) {
      console.error('Error setting default address:', err);
      alert(err.message || 'Failed to set default address');
    } finally {
      setDefaultLoading(null);
    }
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
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Header Section */}
                           <MobileHeader
          title="Saved Addresses"
          subtitle="Manage your saved delivery addresses"
          variant="default"
          profileImageSize="medium"
          showProfileImage={true}
        />

      {/* Description */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '16px',
        marginTop: '8px'
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
                      {!address.is_default && (
                        <button 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleSetDefault(address.id)}
                          disabled={defaultLoading === address.id}
                        >
                          {defaultLoading === address.id ? (
                            <div style={{ width: '16px', height: '16px', border: '2px solid #f59e0b', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <Star size={16} color="#f59e0b" />
                          )}
                        </button>
                      )}
                      
                      <button 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/user/addresses/edit/${address.id}`)}
                      >
                        <Edit size={16} color="#6c757d" />
                      </button>
                      
                      <button 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={deleteLoading === address.id}
                      >
                        {deleteLoading === address.id ? (
                          <div style={{ width: '16px', height: '16px', border: '2px solid #dc3545', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Trash2 size={16} color="#dc3545" />
                        )}
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
          onClick={() => navigate('/user/addresses/add')}
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

             {/* Bottom Navigation is now handled by UserDashboardLayout */}
     </div>
   );
 };

 export default MobileSavedAddressesPage;
