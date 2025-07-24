import React, { useState, useEffect } from 'react';

interface AddressFields {
  address_type: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (address: AddressFields) => void;
  onUpdate?: (address: AddressFields) => void;
  initialValues?: AddressFields | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSubmit, onUpdate, initialValues }) => {
  const [addressType, setAddressType] = useState('home');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setAddressType(initialValues.address_type || 'home');
      setStreetAddress(initialValues.street_address || '');
      setCity(initialValues.city || '');
      setState(initialValues.state || '');
      setPostalCode(initialValues.postal_code || '');
      setIsDefault(!!initialValues.is_default);
    } else {
      setAddressType('home');
      setStreetAddress('');
      setCity('');
      setState('');
      setPostalCode('');
      setIsDefault(false);
    }
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setError('All fields are required');
      return;
    }
    setError('');
    const payload: AddressFields = {
      address_type: addressType,
      street_address: streetAddress,
      city,
      state,
      postal_code: postalCode,
      is_default: isDefault,
    };
    if (initialValues && onUpdate) {
      onUpdate(payload);
    } else if (onSubmit) {
      onSubmit(payload);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 700, boxShadow: '0 2px 24px #d1fae5', fontFamily: 'Nunito Sans, sans-serif', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: '#111' }}>{initialValues ? 'Edit Address' : 'Add New Address'}</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 24 }}>Add new Address and save for later</div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Address</label>
              <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder="11, add street ave" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Address Type</label>
              <select value={addressType} onChange={e => setAddressType(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>State</label>
              <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="Lagos" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Alimosho" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>ZIP Code</label>
              <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Enter ZIP Code" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} />
            </div>
          </div>
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} id="isDefault" />
            <label htmlFor="isDefault" style={{ fontWeight: 600, fontSize: 15 }}>Save Address as Default</label>
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            <button type="button" onClick={onClose} style={{ background: '#fff', color: '#222', fontWeight: 700, fontSize: 17, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '12px 32px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 32px', cursor: 'pointer' }}>{initialValues ? 'Update Card' : 'Add Card'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal; 