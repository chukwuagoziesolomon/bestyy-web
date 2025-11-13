import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Landmark, 
  Calendar, 
  ChevronDown, 
  CreditCard, 
  TrendingUp, 
  Package, 
  Clock, 
  DollarSign, 
  Filter, 
  RefreshCw,
  Home,
  List,
  Utensils,
  Layers
} from 'lucide-react';
import { showSuccess, showError } from '../toast';
import { 
  fetchVendorTransactions, 
  fetchTransactionSummary, 
  fetchEarningsBreakdown, 
  fetchPaymentHistory, 
  fetchTransactionAnalytics 
} from '../transactions-api';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';

// Interface definitions matching desktop version
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

const MobileVendorPayout: React.FC = () => {
  const navigate = useNavigate();

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
  const [selectedPeriod, setSelectedPeriod] = useState('30');


  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  // Fetch all data using transaction APIs
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

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchAllData();
  }, [filters, selectedPeriod]);

  // Helper functions
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('businessName');
    localStorage.removeItem('businessLogo');
    navigate('/login');
  };




  if (loading) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        paddingBottom: '80px'
      }}>
        <VendorHeader />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <RefreshCw size={32} color="#10b981" />
          <span style={{ color: '#6b7280', fontSize: '16px' }}>Loading payout data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        paddingBottom: '80px'
      }}>
        <VendorHeader />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px 16px'
        }}>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <span style={{ color: '#dc2626', fontSize: '16px', fontWeight: '600' }}>
              {error}
            </span>
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={fetchAllData}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
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
      <VendorHeader title="Payout" />

      {/* Payout Content */}
      <div style={{ padding: '24px 16px' }}>
        {/* Summary Cards */}
        {summary && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#e6fffa',
                margin: '0 auto 12px'
              }}>
                <DollarSign size={20} color="#10b981" />
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {showBalance ? formatCurrency(summary.total_revenue) : '••••••••'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total Revenue
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#dbeafe',
                margin: '0 auto 12px'
              }}>
                <Package size={20} color="#3b82f6" />
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {summary.total_orders}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total Orders
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#dbeafe',
                margin: '0 auto 12px'
              }}>
                <TrendingUp size={20} color="#3b82f6" />
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {showBalance ? formatCurrency(summary.net_earnings) : '••••••••'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Net Earnings
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#f3e8ff',
                margin: '0 auto 12px'
              }}>
                <CreditCard size={20} color="#8b5cf6" />
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {formatCurrency(summary.average_order_value)}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Avg Order Value
              </div>
            </div>
          </div>
        )}

        {/* Period Selector */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: 0,
              color: '#1f2937'
            }}>
              Time Period
            </h3>
            <button
              onClick={fetchAllData}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                color: '#10b981'
              }}
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
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
                background: 'white',
                minWidth: '160px'
              }}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: '#1f2937'
          }}>
            Recent Transactions
          </h3>

          {transactions && transactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.order_id}
                  style={{
                    padding: '16px',
                    border: '1px solid #f3f4f6',
                    borderRadius: '8px',
                    background: '#fafafa'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '2px'
                      }}>
                        Order #{transaction.order_id}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {transaction.user.first_name} {transaction.user.last_name}
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#10b981'
                      }}>
                        {formatCurrency(transaction.total_amount)}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        textTransform: 'capitalize'
                      }}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <span>{formatDate(transaction.created_at)}</span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500',
                      background: `${getStatusColor(transaction.status)}20`,
                      color: getStatusColor(transaction.status)
                    }}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <Package size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>No transactions found</p>
              <p style={{ fontSize: '14px', margin: 0 }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/dashboard" />
    </div>
  );
};

export default MobileVendorPayout;