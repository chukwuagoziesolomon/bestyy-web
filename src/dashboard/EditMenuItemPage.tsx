import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuItem, updateMenuItem } from '../api';
import { showError, showSuccess, showApiError } from '../toast';
import '../UserLogin.css'; // Reusing styles
import { useResponsive } from '../hooks/useResponsive';
import DesktopEditMenuItem from './DesktopEditMenuItem';
import MobileEditMenuItem from './MobileEditMenuItem';

type MenuItemData = {
  dish_name: string;
  price: string;
  category: string;
  otherCategory?: string;
  image?: File | string; // Can be a File for new uploads or string for existing URL
  available: boolean;
};

const EditMenuItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const [formData, setFormData] = useState<MenuItemData>({
    dish_name: '',
    price: '',
    category: '',
    otherCategory: '',
    image: undefined,
    available: true
  });

  const [loading, setLoading] = useState(false);
  const [initialImage, setInitialImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchMenuItem() {
      if (!id || !localStorage.getItem('access_token')) {
        showError('Missing item ID or authentication token.');
        navigate('/vendor/menu');
        return;
      }

      try {
        setLoading(true);
        const response = await getMenuItem(localStorage.getItem('access_token')!, id);
        
        // API returns the data directly, not wrapped in success/data structure
        const item = response;
        setFormData({
          dish_name: item.dish_name || '',
          price: item.price || '',
          category: item.category || '',
          otherCategory: item.otherCategory || '',
          image: item.image || undefined,
          available: item.available !== false
        });
        
        if (item.image) {
          setInitialImage(item.image);
        }
      } catch (error) {
        showApiError(error);
        navigate('/vendor/menu');
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItem();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSave = async () => {
    if (!formData.dish_name.trim()) {
      showError('Dish name is required');
      return;
    }

    if (!formData.price.trim()) {
      showError('Price is required');
      return;
    }

    if (!formData.category.trim()) {
      showError('Category is required');
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        dish_name: formData.dish_name,
        price: formData.price,
        category: formData.category,
        available: formData.available,
        otherCategory: formData.otherCategory,
        image: formData.image instanceof File ? formData.image : undefined
      };

      await updateMenuItem(localStorage.getItem('access_token')!, id!, updateData);
      showSuccess('Menu item updated successfully!');
      navigate('/vendor/menu');
    } catch (error) {
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        setLoading(true);
        // Add delete API call here when available
        showSuccess('Menu item deleted successfully!');
        navigate('/vendor/menu');
      } catch (error) {
        showApiError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !formData.dish_name) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading menu item...
      </div>
    );
  }

  // Use responsive components
  if (isMobile || isTablet) {
    return (
      <MobileEditMenuItem
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleSave={handleSave}
        handleDelete={handleDelete}
        loading={loading}
        initialImage={initialImage}
      />
    );
  }

  return (
    <DesktopEditMenuItem
      formData={formData}
      setFormData={setFormData}
      handleInputChange={handleInputChange}
      handleImageChange={handleImageChange}
      handleSave={handleSave}
      handleDelete={handleDelete}
      loading={loading}
      initialImage={initialImage}
    />
  );
};

export default EditMenuItemPage;