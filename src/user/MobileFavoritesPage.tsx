import React, { useState } from 'react';
import { Heart, Filter, Calendar, ChevronDown, MessageCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import HamburgerMenu from '../components/HamburgerMenu';
import { useResponsive } from '../hooks/useResponsive';

interface FoodOrder {
  id: string;
  title: string;
  restaurant: string;
  date: string;
  time: string;
  price: number;
  isFavorited: boolean;
}

const MobileFavoritesPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const [selectedFilter, setSelectedFilter] = useState('Last 30 Days');
  const [orders, setOrders] = useState<FoodOrder[]>([
    {
      id: '1',
      title: 'Fried Rice and Turkey, Sa...',
      restaurant: 'Korede Spagetti',
      date: '15, Jun 2025',
      time: '12:00',
      price: 5000,
      isFavorited: true
    },
    {
      id: '2',
      title: 'Fried Rice and Turkey, Sa...',
      restaurant: 'Korede Spagetti',
      date: '15, Jun 2025',
      time: '12:00',
      price: 5000,
      isFavorited: true
    },
    {
      id: '3',
      title: 'Fried Rice and Turkey, Sa...',
      restaurant: 'Korede Spagetti',
      date: '15, Jun 2025',
      time: '12:00',
      price: 5000,
      isFavorited: true
    }
  ]);

  const toggleFavorite = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, isFavorited: !order.isFavorited }
          : order
      )
    );
  };

  const formatPrice = (price: number) => {
    return `N ${price.toLocaleString()}`;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: isTablet ? '768px' : '414px', // Tablet: 768px, Mobile: 414px
      margin: '0 auto',
      position: 'relative',
      paddingBottom: '80px'
    }}>
      {/* Header Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e9ecef',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: 0,
          color: '#212529'
        }}>
          Favorite
        </h1>
        <HamburgerMenu size={24} color="#6c757d" />
      </div>

      {/* Description */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6c757d',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp
        </p>
      </div>

      {/* Filter Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Filters Button */}
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f3f4f6',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}>
            <Filter size={16} color="#10b981" />
            <span style={{ color: '#374151', fontWeight: '500', fontSize: '14px' }}>Filters</span>
          </button>

          {/* Date Filter Dropdown */}
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f3f4f6',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            flex: 1
          }}>
            <Calendar size={16} color="#10b981" />
            <span style={{ color: '#374151', fontWeight: '500', fontSize: '14px' }}>{selectedFilter}</span>
            <ChevronDown size={16} color="#6b7280" style={{ marginLeft: 'auto' }} />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '16px' }}>
        {/* Food Orders Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {orders.map((order, index) => (
            <div key={order.id}>
              {/* Order Item */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px'
              }}>
                {/* Favorite Heart Button */}
                <button
                  onClick={() => toggleFavorite(order.id)}
                  style={{
                    marginRight: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <Heart
                    size={20}
                    color={order.isFavorited ? '#ef4444' : '#d1d5db'}
                    fill={order.isFavorited ? '#ef4444' : 'none'}
                  />
                </button>

                {/* Order Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <h3 style={{
                      color: '#111827',
                      fontWeight: '500',
                      fontSize: '14px',
                      margin: 0,
                      paddingRight: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {order.title}
                    </h3>
                    <span style={{
                      color: '#111827',
                      fontWeight: '700',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatPrice(order.price)}
                    </span>
                  </div>
                  
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    margin: '0 0 8px 0'
                  }}>
                    {order.restaurant}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#9ca3af',
                      fontSize: '12px'
                    }}>
                      {order.date}, {order.time}
                    </span>
                    
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      <MessageCircle size={12} color="#6b7280" />
                      <span style={{
                        fontSize: '12px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        Order Via WhatsApp
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider (except for last item) */}
              {index < orders.length - 1 && (
                <div style={{
                  borderBottom: '1px solid #f3f4f6',
                  marginLeft: '48px'
                }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MobileFavoritesPage;
