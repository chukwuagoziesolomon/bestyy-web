import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, ChevronDown, Menu, X, BarChart3, CreditCard, HelpCircle, Settings, Calendar, Filter, Smile } from 'lucide-react';
import { fetchVendorOrders } from '../api';
import { showError } from '../toast';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';
import '../styles/loading-spinner.css';

interface Order {
  id: string;
  customer_name: string;
  customer_address?: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const MobileOrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Last 30 Days');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const token = localStorage.getItem('vendor_token');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        if (token) {
          const data = await fetchVendorOrders(token);
          setOrders(data.orders || data || []);
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch orders');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [token]);

  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'rejected':
        return { background: '#fef2f2', color: '#dc2626' };
      case 'accepted':
      case 'confirmed':
        return { background: '#d1fae5', color: '#065f46' };
      case 'pending':
        return { background: '#fef3c7', color: '#92400e' };
      case 'delivered':
        return { background: '#dbeafe', color: '#1e40af' };
      default:
        return { background: '#f3f4f6', color: '#4b5563' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return 'Just Now';
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };

  // Filter orders based on date range and price range
  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Date filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= start && orderDate <= end;
      });
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filtered = filtered.filter(order => {
        const price = order.total_amount;
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    return filtered;
  };

  // Apply date filter presets
  const applyDateFilter = (filterType: string) => {
    const now = new Date();
    let start = new Date();

    switch (filterType) {
      case 'Today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(now.toISOString().split('T')[0]);
        break;
      case 'Last 7 Days':
        start.setDate(now.getDate() - 7);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(now.toISOString().split('T')[0]);
        break;
      case 'Last 30 Days':
        start.setDate(now.getDate() - 30);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(now.toISOString().split('T')[0]);
        break;
      case 'This Month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(now.toISOString().split('T')[0]);
        break;
      case 'Custom':
        // Don't set dates, let user pick
        break;
      default:
        setStartDate('');
        setEndDate('');
    }
    setSelectedFilter(filterType);
  };

  // Use filtered data
  const displayOrders = getFilteredOrders();

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader />


      {/* Filters */}
      <div style={{
        padding: '16px',
        display: 'flex',
        gap: '12px'
      }}>
        {/* Filters Button */}
        <div
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: showPriceFilter ? '#10b981' : '#f3f4f6',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Filter size={16} color={showPriceFilter ? 'white' : '#10b981'} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: showPriceFilter ? 'white' : '#374151'
          }}>
            Filters
          </span>
        </div>

        {/* Calendar Filter Button */}
        <div
          onClick={() => setShowCalendar(!showCalendar)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: showCalendar ? '#10b981' : '#f3f4f6',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            flex: 1,
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={16} color={showCalendar ? 'white' : '#10b981'} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: showCalendar ? 'white' : '#374151'
          }}>
            {selectedFilter}
          </span>
          <ChevronDown
            size={16}
            color={showCalendar ? 'white' : '#6b7280'}
            style={{
              marginLeft: 'auto',
              transform: showCalendar ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>
      </div>

      {/* Calendar Filter Dropdown */}
      {showCalendar && (
        <div style={{
          margin: '0 16px 16px 16px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#1f2937'
            }}>
              Date Range
            </h3>

            {/* Quick Date Filters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {['Today', 'Last 7 Days', 'Last 30 Days', 'This Month'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => applyDateFilter(filter)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: selectedFilter === filter ? '2px solid #10b981' : '1px solid #e5e7eb',
                    background: selectedFilter === filter ? '#f0fdf4' : 'white',
                    color: selectedFilter === filter ? '#10b981' : '#374151',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  From
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value && endDate) {
                      setSelectedFilter('Custom Range');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  To
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (startDate && e.target.value) {
                      setSelectedFilter('Custom Range');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSelectedFilter('All Time');
              }}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Clear Date Filter
            </button>
          </div>
        </div>
      )}

      {/* Price Filter Dropdown */}
      {showPriceFilter && (
        <div style={{
          margin: '0 16px 16px 16px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '16px'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937'
          }}>
            Price Range
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Min Price (₦)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Max Price (₦)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="No limit"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Quick Price Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {[
              { label: 'Under ₦1,000', min: '', max: '1000' },
              { label: '₦1,000 - ₦5,000', min: '1000', max: '5000' },
              { label: '₦5,000 - ₦10,000', min: '5000', max: '10000' },
              { label: 'Over ₦10,000', min: '10000', max: '' }
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  setMinPrice(range.min);
                  setMaxPrice(range.max);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: '#374151',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Clear Price Filter Button */}
          <button
            onClick={() => {
              setMinPrice('');
              setMaxPrice('');
            }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#6b7280',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Clear Price Filter
          </button>
        </div>
      )}

      {/* Orders List */}
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <div className="logo-loading-container">
              <div className="logo-loading-spinner">
                <img src="/logo.png" alt="Bestyy Logo" />
              </div>
              <div className="logo-loading-text">Loading orders...</div>
            </div>
          </div>
        ) : displayOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#888',
            fontWeight: 600,
            margin: '4rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh'
          }}>
            <Smile size={120} color="#e5e7eb" style={{ marginBottom: 32 }} />
            <div style={{
              fontSize: 18,
              color: '#888',
              fontWeight: 600,
              maxWidth: 400,
              lineHeight: 1.5
            }}>
              You haven't had an order yet. Once you receive your first order, you'll see your orders here!
            </div>
          </div>
        ) : (
          displayOrders.map((order, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* Order ID and Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#6b7280'
                }}>
                  #{order.id}
                </span>
                <div style={{
                  ...getStatusStyles(order.status),
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </div>
              </div>

              {/* Order Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Name
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    {order.customer_name}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Address
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    {order.customer_address || '12, yaba street'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Total
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    ₦{order.total_amount?.toLocaleString() || '04, Sep. 2025'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Date
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/orders" />
    </div>
  );
};

export default MobileOrdersList;
