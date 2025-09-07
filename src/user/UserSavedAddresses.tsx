import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Edit, Trash2, Plus, MapPin, Star } from 'lucide-react';
import { fetchUserAddresses, deleteUserAddress, setDefaultAddress } from '../api';

// Types
interface Address {
  id: number;
  address_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  custom_label?: string;
}

const UserSavedAddresses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteAddressId, setDeleteAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [defaultLoading, setDefaultLoading] = useState<number | null>(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    async function getAddresses() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await fetchUserAddresses(token);
          console.log('Fetched addresses:', data); // Debug log
          // Handle both direct array and wrapped response
          const addressesArray = data.results || data || [];
          setAddresses(addressesArray);
        }
      } catch (err: any) {
        setError(err.message || 'Could not fetch addresses');
        console.error('Error fetching addresses:', err);
      } finally {
        setLoading(false);
      }
    }
    getAddresses();
  }, [token, location.search]); // Re-run when URL changes (refresh parameter)

  const handleAddAddress = () => {
    navigate('/user/addresses/add');
  };

  const handleEditAddress = (addressId: number) => {
    navigate(`/user/addresses/edit/${addressId}`);
  };

  const handleDeleteAddress = async (id: number) => {
    if (!token) return;
    
    try {
      setDeleteLoading(id);
      await deleteUserAddress(token, id);
      // Remove the deleted address from state
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      setDeleteAddressId(null);
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
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
    {/* Saved Address Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Saved Address</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>Quickly select saved delivery locations when placing food orders. Add or update them anytime.</div>
      </div>
        <button onClick={handleAddAddress} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 28px', cursor: 'pointer' }}>
        <Plus size={20} /> Add new Address
      </button>
    </div>
      
    {/* Saved Address Cards */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 40, minHeight: 120 }}>
        {loading ? (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 300 
          }}>
            <div style={{ color: '#6b7280', fontSize: 16 }}>Loading addresses...</div>
          </div>
        ) : error ? (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 300 
          }}>
            <div style={{ color: '#dc3545', fontSize: 16 }}>Error: {error}</div>
          </div>
        ) : addresses.length === 0 ? (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 400,
            background: '#fafafa',
            borderRadius: 16,
            border: '2px dashed #e5e7eb',
            padding: '60px 20px'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24
            }}>
              <MapPin size={40} color="#10b981" />
            </div>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 24, 
              marginBottom: 12, 
              color: '#1f2937', 
              textAlign: 'center' 
            }}>
              No saved addresses yet
            </div>
            <div style={{ 
              color: '#6b7280', 
              fontSize: 16, 
              marginBottom: 32, 
              textAlign: 'center',
              maxWidth: 400,
              lineHeight: 1.5
            }}>
              Save your delivery addresses to make ordering faster and easier. Add your home, work, or any other location you frequently order from.
            </div>
            <button 
              onClick={handleAddAddress} 
              style={{ 
                background: '#10b981', 
                color: '#fff', 
                fontWeight: 600, 
                fontSize: 16, 
                border: 'none', 
                borderRadius: 12, 
                padding: '16px 32px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              <Plus size={20} /> Add your first address
            </button>
          </div>
        ) : (
          addresses.map((addr: Address, i: number) => {
            let icon = <MapPin size={24} />;
            let label = addr.address_type ? addr.address_type.charAt(0).toUpperCase() + addr.address_type.slice(1) : 'Address';
            if (addr.address_type === 'home') {
              icon = <Home size={24} />;
              label = 'Home';
            } else if (addr.address_type === 'work') {
              icon = <Briefcase size={24} />;
              label = 'Work';
            } else if (addr.address_type === 'other' && addr.custom_label) {
              label = addr.custom_label;
            } else if (addr.address_type === 'other') {
              label = 'Other';
            }
            return (
              <div key={addr.id || i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '32px 32px 24px 32px', minWidth: 320, flex: 1, border: '1.5px solid #f3f4f6', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  {icon}
                  <span style={{ fontWeight: 700, fontSize: 22 }}>{label}</span>
                  {addr.is_default && <span style={{ position: 'absolute', right: 32, top: 32, background: '#fff', color: '#10b981', fontWeight: 700, fontSize: 15, borderRadius: 8, padding: '4px 16px', border: '1.5px solid #d1fae5' }}>Default</span>}
                </div>
                <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>
                  {addr.address}, {addr.city}, {addr.state}, {addr.zip_code}
                </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
                  {!addr.is_default && (
                    <button 
                      style={{ 
                        background: '#f8fafc', 
                        color: '#f59e0b', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: 8, 
                        padding: '8px 12px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }} 
                      onClick={() => handleSetDefault(addr.id)}
                      disabled={defaultLoading === addr.id}
                    >
                      {defaultLoading === addr.id ? (
                        <div style={{ width: '16px', height: '16px', border: '2px solid #f59e0b', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Star size={16} />
                      )}
                      Set Default
                    </button>
                  )}
                  <button 
                    style={{ 
                      background: '#f8fafc', 
                      color: '#222', 
                      border: '1.5px solid #e5e7eb', 
                      borderRadius: 8, 
                      padding: '8px 12px', 
                      cursor: 'pointer' 
                    }} 
                    onClick={() => handleEditAddress(addr.id)}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    style={{ 
                      background: '#f8fafc', 
                      color: '#ef4444', 
                      border: '1.5px solid #e5e7eb', 
                      borderRadius: 8, 
                      padding: '8px 12px', 
                      cursor: 'pointer' 
                    }} 
                    onClick={() => setDeleteAddressId(addr.id)}
                    disabled={deleteLoading === addr.id}
                  >
                    {deleteLoading === addr.id ? (
                      <div style={{ width: '16px', height: '16px', border: '2px solid #ef4444', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
          </div>
        </div>
            );
          })
        )}
    </div>

      {/* Delete Confirmation Modal */}
      {deleteAddressId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Delete Address
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setDeleteAddressId(null)}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAddress(deleteAddressId)}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
);
};

export default UserSavedAddresses; 