import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ChevronDown } from 'lucide-react';
import { createMenuItem } from '../api';
import { showError, showSuccess, showApiError } from '../toast';

const MobileAddMenu: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dish_name: '',
    item_description: '',
    category: '',
    optional_variation: '',
    price: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const token = localStorage.getItem('access_token');

  const categories = [
    'Rice Dish',
    'Soup',
    'Protein',
    'Snacks',
    'Drinks',
    'Dessert',
    'Breakfast',
    'Lunch',
    'Dinner'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      showError('Not authenticated');
      return;
    }

    if (!formData.dish_name.trim() || !formData.price.trim() || !formData.category) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createMenuItem(token, {
        dish_name: formData.dish_name,
        item_description: formData.item_description,
        price: formData.price,
        category: formData.category,
        quantity: 1, // Default quantity
        image: formData.image || undefined,
        available_now: true
      });
      
      showSuccess('Menu item added successfully!');
      navigate('/vendor/menu');
    } catch (err: any) {
      showApiError(err, 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div
          onClick={() => navigate('/vendor/menu')}
          style={{
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
        >
          <ArrowLeft size={24} color="#374151" />
        </div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: 0,
          color: '#1f2937'
        }}>
          Add New Menu
        </h1>
      </div>

      {/* Form Content */}
      <div style={{ padding: '16px 12px' }}>
        {/* Photo Upload Section */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '20px 16px',
          marginBottom: '16px',
          textAlign: 'center',
          border: '2px dashed #e5e7eb',
          position: 'relative'
        }}>
          {imagePreview ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  margin: '0 auto 16px'
                }}
              />
              <div style={{
                color: '#10b981',
                fontSize: '16px',
                fontWeight: 600
              }}>
                Photo Uploaded
              </div>
            </div>
          ) : (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Camera size={32} color="#10b981" />
              </div>
              <div style={{
                color: '#10b981',
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                Upload Photo
              </div>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              zIndex: 1
            }}
          />
        </div>

        {/* Item Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Item Name
          </label>
          <input
            type="text"
            value={formData.dish_name}
            onChange={(e) => setFormData(prev => ({ ...prev, dish_name: e.target.value }))}
            placeholder="Jollof rice"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Item Description */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Item Description
          </label>
          <textarea
            value={formData.item_description}
            onChange={(e) => setFormData(prev => ({ ...prev, item_description: e.target.value }))}
            placeholder="Smoky jollof rice with sausage, carrot and diced chunks"
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#fff',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Category
          </label>
          <div
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ color: formData.category ? '#374151' : '#9ca3af' }}>
              {formData.category || 'Rice Dish'}
            </span>
            <ChevronDown size={20} color="#6b7280" />
          </div>
          
          {showCategoryDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 10,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category }));
                    setShowCategoryDropdown(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: index < categories.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional Variation */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Optional Variation
          </label>
          <input
            type="text"
            value={formData.optional_variation}
            onChange={(e) => setFormData(prev => ({ ...prev, optional_variation: e.target.value }))}
            placeholder="Size, Portions"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Price */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Price
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="1500"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Add Item Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#9ca3af' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          {loading ? 'Adding Item...' : 'Add Item'}
        </button>
      </div>
    </div>
  );
};

export default MobileAddMenu;
