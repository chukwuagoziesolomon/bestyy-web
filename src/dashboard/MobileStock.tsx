import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, Menu, X, BarChart3, CreditCard, HelpCircle, Settings } from 'lucide-react';
import { listMenuItems, updateMenuItem, API_URL } from '../api';
import { showError, showSuccess } from '../toast';

interface MenuItem {
  id: number;
  dish_name: string;
  price: string;
  image?: string;
  available?: boolean;
  item_description?: string;
}

const MobileStock: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // Sample menu items if no real data
  const sampleMenuItems = Array(9).fill(null).map((_, index) => ({
    id: index + 1,
    dish_name: 'Jollof rice',
    price: '1500',
    image: index === 0 ? 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop&crop=center' : undefined, // Add random jollof rice image to first item
    available: true,
    item_description: 'jollof rice with ch...'
  }));

  const displayItems = menuItems.length > 0 ? menuItems : sampleMenuItems;

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

  const handleToggleAvailability = async (item: MenuItem) => {
    if (!token) {
      showError('Not authenticated');
      return;
    }

    setUpdatingId(item.id);
    try {
      const newAvailability = !item.available;
      await updateMenuItem(token, item.id.toString(), {
        available: newAvailability
      });
      
      setMenuItems(items => 
        items.map(i => 
          i.id === item.id ? { ...i, available: newAvailability } : i
        )
      );
      
      showSuccess(`${item.dish_name} ${newAvailability ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      showError(err.message || 'Failed to update item availability');
    } finally {
      setUpdatingId(null);
    }
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
          Menu Availability
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

      {/* Menu Items List */}
      <div style={{ background: '#fff' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            Loading menu items...
          </div>
        ) : (
          displayItems.map((item, index) => (
            <div key={index}>
              {/* Menu Item Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 20px',
                gap: '20px'
              }}>
                {/* Food Image */}
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: getCorrectImageUrl(item.image) ? `url(${getCorrectImageUrl(item.image)})` : 'linear-gradient(135deg, #fed7aa 0%, #f97316 50%, #ea580c 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  flexShrink: 0,
                  overflow: 'hidden',
                  marginRight: '4px'
                }}>
                  {/* If no image, show a detailed jollof rice pattern */}
                  {!getCorrectImageUrl(item.image) && (
                    <div style={{
                      position: 'absolute',
                      inset: 0
                    }}>
                      {/* Rice grains pattern */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)'
                      }} />
                      {/* Scattered rice grains effect */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        width: '5px',
                        height: '5px',
                        background: '#fef3c7',
                        borderRadius: '50%'
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        width: '5px',
                        height: '5px',
                        background: '#fef3c7',
                        borderRadius: '50%'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '15px',
                        width: '5px',
                        height: '5px',
                        background: '#fef3c7',
                        borderRadius: '50%'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '15px',
                        right: '10px',
                        width: '5px',
                        height: '5px',
                        background: '#fef3c7',
                        borderRadius: '50%'
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '5px',
                        height: '5px',
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '50%'
                      }} />
                      {/* Chicken pieces representation */}
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '14px',
                        height: '10px',
                        background: '#d97706',
                        borderRadius: '3px',
                        opacity: 0.8
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        width: '10px',
                        height: '10px',
                        background: '#b45309',
                        borderRadius: '3px',
                        opacity: 0.7
                      }} />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    margin: '0 0 4px 0',
                    color: '#1f2937'
                  }}>
                    {item.dish_name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.item_description || 'jollof rice with ch...'}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div
                  onClick={() => handleToggleAvailability(item)}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: item.available ? '#10b981' : '#d1d5db',
                    position: 'relative',
                    cursor: updatingId === item.id ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease',
                    opacity: updatingId === item.id ? 0.6 : 1,
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: '2px',
                    left: item.available ? '26px' : '2px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>

              {/* Divider (except for last item) */}
              {index < displayItems.length - 1 && (
                <div style={{
                  borderBottom: '1px solid #f3f4f6',
                  marginLeft: '114px' // Offset by image width + gaps (70px + 20px + 24px)
                }} />
              )}
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
            active: false,
            onClick: () => navigate('/vendor/dashboard/menu')
          },
          {
            icon: <Table size={20} />,
            label: 'Menu Stock',
            active: true,
            onClick: () => {}
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

export default MobileStock;
