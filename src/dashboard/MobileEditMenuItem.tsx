import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';

type MenuItemData = {
  dish_name: string;
  price: string;
  category: string;
  otherCategory?: string;
  image?: File | string;
  available: boolean;
};

interface MobileEditMenuItemProps {
  formData: MenuItemData;
  setFormData: React.Dispatch<React.SetStateAction<MenuItemData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleDelete: () => void;
  loading: boolean;
  initialImage?: string;
}

const MobileEditMenuItem: React.FC<MobileEditMenuItemProps> = ({
  formData,
  setFormData,
  handleInputChange,
  handleImageChange,
  handleSave,
  handleDelete,
  loading,
  initialImage
}) => {
  const navigate = useNavigate();

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader />
      
      <div style={{ padding: '16px' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Image Upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Item Image
            </label>
            <div style={{
              width: '100%',
              height: '200px',
              borderRadius: '8px',
              border: '2px dashed #d1d5db',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f9fafb',
              cursor: 'pointer',
              position: 'relative'
            }}>
              {formData.image ? (
                <img
                  src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
                  alt="Menu item"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                />
              ) : initialImage ? (
                <img
                  src={initialImage}
                  alt="Current menu item"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                />
              ) : (
                <>
                  <Camera size={32} color="#9ca3af" />
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '8px 0 0 0'
                  }}>
                    Tap to upload image
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Dish Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Dish Name *
              </label>
              <input
                type="text"
                name="dish_name"
                value={formData.dish_name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#fff',
                  outline: 'none'
                }}
                placeholder="Enter dish name"
              />
            </div>

            {/* Category */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#fff',
                  outline: 'none'
                }}
              >
                <option value="">Select category</option>
                <option value="appetizers">Appetizers</option>
                <option value="main-course">Main Course</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
                <option value="sides">Sides</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Other Category */}
            {formData.category === 'other' && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Specify Category
                </label>
                <input
                  type="text"
                  name="otherCategory"
                  value={formData.otherCategory || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: '#fff',
                    outline: 'none'
                  }}
                  placeholder="Enter custom category"
                />
              </div>
            )}

            {/* Price */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Price *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#fff',
                  outline: 'none'
                }}
                placeholder="Enter price (e.g., 1500)"
              />
            </div>

            {/* Availability */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#10b981'
                }}
              />
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                margin: 0
              }}>
                Available for order
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px'
          }}>
            <button
              onClick={handleDelete}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                background: loading ? '#9ca3af' : '#10b981',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <VendorBottomNavigation currentPath="/vendor/menu" />
    </div>
  );
};

export default MobileEditMenuItem;
