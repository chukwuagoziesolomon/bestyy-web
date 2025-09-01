import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, X, Check, Loader } from 'lucide-react';
import HamburgerMenu from '../components/HamburgerMenu';
import BottomNav from '../components/BottomNav';
import { useResponsive } from '../hooks/useResponsive';
import { fetchUserOrders, fetchVendorOrders } from '../api';
import { showMobileError } from '../toast';

interface Order {
  id: number;
  customer_name?: string;
  vendor_name?: string;
  restaurant?: string;
  name?: string;
  item_name?: string;
  status?: string;
  total_amount?: number;
  price?: string;
  created_at: string;
  date?: string;
  delivery_address?: string;
  customer_address?: string;
  // Add more possible fields from backend
  order_id?: string;
  items?: any[];
  delivery_fee?: number;
  subtotal?: number;
  [key: string]: any; // Allow any additional fields from backend
}

const MobileOrdersPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the responsive hook
  const { isMobile, isTablet } = useResponsive();

  const token = localStorage.getItem('token');
  const vendorToken = localStorage.getItem('vendor_token');

  console.log('=== TOKEN DEBUG INFO ===');
  console.log('User token:', token ? `Present (${token.substring(0, 10)}...)` : 'Missing');
  console.log('Vendor token:', vendorToken ? `Present (${vendorToken.substring(0, 10)}...)` : 'Missing');
  console.log('User token length:', token?.length);
  console.log('Vendor token length:', vendorToken?.length);
  console.log('All localStorage keys:', Object.keys(localStorage));
  console.log('========================');

  // Fetch orders from API
  useEffect(() => {
    async function loadOrders() {
      console.log('Mobile Orders - Token:', token ? 'Present' : 'Missing');
      console.log('Mobile Orders - Token length:', token?.length);

      if (!token && !vendorToken) {
        console.log('Mobile Orders - No authentication token found, not loading orders');
        setLoading(false);
        return;
      }

      console.log('Mobile Orders - Starting to fetch orders');
      setLoading(true);
      setError(null);
      try {
        // Check if user is a vendor and use appropriate endpoint
        let data;
        if (vendorToken) {
          console.log('Mobile Orders - Fetching vendor orders');
          data = await fetchVendorOrders(vendorToken);
        } else if (token) {
          console.log('Mobile Orders - Fetching user orders');
          data = await fetchUserOrders(token);
        } else {
          throw new Error('No authentication token found');
        }
        console.log('Mobile Orders - Raw API response:', data);

        // Use same data processing as desktop orders page
        const ordersArray = data.orders || data || [];

        console.log('Mobile Orders - Processed orders array:', ordersArray);
        console.log('Mobile Orders - Number of orders:', ordersArray.length);

        if (ordersArray.length > 0) {
          console.log('Mobile Orders - First order structure:', ordersArray[0]);
        }

        // Extract unique statuses from the orders for dynamic filtering
        const statusMap: { [key: string]: boolean } = {};
        ordersArray.forEach((order: Order) => {
          if (order.status && order.status.trim() !== '') {
            const formattedStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase();
            statusMap[formattedStatus] = true;
          }
        });
        const uniqueStatuses = Object.keys(statusMap);

        console.log('Mobile Orders - Available statuses from backend:', uniqueStatuses);

        setOrders(ordersArray);
        setAvailableStatuses(uniqueStatuses);
      } catch (err: any) {
        console.error('=== MOBILE ORDERS ERROR DEBUG ===');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('================================');

        const errorMessage = err.message || 'Could not fetch orders';
        setError(errorMessage);
        // Use mobile-specific toast for better mobile experience
        showMobileError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [token, vendorToken]);

  // TEMPORARILY DISABLED - Redirect to desktop if needed
  // useEffect(() => {
  //   if (isDesktop) {
  //     redirectToDesktop('/user/dashboard/orders');
  //   }
  // }, [isDesktop, redirectToDesktop]);
  
  // Show loading state while checking device type or loading data
  if (isMobile === null || loading) {
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

  // Filter orders based on active filter - work directly with backend data
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
    } catch {
      return 'Invalid date';
    }
  };



  // Dynamic status styles based on status type
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
                      Order #{order.id || order.order_id || 'Unknown'}
                    </h3>
                    {order.customer_name && (
                      <p style={{
                        margin: '0',
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '4px'
                      }}>
                        Customer: {order.customer_name}
                      </p>
                    )}
                    {order.item_name && (
                      <p style={{
                        margin: '0',
                        fontSize: '12px',
                        color: '#9CA3AF',
                        marginBottom: '4px'
                      }}>
                        Items: {order.item_name}
                      </p>
                    )}
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
                  {order.total_amount && (
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      ₦{order.total_amount.toLocaleString()}
                    </span>
                  )}
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
                    {order.status || 'Unknown'}
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

      <BottomNav />
    </div>
  );
};

export default MobileOrdersPage;