import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { createMenuItem } from '../api';
import MobileAddMenu from './MobileAddMenu';
import VariantGroupManager, { VariantGroup } from '../components/VariantGroupManager';

const AddMenuItemPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  
  const [formData, setFormData] = useState({
    dish_name: 'Jollof rice',
    item_description: 'Smoky jollof rice with sausage, carrot and diced chunks',
    category: 'Rice Dish',
    price: '1500',
    available_now: true,
    quantity: 50,
    variants: [] as VariantGroup[]
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileAddMenu />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token - using the same pattern as other working components
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }


      // Transform variant groups to flat variant/options array for API
      // Map group names to allowed type values
      const allowedTypes = ['size', 'extra', 'addon', 'substitute'] as const;
      const mapGroupNameToType = (name: string): 'size' | 'extra' | 'addon' | 'substitute' => {
        const lower = name.trim().toLowerCase();
        if (allowedTypes.includes(lower as any)) return lower as any;
        // fallback: if group name contains a type keyword, use it
        for (const t of allowedTypes) {
          if (lower.includes(t)) return t;
        }
        return 'extra'; // default fallback
      };
      const flatVariants = formData.variants.flatMap(group =>
        group.options.map(option => ({
          name: option.name,
          type: mapGroupNameToType(group.name),
          price_modifier: option.price_modifier,
          is_required: group.required,
          is_available: option.is_available,
          sort_order: option.sort_order
        }))
      );

      const menuData = {
        dish_name: formData.dish_name,
        item_description: formData.item_description,
        price: formData.price,
        category: formData.category,
        image: selectedImage || undefined,
        available_now: formData.available_now,
        quantity: formData.quantity,
        variants: flatVariants
      };

      // Call API
      const response = await createMenuItem(token, menuData);
      console.log('Menu item created successfully:', response);
      
      // Navigate back to menu page
      navigate('/vendor/menu');
    } catch (err) {
      console.error('Error creating menu item:', err);
      setError(err instanceof Error ? err.message : 'Failed to create menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '32px'
    }}>
      {/* Page Header */}
      <div style={{
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 8px 0',
            letterSpacing: '-0.025em'
          }}>
            Add New Menu Item
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Create a new menu item for your restaurant
          </p>
        </div>
        <button
          onClick={() => navigate('/vendor/menu')}
          style={{
            padding: '10px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            background: '#fff',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.color = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.color = '#374151';
          }}
        >
          ← Back to Menu
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Left Column - Image Upload */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #f3f4f6',
          padding: '32px',
          height: 'fit-content'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 24px 0'
          }}>
            Item Photo
          </h2>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: imagePreview ? '#fff' : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            border: imagePreview ? '1px solid #e5e7eb' : '2px dashed #d1d5db',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: imagePreview ? '0 4px 6px rgba(0,0,0,0.05)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!imagePreview) {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (!imagePreview) {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)';
            }
          }}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Change Photo
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Camera size={32} color="#fff" />
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Upload Item Photo
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center',
                  maxWidth: '200px'
                }}>
                  Click to browse or drag and drop your image here
                </div>
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

        {/* Right Column - Form Fields */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #f3f4f6',
          padding: '32px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 24px 0'
          }}>
            Item Details
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Item Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Item Name *
              </label>
              <input
                type="text"
                name="dish_name"
                value={formData.dish_name}
                onChange={handleInputChange}
                placeholder="Enter item name"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: '#fff',
                  outline: 'none',
                  color: '#374151',
                  transition: 'border-color 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }}
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
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: '#fff',
                  outline: 'none',
                  color: '#374151',
                  transition: 'border-color 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }}
              >
                <option value="Rice Dish">Rice Dish</option>
                <option value="Soup">Soup</option>
                <option value="Meat">Meat</option>
                <option value="Fish">Fish</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
              </select>
            </div>

            {/* Item Description */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Description *
              </label>
              <textarea
                name="item_description"
                value={formData.item_description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your menu item..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: '#fff',
                  outline: 'none',
                  color: '#374151',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }}
              />
            </div>

            {/* Price and Variation Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              {/* Price */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: '#fff',
                    outline: 'none',
                    color: '#374151',
                    transition: 'border-color 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  }}
                />
              </div>

              {/* Quantity */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="50"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: '#fff',
                    outline: 'none',
                    color: '#374151',
                    transition: 'border-color 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  }}
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <input
                type="checkbox"
                name="available_now"
                checked={formData.available_now}
                onChange={handleInputChange}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#10b981'
                }}
              />
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer'
              }}>
                Available Now
              </label>
            </div>

            {/* Variant Group Manager */}
            <div style={{ marginTop: '24px' }}>
              <VariantGroupManager
                groups={formData.variants}
                onChange={(variants) => setFormData(prev => ({ ...prev, variants }))}
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{
                color: '#dc2626',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f3f4f6'
          }}>
            <button
              onClick={() => navigate('/vendor/menu')}
              style={{
                flex: 1,
                padding: '14px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                background: '#fff',
                color: '#374151',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#9ca3af';
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = '#fff';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                flex: 2,
                padding: '14px 24px',
                border: 'none',
                borderRadius: '12px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 6px rgba(16, 185, 129, 0.2)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  e.currentTarget.style.boxShadow = '0 6px 8px rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? 'Creating...' : 'Save Menu Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemPage;