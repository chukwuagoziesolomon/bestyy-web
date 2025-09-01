import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, Menu, Heart, Star, Plus, X, BarChart3, CreditCard, HelpCircle, Settings } from 'lucide-react';
import { listMenuItems, deleteMenuItem, API_URL } from '../api';
import { showError, showSuccess } from '../toast';

interface MenuItem {
  id: number;
  dish_name: string;
  price: string;
  image?: string;
  rating?: number;
  reviews?: number;
  description?: string;
}

const MobileMenu: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadMenuItems() {
      setLoading(true);
      try {
        if (token) {
          const data = await listMenuItems(token);
          setMenuItems(data.menu_items || data || []);
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

  const getCorrectImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      return null; // No image, will show gradient background
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `${API_URL}${imagePath}`;
    }
    return null;
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          color: '#1f2937'
        }}>
          Menu
        </h1>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
        >
          <Menu size={24} color="#6b7280" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDropdown(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 40
            }}
          />

          {/* Dropdown Content */}
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 50,
            minWidth: '200px',
            overflow: 'hidden'
          }}>
            {/* Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '12px 16px 8px 16px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div
                onClick={() => setShowDropdown(false)}
                style={{
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <X size={20} color="#6b7280" />
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '8px 0' }}>
              {[
                { icon: <BarChart3 size={20} />, label: 'Analytics', onClick: () => navigate('/vendor/dashboard/analytics') },
                { icon: <CreditCard size={20} />, label: 'Payout', onClick: () => navigate('/vendor/dashboard/payout') },
                { icon: <Settings size={20} />, label: 'Profile Settings', onClick: () => navigate('/vendor/dashboard/profile') }
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setShowDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ color: '#6b7280' }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 500
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Menu Item Button - Only show when there are menu items */}
      {!loading && menuItems.length > 0 && (
        <div style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => navigate('/vendor/dashboard/menu/add')}
            style={{
              background: 'linear-gradient(90deg, #10b981 0%, #34e7e4 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>
      )}

      {/* Menu Items */}
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
              onClick={() => navigate('/vendor/dashboard/menu/add')}
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
          menuItems.map((item, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Food Image */}
              <div style={{
                width: '100%',
                height: '200px',
                background: getCorrectImageUrl(item.image) ? `url(${getCorrectImageUrl(item.image)})` : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                {/* If no image, show a jollof rice pattern */}
                {!getCorrectImageUrl(item.image) && (
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
                  cursor: 'pointer'
                }}>
                  <Heart size={20} color="#6b7280" />
                </div>
              </div>

              {/* Item Details */}
              <div style={{ padding: '20px' }}>
                {/* Item Name and Price */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    margin: 0,
                    color: '#1f2937'
                  }}>
                    {item.dish_name}
                  </h3>
                </div>

                {/* Price */}
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#10b981',
                  marginBottom: '12px'
                }}>
                  ₦ {parseFloat(item.price || '0').toLocaleString()}
                </div>

                {/* Rating - Only show if rating exists */}
                {(item.rating || item.reviews) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {renderStars(item.rating || 0)}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      ({item.reviews || 0})
                    </span>
                  </div>
                )}

                {/* Description - Show if available */}
                {item.description && (
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: 1.5,
                    marginBottom: '16px'
                  }}>
                    {item.description}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  <button
                    onClick={() => navigate(`/vendor/dashboard/menu/edit/${item.id}`)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Edit Item
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    style={{
                      background: deletingId === item.id ? '#9ca3af' : '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                      flex: 1
                    }}
                  >
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>



      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 50
      }}>
        {[
          { 
            icon: <Home size={20} />, 
            label: 'Overview', 
            active: false,
            onClick: () => navigate('/vendor/dashboard')
          },
          {
            icon: <List size={20} />,
            label: 'Order List',
            active: false,
            onClick: () => navigate('/vendor/dashboard/orders')
          },
          {
            icon: <Utensils size={20} />,
            label: 'Menu',
            active: true,
            onClick: () => {}
          },
          {
            icon: <Table size={20} />,
            label: 'Item Stock',
            active: false,
            onClick: () => navigate('/vendor/dashboard/stock')
          }
        ].map((item, index) => (
          <div 
            key={index} 
            onClick={item.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: item.active ? '#10b981' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
