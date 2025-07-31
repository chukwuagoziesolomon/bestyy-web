import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuItem, updateMenuItem } from '../api';
import { showError, showSuccess, showApiError } from '../toast';
import '../UserLogin.css'; // Reusing styles

type MenuItemData = {
  dish_name: string;
  price: string;
  category: string;
  otherCategory?: string;
  image?: File | string; // Can be a File for new uploads or string for existing URL
  available: boolean;
};

const EditMenuItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [menuItem, setMenuItem] = useState<MenuItemData>({
    dish_name: '',
    price: '',
    category: '',
    otherCategory: '',
    image: undefined,
    available: true,
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialImage, setInitialImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchMenuItem() {
      if (!id || !token) {
        showError('Missing item ID or authentication token.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getMenuItem(token, id);
        setMenuItem({
          dish_name: data.dish_name || '',
          price: (data.price || '').toString(),
          category: data.category || '',
          otherCategory: '', // Assuming this is not stored directly
          image: data.image,
          available: data.available,
        });
        setInitialImage(data.image); // Keep track of the original image URL
      } catch (err: any) {
        showError(err.message || 'Failed to fetch menu item details.');
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItem();
  }, [id, token]);

  const handleInputChange = (field: keyof MenuItemData, value: any) => {
    setMenuItem(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('image', file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token) {
      showError('Cannot update without item ID and token.');
      return;
    }
    setIsUpdating(true);
    try {
      // Define a type for the payload to ensure type safety
      type UpdatePayload = Partial<{
        dish_name: string;
        price: number;
        category: string;
        available: boolean;
        image?: File | string;
      }>;

      const payload: UpdatePayload = {
        dish_name: menuItem.dish_name,
        price: parseFloat(menuItem.price), // Convert price to number
        category: menuItem.category === 'Other' ? (menuItem.otherCategory || 'Other') : menuItem.category,
        available: menuItem.available,
      };
      
      // Only include the image if it's a new file upload
      if (menuItem.image instanceof File) {
        payload.image = menuItem.image;
      }

      await updateMenuItem(token, id, payload);
      showSuccess('Menu item updated successfully!');
      navigate('/dashboard/menu');
    } catch (err: any) {
      showApiError(err, 'Failed to update menu item.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div className="user-login__bg">
      <div className="user-login__card" style={{ maxWidth: 600, margin: '2rem auto' }}>
        <h2 className="user-login__heading">Edit Menu Item</h2>
        <h3 className="user-login__subheading">Update the details for your dish.</h3>
        
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
            <div className="form-group">
              <label className="floating-label">Dish Name</label>
              <input 
                className="user-login__input" 
                placeholder="pizza"
                value={menuItem.dish_name}
                onChange={(e) => handleInputChange('dish_name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="floating-label">Price</label>
              <input 
                className="user-login__input" 
                placeholder="₦ 4000"
                value={menuItem.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>
            <div className="form-group select-group">
              <label className="floating-label">Category</label>
              <select 
                className="user-login__input"
                value={menuItem.category}
                onChange={(e) => {
                  handleInputChange('category', e.target.value);
                  if (e.target.value !== 'Other') {
                    handleInputChange('otherCategory', '');
                  }
                }}
              >
                <option value="">Select a category...</option>
                <option value="Swallow & Soups">Swallow & Soups</option>
                <option value="Rice & Pasta Dishes">Rice & Pasta Dishes</option>
                <option value="Proteins (Meats & Fish)">Proteins (Meats & Fish)</option>
                <option value="Snacks & Small Chops">Snacks & Small Chops</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Desserts">Desserts</option>
                <option value="Drinks & Beverages">Drinks & Beverages</option>
                <option value="Other">Other</option>
              </select>
              <span className="dropdown-arrow">&#9662;</span>
            </div>

            {menuItem.category === 'Other' && (
              <div className="form-group">
                <label className="floating-label">Specify Category</label>
                <input
                  className="user-login__input"
                  placeholder="e.g., Grills"
                  value={menuItem.otherCategory || ''}
                  onChange={(e) => handleInputChange('otherCategory', e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="floating-label">Dish Image</label>
              {initialImage && !(menuItem.image instanceof File) && (
                <img src={initialImage} alt="Current dish" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
              )}
              <input
                type="file"
                id="item-image-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label htmlFor="item-image-upload" className="user-login__input" style={{ cursor: 'pointer', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}>
                {menuItem.image instanceof File ? menuItem.image.name : 'Change image...'}
              </label>
            </div>
            
            <div className="form-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.5rem 0'}}>
              <span style={{fontWeight: 500}}>Available Now?</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={menuItem.available}
                  onChange={(e) => handleInputChange('available', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="signup-btn-group--wide">
            <button className="signup-btn-back" type="button" onClick={() => navigate('/dashboard/menu')}>
              Cancel
            </button>
            <button className="signup-btn-next" type="submit" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemPage; 