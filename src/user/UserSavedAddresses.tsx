import React, { useEffect, useState } from 'react';
import { Home, Briefcase, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import { fetchUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress } from '../api';
import { showError, showSuccess } from '../toast';
import AddressModal from '../components/AddressModal';
import ConfirmModal from '../components/ConfirmModal';

const UserSavedAddresses = () => {
  const token = localStorage.getItem('token');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<any | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<number | null>(null);

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

  const handleAddAddress = async (addressData: {
    address_type: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    is_default: boolean;
  }) => {
    if (!token) return;
    try {
      await createUserAddress(token, addressData);
      showSuccess('Address added successfully!');
      setModalOpen(false);
      // Refresh addresses
      const data = await fetchUserAddresses(token);
      setAddresses(data || []);
    } catch (err: any) {
      showError(err.message || 'Failed to add address');
    }
  };

  const handleEditAddress = async (addressData: {
    address_type: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    is_default: boolean;
  }) => {
    if (!token || !editAddress) return;
    try {
      await updateUserAddress(token, editAddress.id, addressData);
      showSuccess('Address updated successfully!');
      setEditAddress(null);
      setModalOpen(false);
      // Refresh addresses
      const data = await fetchUserAddresses(token);
      setAddresses(data || []);
    } catch (err: any) {
      showError(err.message || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!token) return;
    try {
      await deleteUserAddress(token, id);
      showSuccess('Address deleted successfully!');
      // Refresh addresses
      const data = await fetchUserAddresses(token);
      setAddresses(data || []);
    } catch (err: any) {
      showError(err.message || 'Failed to delete address');
    }
    setDeleteAddressId(null);
  };

  return (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
    {/* Saved Address Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Saved Address</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>Quickly select saved delivery locations when placing food orders. Add or update them anytime.</div>
      </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 28px', cursor: 'pointer' }}>
        <Plus size={20} /> Add new Address
      </button>
    </div>
    {/* Saved Address Cards */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 40, minHeight: 120 }}>
        {loading ? (
          <div style={{ color: '#888', fontSize: 18 }}>Loading addresses...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', fontSize: 18 }}>{error}</div>
        ) : addresses.length === 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <MapPin size={64} color="#10b981" style={{ marginBottom: 18 }} />
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#222', textAlign: 'center' }}>No saved addresses yet</div>
            <div style={{ color: '#888', fontSize: 17, marginBottom: 24, textAlign: 'center' }}>Click on <b>Add new Address</b> to add your address.</div>
            <button onClick={() => setModalOpen(true)} style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 28px', cursor: 'pointer', marginTop: 8 }}>
              <Plus size={20} /> Add new Address
            </button>
          </div>
        ) : (
          addresses.map((addr: any, i: number) => {
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
                  {addr.street_address}, {addr.city}, {addr.state}, {addr.postal_code}
                </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
                  <button style={{ background: '#f8fafc', color: '#222', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }} onClick={() => { setEditAddress(addr); setModalOpen(true); }}><Edit size={18} /></button>
                  <button style={{ background: '#f8fafc', color: '#ef4444', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }} onClick={() => setDeleteAddressId(addr.id)}><Trash2 size={18} /></button>
          </div>
        </div>
            );
          })
        )}
    </div>
      <AddressModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditAddress(null); }}
        onSubmit={editAddress ? undefined : handleAddAddress}
        onUpdate={editAddress ? handleEditAddress : undefined}
        initialValues={editAddress}
      />
      <ConfirmModal
        isOpen={deleteAddressId !== null}
        title="Delete Address"
        message="Are you sure you want to delete this address?"
        onConfirm={() => deleteAddressId !== null && handleDeleteAddress(deleteAddressId)}
        onCancel={() => setDeleteAddressId(null)}
      />
    </div>
);
};

export default UserSavedAddresses; 