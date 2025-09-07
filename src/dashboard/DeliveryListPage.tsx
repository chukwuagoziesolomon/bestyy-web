import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Filter, ChevronDown, ChevronUp, Search, RefreshCw, Eye } from 'lucide-react';
import { fetchCourierDeliveries } from '../api';

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

const DeliveryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

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

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
    return `₦${parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const getStatusDisplay = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading deliveries...</p>
          </div>
          </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '16px', 
            padding: '8px 16px', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
            </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <div style={{ fontFamily: 'Nunito Sans, sans-serif', padding: '16px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0', color: '#111827' }}>
              Delivery List
            </h1>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          
          <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
            {totalCount} total deliveries
          </p>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              width: '100%',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} />
              Filters
            </span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showFilters && (
            <div style={{ 
              background: 'white', 
              padding: '16px', 
              borderRadius: '8px', 
              marginTop: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Search
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="text"
                      placeholder="Search deliveries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '10px 12px 10px 40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        width: '100%',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Deliveries List */}
        <div style={{ marginBottom: '24px' }}>
          {filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    {delivery.order_number}
                  </h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                    {delivery.vendor.business_name}
                  </p>
                </div>
                
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: statusColors[delivery.status]?.bg || '#f3f4f6',
                  color: statusColors[delivery.status]?.color || '#6b7280'
                }}>
                  {getStatusDisplay(delivery.status)}
                </span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                  <strong>Address:</strong> {delivery.delivery_address}
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                  <strong>Created:</strong> {formatDate(delivery.created_at)}
                </p>
                {delivery.delivered_at && (
                  <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                    <strong>Delivered:</strong> {formatDate(delivery.delivered_at)}
                  </p>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                  {formatPrice(delivery.total_price)}
                </div>
                
                <button
                  onClick={() => navigate(`/courier/dashboard/deliveries/${delivery.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151'
                  }}
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
          
          {filteredDeliveries.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ margin: '0', fontSize: '16px', color: '#6b7280' }}>
                {searchTerm || selectedStatus ? 'No deliveries match your filters' : 'No deliveries found'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
              Page {currentPage} of {totalPages}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  background: currentPage === 1 ? '#f3f4f6' : 'white',
                  color: currentPage === 1 ? '#9ca3af' : '#374151',
                  borderRadius: '8px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                Previous
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  background: currentPage === totalPages ? '#f3f4f6' : 'white',
                  color: currentPage === totalPages ? '#9ca3af' : '#374151',
                  borderRadius: '8px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 8px 0', color: '#111827' }}>
            Delivery List
          </h1>
          <p style={{ margin: '0', color: '#6b7280', fontSize: '16px' }}>
            {totalCount} total deliveries
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Search
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Search by order number, vendor, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    width: '300px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minWidth: '150px'
                }}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
        </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minWidth: '100px'
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Deliveries Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
              <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Order Number
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Vendor
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Delivery Address
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Status
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Created
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Delivered
                </th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Total Price
                </th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Actions
                </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#111827' }}>
                            {delivery.order_number}
                        </td>
                  <td style={{ padding: '16px', color: '#374151' }}>
                    {delivery.vendor.business_name}
                        </td>
                  <td style={{ padding: '16px', color: '#374151', maxWidth: '250px' }}>
                    <div style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }} title={delivery.delivery_address}>
                          {delivery.delivery_address}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: statusColors[delivery.status]?.bg || '#f3f4f6',
                      color: statusColors[delivery.status]?.color || '#6b7280'
                    }}>
                      {getStatusDisplay(delivery.status)}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>
                    {formatDate(delivery.created_at)}
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>
                    {delivery.delivered_at ? formatDate(delivery.delivered_at) : '-'}
                        </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#111827' }}>
                    {formatPrice(delivery.total_price)}
                        </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => navigate(`/courier/dashboard/deliveries/${delivery.id}`)}
                            style={{
                        display: 'flex',
                              alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}
                    >
                      <Eye size={14} />
                      View
                    </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

        {filteredDeliveries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ margin: '0', fontSize: '16px' }}>
              {searchTerm || selectedStatus ? 'No deliveries match your filters' : 'No deliveries found'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '24px',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                background: currentPage === 1 ? '#f3f4f6' : 'white',
                color: currentPage === 1 ? '#9ca3af' : '#374151',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (page > totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    background: page === currentPage ? '#3b82f6' : 'white',
                    color: page === currentPage ? 'white' : '#374151',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: page === currentPage ? '600' : '400'
                  }}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                background: currentPage === totalPages ? '#f3f4f6' : 'white',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
      </div>
  );
};

export default DeliveryListPage; 