import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { getMenuItem, updateMenuItem, deleteMenuItem, API_URL } from '../api';
import { showError, showSuccess, showApiError } from '../toast';
import { useImageUpload } from '../hooks/useImageUpload';

const MobileEditMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Image upload hook for menu item images
  const { uploadImage: uploadMenuImage, isUploading: isUploadingImage, error: imageUploadError, clearError: clearImageError } = useImageUpload({
    onSuccess: (file) => {
      if (file instanceof File) {
        const objectUrl = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          existing_image: '',
          image: file
        }));
        setImagePreview(objectUrl);
      }
      showSuccess('Menu item image uploaded successfully!');
    },
    onError: (error) => {
      showError(error);
    }
  });
  const [formData, setFormData] = useState({
    dish_name: '',
    item_description: '',
    category: '',
    optional_variation: '',
    price: '',
    image: null as File | null,
    existing_image: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  useEffect(() => {
    async function loadMenuItem() {
      if (!token || !id) return;
      
      setLoading(true);
      try {
        const data = await getMenuItem(token, id);
        setFormData({
          dish_name: data.dish_name || '',
          item_description: data.item_description || '',
          category: data.category || '',
          optional_variation: data.optional_variation || '',
          price: data.price || '',
          image: null,
          existing_image: data.image || ''
        });
        
        // Set image preview if existing image
        if (data.image) {
          const imageUrl = data.image.startsWith('http') ? data.image : `${API_URL}${data.image}`;
          setImagePreview(imageUrl);
        }
      } catch (err: any) {
        showError(err.message || 'Failed to load menu item');
        navigate('/vendor/menu');
      } finally {
        setLoading(false);
      }
    }
    
    loadMenuItem();
  }, [token, id, navigate]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Upload to Cloudinary instead of just showing preview
      uploadMenuImage(file, 'menu-item');
    }
  };

  const handleSave = async () => {
    if (!token || !id) {
      showError('Not authenticated');
      return;
    }

    if (!formData.dish_name.trim() || !formData.price.trim() || !formData.category) {
      showError('Please fill in all required fields');
      return;
    }

    setUpdating(true);
    try {
      const updateData: any = {
        dish_name: formData.dish_name,
        price: parseFloat(formData.price),
        category: formData.category,
        available: true
      };

      // Include the Cloudinary image URL if it exists
      if (formData.existing_image) {
        updateData.image = formData.existing_image;
      }

      await updateMenuItem(token, id, updateData);
      showSuccess('Menu item updated successfully!');
      navigate('/vendor/menu');
    } catch (err: any) {
      showApiError(err, 'Failed to update menu item');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    if (!token || !id) return;

    setDeleting(true);
    try {
      await deleteMenuItem(token, id);
      showSuccess('Menu item deleted successfully');
      navigate('/vendor/menu');
    } catch (err: any) {
      showError(err.message || 'Failed to delete menu item');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</div>
      </div>
    );
  }

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
          Edit Menu
        </h1>
      </div>

      {/* Form Content */}
      <div style={{ padding: '16px 12px' }}>
        {/* Photo Section */}
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '0',
          marginBottom: '16px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            height: '160px',
            background: imagePreview ? `url(${imagePreview})` : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploadingImage}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: isUploadingImage ? 'not-allowed' : 'pointer',
                zIndex: 1
              }}
            />
            {isUploadingImage && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                textShadow: '0 0 4px rgba(0,0,0,0.5)',
                zIndex: 2
              }}>
                Uploading...
              </div>
            )}
          </div>
        </div>

        {/* Item Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#6b7280',
            marginBottom: '6px'
          }}>
            Item Name
          </label>
          <input
            type="text"
            value={formData.dish_name}
            onChange={(e) => setFormData(prev => ({ ...prev, dish_name: e.target.value }))}
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
            color: '#6b7280',
            marginBottom: '6px'
          }}>
            Item Description
          </label>
          <textarea
            value={formData.item_description}
            onChange={(e) => setFormData(prev => ({ ...prev, item_description: e.target.value }))}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              resize: 'vertical',
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
            color: '#6b7280',
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
              {formData.category || 'Select category'}
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
              {categories.map((category) => (
                <div
                  key={category}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category }));
                    setShowCategoryDropdown(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
            color: '#6b7280',
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
            color: '#6b7280',
            marginBottom: '6px'
          }}>
            Price
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
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

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '24px'
        }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              flex: 1,
              padding: '14px',
              background: deleting ? '#9ca3af' : '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: deleting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={handleSave}
            disabled={updating}
            style={{
              flex: 1,
              padding: '14px',
              background: updating ? '#9ca3af' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: updating ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileEditMenu;
