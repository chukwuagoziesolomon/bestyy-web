import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, X, Check, Loader } from 'lucide-react';
import HamburgerMenu from '../components/HamburgerMenu';
import BottomNav from '../components/BottomNav';
import { useResponsive } from '../hooks/useResponsive';

const MobileOrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  
  // Use the responsive hook
  const { isMobile, isTablet, isDesktop, redirectToDesktop } = useResponsive();
  
  // TEMPORARILY DISABLED - Redirect to desktop if needed
  // useEffect(() => {
  //   if (isDesktop) {
  //     redirectToDesktop('/user/dashboard/orders');
  //   }
  // }, [isDesktop, redirectToDesktop]);
  
  // Show loading state while checking device type
  if (isMobile === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <Loader className="animate-spin" size={32} color="#20B2AA" />
      </div>
    );
  }

  // Sample order data matching the image
  const orders = [
    {
      id: 1,
      name: 'Fried Rice and Turkey, Sa...',
      restaurant: 'Korede Spagetti',
      date: '15, Jun 2025, 12:00',
      price: 'N 5000',
      status: 'Delivered'
    },
    {
      id: 2,
      name: 'Jollof Rice and Chicken',
      restaurant: 'Kilimanjaro Restaurant',
      date: '14, Jun 2025, 19:30',
      price: 'N 4500',
      status: 'Processing'
    },
    {
      id: 3,
      name: 'Pounded Yam and Egusi',
      restaurant: 'Buka Hut',
      date: '13, Jun 2025, 13:15',
      price: 'N 3500',
      status: 'Cancelled'
    },
    {
      id: 4,
      name: 'Amala and Ewedu',
      restaurant: 'Mama Put',
      date: '12, Jun 2025, 20:45',
      price: 'N 2500',
      status: 'Delivered'
    }
  ];

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { color: '#10B981', background: '#D1FAE5' };
      case 'processing':
        return { color: '#F59E0B', background: '#FEF3C7' };
      case 'cancelled':
        return { color: '#EF4444', background: '#FEE2E2' };
      default:
        return { color: '#6B7280', background: '#F3F4F6' };
    }
  };

  const handleViewDetails = (orderId: number) => {
    // Use React Router's navigate for client-side navigation
    console.log('Navigating to order details for orderId:', orderId);
    navigate(`/user/dashboard/orders/${orderId}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
    setShowFilters(false);
  };

  // Get user data from localStorage
  const profileImage = localStorage.getItem('profile_image') || 'https://via.placeholder.com/40';

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      color: '#333',
      minHeight: '100vh',
      position: 'relative',
      paddingBottom: '80px',
      maxWidth: isTablet ? '768px' : '414px', // Tablet: 768px, Mobile: 414px
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          backgroundImage: `url(${profileImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div 
          onClick={() => {}}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <HamburgerMenu size={24} color="#333" />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: '#111827'
        }}>
          My Orders
        </h1>
        
        <p style={{
          color: '#6B7280',
          fontSize: '14px',
          margin: '0 0 20px 0',
          lineHeight: '1.5'
        }}>
          Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp
        </p>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <button 
            onClick={toggleFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#4B5563',
              cursor: 'pointer'
            }}
          >
            <span>Filters</span>
            <ChevronDown size={16} />
          </button>

          <div style={{
            flex: 1,
            position: 'relative'
          }}>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#4B5563',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'%239CA3AF\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E%0A")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px'
              }}
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 3 Months</option>
            </select>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              width: '200px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              zIndex: 50,
              marginTop: '8px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '600' }}>Filter by</span>
                <button 
                  onClick={toggleFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  <X size={20} color="#6B7280" />
                </button>
              </div>
              {['All', 'Delivered', 'Processing', 'Cancelled'].map((filter) => (
                <div 
                  key={filter}
                  onClick={() => handleFilterSelect(filter)}
                  onMouseEnter={() => setHoveredFilter(filter)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: hoveredFilter === filter ? '#F9FAFB' : 
                                  activeFilter === filter ? '#F3F4F6' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span>{filter}</span>
                  {activeFilter === filter && <Check size={16} color="#10B981" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {orders.map((order) => {
            const statusStyle = getStatusStyles(order.status);
            return (
              <div 
                key={order.id}
                onClick={() => handleViewDetails(order.id)}
                onMouseDown={() => setActiveOrderId(order.id)}
                onMouseUp={() => setActiveOrderId(null)}
                onMouseLeave={() => setActiveOrderId(null)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s',
                  transform: activeOrderId === order.id ? 'scale(0.99)' : 'scale(1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {order.name}
                    </h3>
                    <p style={{
                      margin: '0',
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      {order.restaurant}
                    </p>
                    <p style={{
                      margin: '0',
                      fontSize: '12px',
                      color: '#9CA3AF'
                    }}>
                      {order.date}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827'
                  }}>
                    {order.price}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #F3F4F6'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: statusStyle.background,
                    color: statusStyle.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {order.status === 'Delivered' && (
                      <Check size={12} strokeWidth={3} />
                    )}
                    {order.status === 'Processing' && (
                      <span style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: statusStyle.color
                      }}></span>
                    )}
                    {order.status === 'Cancelled' && (
                      <X size={12} strokeWidth={3} />
                    )}
                    {order.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(order.id);
                    }}
                    style={{
                      background: 'white',
                      border: '1px solid #20B2AA',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      color: '#20B2AA',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    View Order
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 3L11 8L6 13" stroke="#20B2AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MobileOrdersPage;