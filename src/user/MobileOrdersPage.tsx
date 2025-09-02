import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, X, Check, Loader2, Clock } from 'lucide-react';
import MobileHeader from '../components/MobileHeader';
import { useResponsive } from '../hooks/useResponsive';
import { fetchUserOrders } from '../api';

// Types matching the desktop version
interface OrderItem {
  id: number;
  dish_name: string;
  price: string;
}

interface Vendor {
  id: number;
  business_name: string;
  business_address: string;
}

interface Order {
  id: number;
  order_name: string;
  vendor: Vendor;
  items: OrderItem[];
  items_count: number;
  total_price: string;
  total_price_display: string;
  delivery_address: string;
  status: string;
  status_display: string;
  created_at: string;
  delivered_at?: string;
  payment_confirmed: boolean;
  user_receipt_confirmed: boolean;
}

interface OrdersResponse {
  count: number;
  total_pages: number;
  current_page: number;
  results: Order[];
}

const MobileOrdersPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [availableStatuses, setAvailableStatuses] = useState<string[]>(['Delivered', 'In Transit', 'Pending', 'Confirmed', 'Ready', 'Out for Delivery', 'Cancelled']);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('access_token');

  // Use the responsive hook
  const { isMobile, isTablet } = useResponsive();

  // Fetch orders from API
  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response: OrdersResponse = await fetchUserOrders(token);
        setOrders(response.results || []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  // Filter orders based on active filter
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'All') return true;
    return order.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  // Helper function to format date from backend
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to get status styles
  const getStatusStyles = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || '';

    // Success statuses (green)
    if (normalizedStatus.includes('delivered') || normalizedStatus.includes('completed') || normalizedStatus.includes('success')) {
      return { background: '#d1fae5', color: '#10b981' };
    }

    // Error/Cancelled statuses (red)
    if (normalizedStatus.includes('cancelled') || normalizedStatus.includes('rejected') || normalizedStatus.includes('failed')) {
      return { background: '#fee2e2', color: '#ef4444' };
    }

    // Warning/Pending statuses (yellow/orange)
    if (normalizedStatus.includes('pending') || normalizedStatus.includes('processing') || normalizedStatus.includes('waiting')) {
      return { background: '#fef3c7', color: '#d97706' };
    }

    // Info statuses (blue)
    if (normalizedStatus.includes('confirmed') || normalizedStatus.includes('accepted') || normalizedStatus.includes('preparing')) {
      return { background: '#dbeafe', color: '#2563eb' };
    }

    // Default (gray)
    return { background: '#e5e7eb', color: '#4b5563' };
  };

  const handleViewDetails = (orderId: number) => {
    // Use React Router's navigate for client-side navigation
    console.log('Navigating to order details for orderId:', orderId);
    navigate(`/user/orders/${orderId}`);
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
        <MobileHeader 
          title="My Orders"
          subtitle="Track your food delivery orders"
          variant="default"
          profileImageSize="medium"
          showProfileImage={true}
        />

              {/* Main Content */}
        <div style={{ 
          padding: '20px',
          marginTop: '8px'
        }}>
        
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
              {['All', ...availableStatuses].map((filter) => (
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

        {/* Error State */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{
              color: '#DC2626',
              margin: 0,
              fontSize: '14px'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Orders List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {filteredOrders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6B7280'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>
                {activeFilter === 'All' ? 'No orders found.' : `No ${activeFilter.toLowerCase()} orders found.`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusStyle = getStatusStyles(order.status || '');

              // Log the order structure for debugging
              console.log('Rendering order:', order);

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
                      Order #{order.id}
                    </h3>
                    <p style={{
                      margin: '0',
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      {order.order_name}
                    </p>
                    <p style={{
                      margin: '0',
                      fontSize: '12px',
                      color: '#9CA3AF',
                      marginBottom: '4px'
                    }}>
                      Vendor: {order.vendor.business_name}
                    </p>
                    {order.delivery_address && (
                      <p style={{
                        margin: '0',
                        fontSize: '12px',
                        color: '#9CA3AF',
                        marginBottom: '4px'
                      }}>
                        Address: {order.delivery_address}
                      </p>
                    )}
                    <p style={{
                      margin: '0',
                      fontSize: '12px',
                      color: '#9CA3AF'
                    }}>
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827'
                  }}>
                    {order.total_price_display || order.total_price}
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
                    {(() => {
                      const normalizedStatus = order.status?.toLowerCase() || '';

                      // Success statuses get check icon
                      if (normalizedStatus.includes('delivered') || normalizedStatus.includes('completed') || normalizedStatus.includes('success')) {
                        return <Check size={12} strokeWidth={3} />;
                      }

                      // Error/Cancelled statuses get X icon
                      if (normalizedStatus.includes('cancelled') || normalizedStatus.includes('rejected') || normalizedStatus.includes('failed')) {
                        return <X size={12} strokeWidth={3} />;
                      }

                      // All other statuses get a dot
                      return (
                        <span style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: statusStyle.color
                        }}></span>
                      );
                    })()}
                    {order.status_display || order.status || 'Unknown'}
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
            })
          )}
        </div>
      </div>

      {/* Bottom Navigation is now handled by UserDashboardLayout */}
    </div>
  );
};

export default MobileOrdersPage;