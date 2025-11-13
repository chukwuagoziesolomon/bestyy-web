import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { fetchCourierDeliveries } from '../api';
import CourierHeader from '../components/CourierHeader';
import CourierBottomNavigation from '../components/CourierBottomNavigation';

interface Delivery {
  id: number;
  order_number: string;
  vendor: {
    id: number;
    business_name: string;
  };
  delivery_address: string;
  total_price: string;
  status: string;
  created_at: string;
  delivered_at?: string;
}

interface DeliveryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Delivery[];
}

const MobileCourierDeliveryList: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#f59e0b' },
    accepted: { bg: '#dbeafe', color: '#2563eb' },
    in_progress: { bg: '#e0f2fe', color: '#0ea5e9' },
    delivered: { bg: '#d1fae5', color: '#10b981' },
    cancelled: { bg: '#fee2e2', color: '#ef4444' }
  };

  // Fetch deliveries data
  useEffect(() => {
    const fetchDeliveries = async () => {
    try {
      setLoading(true);
        setError(null);

        // Try multiple possible token keys
        const token = localStorage.getItem('access_token') || 
                     localStorage.getItem('token') || 
                     localStorage.getItem('courier_token') ||
                     localStorage.getItem('auth_token');
                     
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        console.log('Using token for API call:', token.substring(0, 20) + '...');

        const data: DeliveryResponse = await fetchCourierDeliveries(token, {
          status: selectedStatus || undefined,
          page: currentPage,
          page_size: pageSize
        });

        console.log('Deliveries API Response:', data);

        setDeliveries(data.results || []);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / pageSize));
      } catch (err: any) {
        console.error('Error fetching deliveries:', err);
        
        // Handle authentication errors specifically
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setError('Authentication failed. Please log in again.');
          // Optionally redirect to login
          // navigate('/login');
        } else {
        setError(err.message || 'Failed to fetch deliveries');
        }
        
        setDeliveries([]);
    } finally {
      setLoading(false);
      }
    };

    fetchDeliveries();
  }, [currentPage, selectedStatus, pageSize]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string) => {
    return `₦${parseFloat(price).toLocaleString()}`;
  };

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
            <CourierHeader showHamburger={false} />
      
      {/* Filter Button */}
      <div style={{
        background: '#fff',
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
          <button 
            onClick={() => setShowFilters(!showFilters)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Filter size={20} color="#6b7280" />
          {showFilters ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
          </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div style={{
          background: '#fff',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {/* Search */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
                placeholder="Search by order number, vendor, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fff'
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
              display: 'block'
            }}>
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#fff'
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            Showing {filteredDeliveries.length} of {totalCount} deliveries
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Loading State */}
        {loading && (
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            background: '#fff',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading deliveries...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            color: '#dc2626'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Deliveries List */}
        {!loading && !error && (
          <>
            {filteredDeliveries.length > 0 ? (
              <div style={{ marginBottom: '16px' }}>
                {filteredDeliveries.map((delivery, index) => (
                <div key={delivery.id} style={{
                  background: '#fff',
                  borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #f3f4f6'
                }}>
                    {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                      marginBottom: '12px'
                  }}>
                      <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                    }}>
                          {delivery.order_number}
                    </div>
                    <div style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          {delivery.vendor.business_name}
                    </div>
                  </div>
                  <div style={{
                        background: statusColors[delivery.status]?.bg || '#f3f4f6',
                        color: statusColors[delivery.status]?.color || '#6b7280',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {delivery.status.replace('_', ' ')}
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        <strong>Delivery Address:</strong><br />
                        {delivery.delivery_address}
                    </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        <strong>Order Date:</strong> {formatDate(delivery.created_at)}
                      </div>
                      {delivery.delivered_at && (
                        <div style={{
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <strong>Delivered:</strong> {formatDate(delivery.delivered_at)}
                        </div>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#10b981',
                      textAlign: 'right'
                    }}>
                      {formatPrice(delivery.total_price)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#6b7280' }}>
                  No deliveries found
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {searchTerm || selectedStatus ? 'Try adjusting your filters' : 'You haven\'t made any deliveries yet'}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    background: currentPage === 1 ? '#f3f4f6' : '#fff',
                    color: currentPage === 1 ? '#9ca3af' : '#374151',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Previous
                </button>
                
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  padding: '8px 12px'
                }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    background: currentPage === totalPages ? '#f3f4f6' : '#fff',
                    color: currentPage === totalPages ? '#9ca3af' : '#374151',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Next
                </button>
          </div>
            )}
          </>
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
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
                <CourierBottomNavigation currentPath="/courier/deliveries" />
      </div>
    </div>
  );
};

export default MobileCourierDeliveryList;