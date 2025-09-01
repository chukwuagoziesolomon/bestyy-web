import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

// Types
type DeliveryStatus = 'pending' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';

interface Delivery {
  id: number;
  order_number: string;
  customer_name: string;
  pickup_address: string;
  delivery_address: string;
  total_price: string;
  status: DeliveryStatus;
  created_at: string;
  delivered_at: string | null;
  delivery_time_minutes: number | null;
}

interface DeliveriesResponse {
  count: number;
  total_earnings: number;
  average_delivery_time_minutes: number;
  deliveries: Delivery[];
}

interface FilterParams {
  status?: DeliveryStatus;
  date?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// Status display mapping
const statusDisplay: Record<DeliveryStatus, string> = {
  pending: 'Pending',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

const statusColors: Record<DeliveryStatus, { bg: string; color: string }> = {
  pending: { bg: '#fef3c7', color: '#f59e42' }, // Yellow
  out_for_delivery: { bg: '#e0f2fe', color: '#0ea5e9' }, // Blue
  delivered: { bg: '#d1fae5', color: '#10b981' }, // Green
  completed: { bg: '#d1fae5', color: '#10b981' }, // Green
  cancelled: { bg: '#fee2e2', color: '#ef4444' } // Red
};

const DeliveryListPage = () => {
  // State
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({
    limit: 10,
    offset: 0,
  });
  const [stats, setStats] = useState<{
    count: number;
    total_earnings: number;
    average_delivery_time_minutes: number;
  }>({ count: 0, total_earnings: 0, average_delivery_time_minutes: 0 });

  // Format currency
  const formatCurrency = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  // Fetch deliveries
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.date) params.append('date', filters.date);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await axios.get<DeliveriesResponse>(
        `/api/user/couriers/deliveries/?${params.toString()}`
      );

      setDeliveries(response.data.deliveries);
      setStats({
        count: response.data.count,
        total_earnings: response.data.total_earnings,
        average_delivery_time_minutes: response.data.average_delivery_time_minutes
      });
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Failed to load deliveries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch deliveries when filters change
  useEffect(() => {
    fetchDeliveries();
  }, [filters]);

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as DeliveryStatus | 'all';
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      offset: 0 // Reset to first page when changing filters
    }));
  };

  // Handle date filter change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      date: e.target.value || undefined,
      offset: 0 // Reset to first page when changing filters
    }));
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value || undefined,
      offset: 0 // Reset to first page when searching
    }));
  };

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setFilters(prev => ({
      ...prev,
      offset: newOffset
    }));
    window.scrollTo(0, 0);
  };

  // Calculate pagination
  const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1;
  const totalPages = Math.ceil(stats.count / (filters.limit || 10));

  return (
    <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh', padding: '2.5rem 2.5rem 2.5rem 2.5rem', fontFamily: 'Nunito Sans, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Total Deliveries</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{stats.count}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Total Earnings</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{formatCurrency(stats.total_earnings)}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Avg. Delivery Time</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
              {stats.average_delivery_time_minutes ? `${stats.average_delivery_time_minutes} mins` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search by order number or customer"
            onChange={handleSearch}
            style={{
              flex: '1 1 300px',
              minWidth: '250px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9375rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          
          <select
            onChange={handleStatusChange}
            style={{
              minWidth: '180px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9375rem',
              color: '#374151',
              background: '#fff',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1rem',
              paddingRight: '2.5rem',
            }}
          >
            <option value="all">All Status</option>
            {Object.entries(statusDisplay).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="date"
            onChange={handleDateChange}
            style={{
              minWidth: '180px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9375rem',
              color: '#374151',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 32, margin: '0 auto', maxWidth: 1200 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '1.125rem', color: '#4b5563' }}>Loading deliveries...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#ef4444' }}>
              <div style={{ marginBottom: '1rem' }}>Error loading deliveries</div>
              <button
                onClick={fetchDeliveries}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                }}
              >
                Retry
              </button>
            </div>
          ) : deliveries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>No deliveries found</div>
              <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem', border: '1px solid #e5e7eb', fontFamily: 'inherit' }}>
                  <thead>
                    <tr style={{ color: '#6b7280', fontWeight: '600', textAlign: 'left', backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '1rem', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>ORDER #</th>
                      <th style={{ padding: '1rem', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>CUSTOMER</th>
                      <th style={{ padding: '1rem', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>PICK UP</th>
                      <th style={{ padding: '1rem', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>DROP-OFF</th>
                      <th style={{ padding: '1rem', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>DATE</th>
                      <th style={{ padding: '1rem', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>AMOUNT</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>
                          <Link 
                            to={`/dashboard/deliveries/${delivery.id}`} 
                            style={{ color: '#3b82f6', textDecoration: 'none' }}
                            className="hover:underline"
                          >
                            {delivery.order_number}
                          </Link>
                        </td>
                        <td style={{ padding: '1rem', color: '#4b5563' }}>{delivery.customer_name}</td>
                        <td style={{ padding: '1rem', color: '#4b5563', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={delivery.pickup_address}>
                          {delivery.pickup_address}
                        </td>
                        <td style={{ padding: '1rem', color: '#4b5563', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={delivery.delivery_address}>
                          {delivery.delivery_address}
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{formatDate(delivery.created_at)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#1f2937', fontWeight: '600' }}>
                          {formatCurrency(delivery.total_price)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              backgroundColor: statusColors[delivery.status].bg,
                              color: statusColors[delivery.status].color,
                              minWidth: '100px',
                            }}
                          >
                            {statusDisplay[delivery.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

function sidebarLinkStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 14, padding: '0.85rem 2.2rem', borderRadius: 8,
    textDecoration: 'none', color: active ? '#fff' : '#222',
    background: active ? '#10b981' : 'none',
    fontWeight: 600, fontSize: 16, marginBottom: 2,
    transition: 'background 0.2s',
  };
}

export default DeliveryListPage; 