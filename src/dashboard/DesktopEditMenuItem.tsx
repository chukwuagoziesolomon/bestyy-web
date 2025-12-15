import React from 'react';
import VariantGroupManager from '../components/VariantGroupManager';
import { useResponsive } from '../hooks/useResponsive';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';

interface DesktopEditMenuItemProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleDelete: () => void;
  loading: boolean;
  initialImage?: string;
}

const DesktopEditMenuItem: React.FC<DesktopEditMenuItemProps> = ({
  formData,
  setFormData,
  handleInputChange,
  handleImageChange,
  handleSave,
  handleDelete,
  loading,
  initialImage
}) => {
  const { isMobile } = useResponsive();

  const containerStyle: React.CSSProperties = isMobile
    ? { display: 'flex', flexDirection: 'column', gap: 16, padding: 12 }
    : { display: 'flex', gap: 40 };

  const leftStyle: React.CSSProperties = isMobile ? { width: '100%' } : { flex: 1 };
  const rightStyle: React.CSSProperties = isMobile
    ? { width: '100%' }
    : { flex: 2, display: 'flex', flexDirection: 'column', gap: 20 };

  return (
    <div
      style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: isMobile ? '#f8fafc' : 'transparent',
        minHeight: isMobile ? '100vh' : undefined,
      }}
    >
      {isMobile && <VendorHeader />}
      <div style={containerStyle}>
        <div style={leftStyle}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Dish Image
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', cursor: 'pointer', position: 'relative' }}>
            {formData.image ? (
              <img
                src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
                alt="Menu item"
                style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 8 }}
              />
            ) : initialImage ? (
              <img
                src={initialImage}
                alt="Current menu item"
                style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 8 }}
              />
            ) : (
              <span style={{ color: '#9ca3af' }}>No image selected</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </div>
        </div>
        <div style={rightStyle}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Dish Name *
            </label>
            <input
              type="text"
              name="dish_name"
              value={formData.dish_name}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, background: '#fff', outline: 'none' }}
              placeholder="Enter dish name"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Item Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, background: '#fff', outline: 'none', marginTop: 6, minHeight: 120, resize: 'vertical' }}
              placeholder="Describe the dish, ingredients, portion size, or any notes for customers"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Price
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, background: '#fff', outline: 'none' }}
                placeholder="Enter price"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, background: '#fff', outline: 'none' }}
                placeholder="Category"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity ?? 0}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, background: '#fff', outline: 'none' }}
                placeholder="Quantity"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Video URL
              </label>
              <input
                type="text"
                name="video"
                value={formData.video || ''}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, background: '#fff', outline: 'none' }}
                placeholder="Video URL (optional)"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280' }}>Created</label>
                <div style={{ fontSize: 13, color: '#374151' }}>{formData.created_at ? new Date(formData.created_at).toLocaleString() : '—'}</div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280' }}>Last Updated</label>
                <div style={{ fontSize: 13, color: '#374151' }}>{formData.updated_at ? new Date(formData.updated_at).toLocaleString() : '—'}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 32, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={handleDelete}
              style={{ padding: '12px 24px', border: 'none', borderRadius: 8, background: '#ef4444', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{ padding: '12px 24px', border: 'none', borderRadius: 8, background: loading ? '#9ca3af' : '#10b981', color: '#fff', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
      {isMobile && <VendorBottomNavigation currentPath="/vendor/menu" />}
    </div>
  );
};

export default DesktopEditMenuItem;
