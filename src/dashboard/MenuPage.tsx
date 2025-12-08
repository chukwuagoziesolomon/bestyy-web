import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { fetchVendorMenuItems, deleteMenuItem, API_URL } from '../api';
import { getMenuItemImageUrl, getFallbackImageUrl } from '../utils/imageUtils';
import { showError, showSuccess, showApiError } from '../toast';
import { useResponsive } from '../hooks/useResponsive';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';
import MobileMenu from './MobileMenu';

interface MenuItem {
  id: string;
  dish_name: string;
  price: string;
  category: string;
  image?: string;
  image_url?: string;
  image_urls?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    original?: string;
  };
  available: boolean;
  description?: string;
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetchVendorMenuItems(localStorage.getItem('access_token')!);
      
      // API returns the data directly, not wrapped in success/data structure
      setMenuItems(response.results || response.menu_items || response || []);
    } catch (error) {
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(id, localStorage.getItem('access_token')!);
        showSuccess('Menu item deleted successfully');
        setMenuItems(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        showApiError(error);
      }
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      // Add API call to toggle availability here
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, available: !currentStatus } : item
      ));
      showSuccess(`Item ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      showApiError(error);
    }
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} fill="#fbbf24" color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} fill="none" color="#d1d5db" />
      );
    }

    return stars;
  };

  // Mobile and Tablet views - use separate MobileMenu component
  if (isMobile || isTablet) {
    return <MobileMenu />;
  }

  // Desktop version
  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{ padding: '24px' }}>
        {/* Header Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => navigate('/vendor/menu/add')}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} />
            Add New Item
          </button>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Filter by category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                background: 'white'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '18px',
            color: '#666'
          }}>
            Loading menu items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>No menu items found</p>
            <button
              onClick={() => navigate('/vendor/menu/add')}
              style={{
                padding: '16px 32px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                {/* Item Image */}
                <div style={{
                  height: '200px',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {(() => {
                    const imageUrl = getMenuItemImageUrl(item);

                    return imageUrl ? (
                    <img
                        src={imageUrl}
                      alt={item.dish_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                        onError={(e) => {
                          console.log('Image failed to load:', imageUrl);
                          // Try fallback to original URL without transformations
                          const fallbackUrl = getFallbackImageUrl(imageUrl);
                          if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                            e.currentTarget.src = fallbackUrl;
                          } else {
                            // Fallback to no image if URL fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div style="color: #9ca3af; font-size: 16px;">No Image</div>';
                          }
                        }}
                    />
                  ) : (
                    <div style={{ color: '#9ca3af', fontSize: '16px' }}>No Image</div>
                    );
                  })()}
                </div>

                {/* Item Details */}
                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0,
                      flex: 1
                    }}>
                      {item.dish_name}
                    </h3>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: item.available ? '#dcfce7' : '#fee2e2',
                      color: item.available ? '#166534' : '#dc2626',
                      marginLeft: '12px'
                    }}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 8px 0'
                  }}>
                    {item.category}
                  </p>

                  <p style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 16px 0'
                  }}>
                    ₦{item.price}
                  </p>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={() => toggleAvailability(item.id, item.available)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: item.available ? '#fef3c7' : '#dcfce7',
                        color: item.available ? '#d97706' : '#166534',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {item.available ? <EyeOff size={16} /> : <Eye size={16} />}
                      {item.available ? 'Hide' : 'Show'}
                    </button>

                    <button
                      onClick={() => navigate(`/vendor/menu/edit/${item.id}`)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#fee2e2',
                        color: '#dc2626',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
    </div>
  );
};

export default MenuPage; 