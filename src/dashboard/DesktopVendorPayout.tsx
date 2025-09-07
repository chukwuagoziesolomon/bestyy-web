import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Eye, 
  EyeOff, 
  CreditCard, 
  Calendar, 
  ChevronDown, 
  Search, 
  Filter, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  fetchVendorTransactions, 
  fetchTransactionSummary, 
  fetchEarningsBreakdown, 
  fetchPaymentHistory, 
  fetchTransactionAnalytics 
} from '../transactions-api';

// Interface definitions
interface Transaction {
  id: number;
  order_id: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  vendor: number;
  total_amount: string;
  status: string;
  payment_status: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
}

interface TransactionSummary {
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  total_orders: number;
  total_revenue: number;
  commission_rate: number;
  total_commission: number;
  net_earnings: number;
  average_order_value: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
  revenue: number;
}

interface PaymentBreakdown {
  payment_status: string;
  count: number;
  total_amount: number;
}

interface DailyRevenue {
  day: string;
  orders: number;
  revenue: number;
}

interface TopCustomer {
  user__email: string;
  user__first_name: string;
  user__last_name: string;
  order_count: number;
  total_spent: number;
}

interface EarningsData {
  period: string;
  orders: number;
  revenue: number;
  commission: number;
  net_earnings: number;
  percentage_change: number;
}

interface GrowthData {
  orders_growth: number;
  revenue_growth: number;
  avg_order_growth: number;
}

interface DayPerformance {
  day: string;
  orders: number;
  revenue: number;
}

const DesktopVendorPayout: React.FC = () => {
  // State management
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: undefined as 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'completed' | 'cancelled' | undefined,
    payment_status: undefined as 'pending' | 'completed' | 'failed' | undefined,
    start_date: '',
    end_date: '',
    search: '',
    page: 1,
    page_size: 20
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Get token function
  const getToken = () => {
    return localStorage.getItem('access_token') || 
           localStorage.getItem('vendor_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('auth_token');
  };

  // Fetch all data
  const fetchAllData = async () => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        transactionsData,
        summaryData,
        earningsData,
        paymentData,
        analyticsData
      ] = await Promise.all([
        fetchVendorTransactions(token, filters),
        fetchTransactionSummary(token, parseInt(selectedPeriod)),
        fetchEarningsBreakdown(token, 'monthly'),
        fetchPaymentHistory(token),
        fetchTransactionAnalytics(token)
      ]);

      setTransactions(transactionsData.results || []);
      setSummary(summaryData.summary || null);
      setEarningsData(earningsData.earnings_data || []);
      setPaymentHistory(paymentData || null);
      setAnalytics(analyticsData || null);

    } catch (err) {
      console.error('Error fetching payout data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payout data');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: undefined,
      payment_status: undefined,
      start_date: '',
      end_date: '',
      search: '',
      page: 1,
      page_size: 20
    });
  };

  // Format currency
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#059669';
      case 'pending':
        return '#d97706';
      case 'cancelled':
        return '#dc2626';
      case 'failed':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'cancelled':
      case 'failed':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchAllData();
  }, [filters, selectedPeriod]);

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '16px'
        }}>
          Loading payout data...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Page Header */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0
        }}>
          Payout & Transactions
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '8px 0 0 0'
        }}>
          Manage your earnings, transactions, and payment history
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Total Revenue */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} color="#059669" />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }} onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <Eye size={20} color="#6b7280" /> : <EyeOff size={20} color="#6b7280" />}
              </div>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Revenue</div>
            <div style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
              {showBalance ? formatCurrency(summary.total_revenue) : '••••••••'}
            </div>
          </div>

          {/* Net Earnings */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={24} color="#3b82f6" />
              </div>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Net Earnings</div>
            <div style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
              {showBalance ? formatCurrency(summary.net_earnings) : '••••••••'}
            </div>
          </div>

          {/* Total Orders */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={24} color="#d97706" />
              </div>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Orders</div>
            <div style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>{summary.total_orders}</div>
          </div>

          {/* Average Order Value */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CreditCard size={24} color="#8b5cf6" />
              </div>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Avg Order Value</div>
            <div style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
              {formatCurrency(summary.average_order_value)}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }} />
            <input
              type="text"
              placeholder="Search by order ID, customer email, or address..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            />
          </div>

          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Nunito Sans, sans-serif',
              background: 'white'
            }}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
          </select>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: showFilters ? '#3b82f6' : 'white',
              color: showFilters ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          >
            <Filter size={16} />
            Filters
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchAllData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {/* Status Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Nunito Sans, sans-serif',
                background: 'white'
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="picked_up">Picked Up</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={filters.payment_status || ''}
              onChange={(e) => handleFilterChange('payment_status', e.target.value || undefined)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Nunito Sans, sans-serif',
                background: 'white'
              }}
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            />
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            />

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>
            Recent Transactions
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Order ID
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Customer
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Amount
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Status
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Payment
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '16px'
                  }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} style={{
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    {/* Order ID */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#1f2937',
                      fontWeight: '500'
                    }}>
                      {transaction.order_id}
                    </td>

                    {/* Customer */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>
                          {transaction.user.first_name} {transaction.user.last_name}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '12px' }}>
                          {transaction.user.email}
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#1f2937',
                      fontWeight: '600'
                    }}>
                      {formatCurrency(transaction.total_amount)}
                    </td>

                    {/* Status */}
                    <td style={{
                      padding: '16px'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: `${getStatusColor(transaction.status)}20`,
                        color: getStatusColor(transaction.status)
                      }}>
                        {getStatusIcon(transaction.status)}
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td style={{
                      padding: '16px'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: `${getStatusColor(transaction.payment_status)}20`,
                        color: getStatusColor(transaction.payment_status)
                      }}>
                        {getStatusIcon(transaction.payment_status)}
                        {transaction.payment_status.charAt(0).toUpperCase() + transaction.payment_status.slice(1)}
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {formatDate(transaction.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DesktopVendorPayout;