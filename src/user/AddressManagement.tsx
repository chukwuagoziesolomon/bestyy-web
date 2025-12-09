import React, { useState, useEffect } from 'react';
import { Plus, Home, Briefcase, MapPin, Edit2, Trash2, Check } from 'lucide-react';
import { getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress, UserAddress } from '../api';
import { showError, showSuccess } from '../toast';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { locationService, AddressSuggestion } from '../services/locationService';

interface AddressFormData {
  address_type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    address_type: 'home',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    is_default: false,
  });

  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses(token);
      setAddresses(data);
    } catch (error: any) {
      showError(error.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = async (suggestion: AddressSuggestion) => {
    try {
      const details = await locationService.getPlaceDetails(suggestion.place_id);
      if (details) {
        // Parse address components
        const addressComponents = details.address_components;
        const getComponent = (types: string[]) => {
          const component = addressComponents.find(comp =>
            types.some(type => comp.types.includes(type))
          );
          return component?.long_name || '';
        };

        setFormData({
          ...formData,
          address: details.formatted_address,
          city: getComponent(['locality', 'administrative_area_level_2']),
          state: getComponent(['administrative_area_level_1']),
          zip_code: getComponent(['postal_code']),
        });
      }
    } catch (error) {
      showError('Failed to fetch address details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city || !formData.state) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      if (editingAddress) {
        await updateUserAddress(token, editingAddress.id, formData);
        showSuccess('Address updated successfully');
      } else {
        await createUserAddress(token, formData);
        showSuccess('Address added successfully');
      }
      setShowAddModal(false);
      setEditingAddress(null);
      resetForm();
      loadAddresses();
    } catch (error: any) {
      showError(error.message || 'Failed to save address');
    }
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setFormData({
      address_type: address.address_type,
      address: address.address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      is_default: address.is_default,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (addressId: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await deleteUserAddress(token, addressId);
      showSuccess('Address deleted successfully');
      loadAddresses();
    } catch (error: any) {
      showError(error.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      await updateUserAddress(token, addressId, { is_default: true });
      showSuccess('Default address updated');
      loadAddresses();
    } catch (error: any) {
      showError(error.message || 'Failed to update default address');
    }
  };

  const resetForm = () => {
    setFormData({
      address_type: 'home',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      is_default: false,
    });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color="#10b981" />;
      case 'work':
        return <Briefcase size={20} color="#3b82f6" />;
      default:
        return <MapPin size={20} color="#6b7280" />;
    }
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      padding: '16px',
      maxWidth: '900px',
      margin: '0 auto',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            marginBottom: '8px'
          }}>
            My Addresses
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Manage your delivery addresses
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingAddress(null);
            setShowAddModal(true);
          }}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {/* Address List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Loading addresses...
        </div>
      ) : addresses.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <MapPin size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            No addresses yet
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
            Add your first delivery address to get started
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add Address
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {addresses.map(address => (
            <div
              key={address.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: address.is_default ? '2px solid #10b981' : '1px solid #e5e7eb',
                position: 'relative'
              }}
            >
              {address.is_default && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#10b981',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Check size={14} />
                  Default
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getAddressIcon(address.address_type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0,
                    marginBottom: '8px',
                    textTransform: 'capitalize'
                  }}>
                    {address.address_type}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {address.address}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    marginTop: '4px'
                  }}>
                    {address.city}, {address.state} {address.zip_code}
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  style={{
                    background: 'none',
                    border: '1px solid #3b82f6',
                    color: '#3b82f6',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {/* Address Type */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Address Type *
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['home', 'work', 'other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, address_type: type as any })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: formData.address_type === type ? '2px solid #10b981' : '1px solid #d1d5db',
                        background: formData.address_type === type ? '#f0fdf4' : 'white',
                        color: formData.address_type === type ? '#10b981' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {getAddressIcon(type)}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Search */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Search Address *
                </label>
                <AddressAutocomplete
                  value={formData.address}
                  onChange={(value) => setFormData({ ...formData, address: value })}
                  onSelect={handleAddressSelect}
                  placeholder="Start typing your address..."
                  className=""
                />
              </div>

              {/* City & State */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Lagos"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Lagos"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Zip Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  placeholder="100001"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Set as Default */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Set as default address
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAddress(null);
                    resetForm();
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
