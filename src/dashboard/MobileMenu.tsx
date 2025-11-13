import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, Menu, Heart, Star, Plus, X, BarChart3, CreditCard, HelpCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchVendorMenuItems, deleteMenuItem, API_URL } from '../api';
import { getMenuItemImageUrl, getFallbackImageUrl } from '../utils/imageUtils';
import { showError, showSuccess } from '../toast';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';

interface MenuItem {
  id: number;
  dish_name: string;
  price: string;
  image?: string;
  image_url?: string;
  image_urls?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    original?: string;
  };
  rating?: number;
  reviews?: number;
  description?: string;
}

const MobileMenu: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    async function loadMenuItems() {
      setLoading(true);
      try {
        if (token) {
          const data = await fetchVendorMenuItems(token);
          setMenuItems(data.results || data.menu_items || data || []);
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch menu items');
      } finally {
        setLoading(false);
      }
    }
    loadMenuItems();
  }, [token]);

  // Delete menu item function
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    if (!token) return showError('Not authenticated');

    setDeletingId(id);
    try {
      await deleteMenuItem(token, String(id));
      showSuccess('Menu item deleted successfully');
      setMenuItems(items => items.filter(item => item.id !== id));
    } catch (err: any) {
      showError(err.message || 'Failed to delete menu item');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? '#fbbf24' : 'none'}
          color={i <= rating ? '#fbbf24' : '#d1d5db'}
        />
      );
    }
    return stars;
  };

  const getCorrectImageUrl = (item?: MenuItem) => {
    if (!item) return null;
    return getMenuItemImageUrl(item);
  };

  const nextItem = () => {
    setCurrentItemIndex((prev) => (prev + 1) % menuItems.length);
  };

  const prevItem = () => {
    setCurrentItemIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader />


      {/* Main Content */}
      <div style={{ padding: '0 16px 24px' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            Loading menu items...
          </div>
        ) : menuItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#888',
            fontWeight: 600,
            margin: '4rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh'
          }}>
            <Utensils size={80} color="#e5e7eb" style={{ marginBottom: 16 }} />
            <div style={{
              fontSize: 18,
              color: '#888',
              fontWeight: 600,
              maxWidth: 300,
              lineHeight: 1.5,
              marginBottom: 16
            }}>
              No menu items found. Add your first menu item to get started!
            </div>
            <button
              onClick={() => navigate('/vendor/menu/add')}
              style={{
                background: '#10b981',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} />
              Add Your First Item
            </button>
          </div>
        ) : (
          <>
            {/* Large Menu Item Card */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              marginBottom: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Food Image with Carousel Navigation */}
              <div style={{
                width: '100%',
                height: '240px',
                background: getCorrectImageUrl(menuItems[currentItemIndex]) ?
                  `url(${getCorrectImageUrl(menuItems[currentItemIndex])})` :
                  'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                {/* Hidden img element for error handling */}
                {getCorrectImageUrl(menuItems[currentItemIndex]) && (
                  <img
                    src={getCorrectImageUrl(menuItems[currentItemIndex])}
                    alt=""
                    style={{ display: 'none' }}
                    onError={(e) => {
                      console.log('Mobile menu image failed to load:', getCorrectImageUrl(menuItems[currentItemIndex]));
                      const fallbackUrl = getFallbackImageUrl(getCorrectImageUrl(menuItems[currentItemIndex]) || '');
                      if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                        // Update the background image of the parent div
                        const parentDiv = e.currentTarget.parentElement;
                        if (parentDiv) {
                          parentDiv.style.background = `url(${fallbackUrl})`;
                          parentDiv.style.backgroundSize = 'cover';
                          parentDiv.style.backgroundPosition = 'center';
                        }
                      }
                    }}
                  />
                )}
                {/* Carousel Navigation Arrows */}
                {menuItems.length > 1 && (
                  <>
                    <button
                      onClick={prevItem}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      <ChevronLeft size={18} color="#374151" />
                    </button>
                    <button
                      onClick={nextItem}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      <ChevronRight size={18} color="#374151" />
                    </button>
                  </>
                )}

                {/* Heart Icon */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Heart size={20} color="#6b7280" />
                </div>

                {/* If no image, show a jollof rice pattern */}
                {!getCorrectImageUrl(menuItems[currentItemIndex]) && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
                      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 2px, transparent 2px),
                      radial-gradient(circle at 60% 70%, rgba(255,255,255,0.1) 1px, transparent 1px),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1.5px, transparent 1.5px),
                      radial-gradient(circle at 30% 80%, rgba(255,255,255,0.1) 2px, transparent 2px),
                      radial-gradient(circle at 70% 40%, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px, 30px 30px, 50px 50px, 35px 35px, 25px 25px'
                  }} />
                )}
              </div>

              {/* Item Details */}
              <div style={{ padding: '20px' }}>
                {/* Item Name */}
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  margin: '0 0 8px 0',
                  color: '#1f2937'
                }}>
                  {menuItems[currentItemIndex]?.dish_name}
                </h3>

                {/* Price */}
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#10b981',
                  marginBottom: '12px'
                }}>
                  ₦ {parseFloat(menuItems[currentItemIndex]?.price || '0').toLocaleString()}
                </div>

                {/* Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {renderStars(menuItems[currentItemIndex]?.rating || 0)}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    ({menuItems[currentItemIndex]?.reviews || 0})
                  </span>
                </div>

                {/* Edit Item Button */}
                <button
                  onClick={() => navigate(`/vendor/menu/edit/${menuItems[currentItemIndex]?.id}`)}
                  style={{
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                >
                  Edit Item
                </button>
              </div>
            </div>

            {/* Add New Menu Button */}
            <button
              onClick={() => navigate('/vendor/menu/add')}
              style={{
                background: '#10b981',
                color: '#fff',
                fontWeight: 600,
                fontSize: '16px',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
              }}
            >
              <Plus size={20} />
              Add new Menu
            </button>
          </>
        )}
      </div>



      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/menu" />
    </div>
  );
};

export default MobileMenu;
