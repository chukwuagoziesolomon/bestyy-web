import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Settings, X, Home, List, BarChart3, CreditCard, Search, Filter, Calendar, Menu, Loader2, RefreshCw } from 'lucide-react';
import { showError } from '../toast';
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

interface DashboardStats {
  total_deliveries: number;
  total_earnings: string;
  avg_delivery_time: string;
  changes: {
    deliveries: { value: string; type: string; period: string };
    earnings: { value: string; type: string; period: string };
    delivery_time: { value: string; type: string; period: string };
  };
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

const statusColors: Record<DeliveryStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  out_for_delivery: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

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
  try {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Sample delivery data for UI development
const sampleDeliveries: Delivery[] = [
  {
    id: 1,
    order_number: '00004',
    customer_name: 'John Doe',
    pickup_address: 'KFC, Oshodi',
    delivery_address: '25, Allen Avenue',
    total_price: '2500',
    status: 'cancelled',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    delivered_at: null,
    delivery_time_minutes: null
  },
  {
    id: 2,
    order_number: '00005',
    customer_name: 'Jane Smith',
    pickup_address: 'Chicken Republic, Gbagada',
    delivery_address: '12, Oworonshoki',
    total_price: '2200',
    status: 'delivered',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    delivered_at: new Date().toISOString(),
    delivery_time_minutes: 45
  }
];

const MobileCourierDeliveryList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filters, setFilters] = useState<FilterParams>({
    limit: 10,
    offset: 0,
  });
  
  const [stats, setStats] = useState<{
    total_deliveries: number;
    total_earnings: number;
    avg_delivery_time: number;
    changes: {
      deliveries: { value: string; type: string; period: string };
      earnings: { value: string; type: string; period: string };
      delivery_time: { value: string; type: string; period: string };
    };
  }>({
    total_deliveries: 0,
    total_earnings: 0,
    avg_delivery_time: 0,
    changes: {
      deliveries: { value: '0', type: 'increase', period: 'month' },
      earnings: { value: '0', type: 'increase', period: 'month' },
      delivery_time: { value: '0', type: 'decrease', period: 'month' }
    }
  });

  // Get status color function
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', color: '#f59e42' };
      case 'delivered':
      case 'completed':
        return { bg: '#d1fae5', color: '#10b981' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#ef4444' };
      case 'out_for_delivery':
        return { bg: '#dbeafe', color: '#3b82f6' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use sample data for now
      setStats({
        total_deliveries: 2,
        total_earnings: 4700,
        avg_delivery_time: 45,
        changes: {
          deliveries: { value: '0', type: 'increase', period: 'month' },
          earnings: { value: '0', type: 'increase', period: 'month' },
          delivery_time: { value: '0', type: 'decrease', period: 'month' }
        }
      });
      
      setDeliveries(sampleDeliveries);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      showError('Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  // Handle pull to refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle status filter change
  const handleStatusChange = useCallback((status: DeliveryStatus | 'all') => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      offset: 0
    }));
    setShowFilters(false);
  }, []);

  // Handle date filter change
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      date: e.target.value || undefined,
      offset: 0
    }));
  }, []);

  // Handle search
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value || undefined,
      offset: 0
    }));
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !refreshing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8fafc'
      }}>
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">My Deliveries</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={refreshing}
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'text-gray-400 animate-spin' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-bold text-lg">{stats.total_deliveries}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500">Earnings</p>
            <p className="font-bold text-lg">{formatCurrency(stats.total_earnings)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500">Avg. Time</p>
            <p className="font-bold text-lg">{stats.avg_delivery_time || '0'} min</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              onChange={handleSearch}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleStatusChange('all')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${!filters.status ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
            >
              All
            </button>
            {Object.entries(statusDisplay).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key as DeliveryStatus)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filters.status === key ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              onChange={handleDateChange}
              value={filters.date || ''}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mx-4 my-3 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Deliveries List */}
      <div className="pb-20">
        {loading ? (
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: '#ef4444',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            margin: '10px 0'
          }}>
            {error}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px'
          }}>
            {deliveries.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                No deliveries found
              </div>
            ) : (
              deliveries.map((delivery) => (
                <div key={delivery.id} style={{
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>
                      #{delivery.order_number}
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: getStatusColor(delivery.status).bg,
                      color: getStatusColor(delivery.status).color
                    }}>
                      {statusDisplay[delivery.status]}
                    </div>
                  </div>
                  <div style={{
                    display: 'grid',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 500,
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        Pick Up
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#1f2937',
                        fontWeight: 500
                      }}>
                        {delivery.pickup_address}
                      </span>
                    </div>
                    
                    <div>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 500,
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        Drop off
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#1f2937',
                        fontWeight: 500
                      }}>
                        {delivery.delivery_address}
                      </span>
                    </div>
                    
                    <div>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 500,
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        Date
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#1f2937',
                        fontWeight: 500
                      }}>
                        {formatDate(delivery.created_at)}
                      </span>
                    </div>
                    
                    <div>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 500,
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        Amount
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#1f2937',
                        fontWeight: 600
                      }}>
                        {formatCurrency(delivery.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '12px 0',
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 50
      }}>
        {[
          { 
            icon: <Home size={20} />, 
            label: 'Home', 
            active: false,
            onClick: () => navigate('/dashboard')
          },
          { 
            icon: <List size={20} />, 
            label: 'Delivery List', 
            active: true,
            onClick: () => {}
          },
          { 
            icon: <BarChart3 size={20} />, 
            label: 'Analytics', 
            active: false,
            onClick: () => navigate('/dashboard/analytics')
          },
          { 
            icon: <CreditCard size={20} />, 
            label: 'Payout', 
            active: false,
            onClick: () => navigate('/dashboard/payout')
          }
        ].map((item, index) => (
          <div 
            key={index} 
            onClick={item.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: item.active ? '#10b981' : '#6b7280',
              cursor: 'pointer',
              fontSize: '12px',
              gap: '4px'
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCourierDeliveryList;