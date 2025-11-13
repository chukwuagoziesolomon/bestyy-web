import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Landmark, Calendar, ChevronDown, CreditCard, TrendingUp, Package, Clock, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { showSuccess, showError } from '../toast';
import CourierHeader from '../components/CourierHeader';
import CourierBottomNavigation from '../components/CourierBottomNavigation';
import { fetchCourierPayoutHistory, fetchCourierEarningsBreakdown } from '../api';

interface PayoutSummary {
  total_earnings: number;
  total_delivery_fees: number;
  total_deliveries: number;
  average_earnings_per_delivery: number;
  trend_percentage: number;
  period_days: number;
  total_transactions: number;
}

interface Transaction {
  order_id: number;
  order_name: string;
  amount: number;
  delivery_fee: number;
  date: string;
  status: string;
  customer: string;
  delivery_address: string;
  distance_km: number;
  delivery_time_minutes: number;
}

interface PayoutData {
  summary: PayoutSummary;
  transactions: Transaction[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_transactions: number;
    has_next: boolean;
    has_previous: boolean;
  };
  period: {
    start_date: string;
    end_date: string;
    period_type: string;
  };
}

const MobileCourierPayout: React.FC = () => {
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payoutData, setPayoutData] = useState<PayoutData | null>(null);

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' }
  ];

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('access_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('courier_token') || 
           localStorage.getItem('auth_token');
  };

  // Fetch payout data
  const fetchPayoutData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const params: any = {
        period: dateRange,
        status: selectedStatus,
        page: currentPage,
        page_size: 20
      };

      // Add custom date range if needed
      if (dateRange === 'custom') {
        // You can implement custom date picker here
        params.start_date = '2025-09-01';
        params.end_date = '2025-09-30';
      }

      const data = await fetchCourierPayoutHistory(token, params);
      setPayoutData(data);
    } catch (err: any) {
      console.error('Error fetching payout data:', err);
      setError(err.message || 'Failed to fetch payout data');
      
      // Handle 401 Unauthorized
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Please log in again to view payout data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchPayoutData();
  }, [dateRange, selectedStatus, currentPage]);

  // Handle filter changes
  const handleFilterChange = (type: 'date' | 'status', value: string) => {
    if (type === 'date') {
      setDateRange(value);
      setCurrentPage(1); // Reset to first page
    } else if (type === 'status') {
      setSelectedStatus(value);
      setCurrentPage(1); // Reset to first page
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  if (loading && !payoutData) {
  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
        <CourierHeader />
      <div style={{
        display: 'flex',
          justifyContent: 'center',
        alignItems: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <RefreshCw size={32} className="animate-spin" color="#10b981" />
          <span style={{ color: '#6b7280', fontSize: '16px' }}>Loading payout data...</span>
        </div>
        <CourierBottomNavigation currentPath="/courier/payouts" />
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
        <CourierHeader />
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
                onClick={fetchPayoutData}
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
        <CourierBottomNavigation currentPath="/courier/payouts" />
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
      <CourierHeader title="Payout" />

      {/* Payout Content */}
      <div style={{ padding: '24px 16px' }}>
        {/* Summary Cards */}
        {payoutData?.summary && (
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
                {formatCurrency(payoutData.summary.total_earnings)}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total Earnings
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
                {payoutData.summary.total_deliveries}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total Deliveries
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
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
              Filters
                </h3>
            <button
              onClick={fetchPayoutData}
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
            {/* Date Range Filter */}
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                  padding: '10px 16px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                  border: '1px solid #e5e7eb'
                    }}
                  >
                    <Calendar size={16} color="#6b7280" />
                    <span style={{
                      fontSize: '14px',
                  fontWeight: '500',
                      color: '#374151'
                    }}>
                  {dateOptions.find(opt => opt.value === dateRange)?.label || 'Select Period'}
                    </span>
                    <ChevronDown size={14} color="#9ca3af" />
                  </div>

                  {showDateDropdown && (
                    <>
                      <div
                        onClick={() => setShowDateDropdown(false)}
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 40
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                    left: 0,
                        marginTop: '8px',
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        zIndex: 50,
                    minWidth: '160px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {dateOptions.map((option, index) => (
                          <div
                        key={option.value}
                            onClick={() => {
                          handleFilterChange('date', option.value);
                              setShowDateDropdown(false);
                            }}
                            style={{
                          padding: '12px 16px',
                              cursor: 'pointer',
                          background: dateRange === option.value ? '#f0fdf4' : 'transparent',
                          color: dateRange === option.value ? '#10b981' : '#374151',
                              fontSize: '14px',
                          fontWeight: '500',
                              borderBottom: index < dateOptions.length - 1 ? '1px solid #f3f4f6' : 'none'
                            }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Filter */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowStatusFilter(!showStatusFilter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Filter size={16} color="#6b7280" />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {statusOptions.find(opt => opt.value === selectedStatus)?.label || 'All Status'}
                </span>
                <ChevronDown size={14} color="#9ca3af" />
              </div>

              {showStatusFilter && (
                <>
                  <div
                    onClick={() => setShowStatusFilter(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 40
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 50,
                    minWidth: '140px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {statusOptions.map((option, index) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          handleFilterChange('status', option.value);
                          setShowStatusFilter(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          background: selectedStatus === option.value ? '#f0fdf4' : 'transparent',
                          color: selectedStatus === option.value ? '#10b981' : '#374151',
                          fontSize: '14px',
                          fontWeight: '500',
                          borderBottom: index < statusOptions.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}
                      >
                        {option.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
        </div>

        {/* Transaction History */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
              color: '#1f2937'
            }}>
              Transaction History
            </h3>
            {payoutData?.summary && (
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {payoutData.summary.total_transactions} transactions
              </div>
            )}
              </div>

          {payoutData?.transactions && payoutData.transactions.length > 0 ? (
            <>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {payoutData.transactions.map((transaction) => (
                  <div key={transaction.order_id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '16px',
                    border: '1px solid #f3f4f6',
                    borderRadius: '8px',
                    background: '#fafafa'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '8px'
                      }}>
                        {transaction.order_name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        Customer: {transaction.customer}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        {transaction.delivery_address}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          <Clock size={12} />
                          {transaction.delivery_time_minutes} mins
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                          <Package size={12} />
                          {transaction.distance_km} km
                        </div>
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      marginLeft: '16px'
                    }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '8px'
                      }}>
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        Fee: {formatCurrency(transaction.delivery_fee)}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#10b981',
                        background: '#f0fdf4',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        display: 'inline-block',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {transaction.status}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        marginTop: '4px'
                      }}>
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                ))}
      </div>

              {/* Pagination */}
              {payoutData.pagination && payoutData.pagination.total_pages > 1 && (
      <div style={{
        display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!payoutData.pagination.has_previous}
                    style={{
                      background: payoutData.pagination.has_previous ? '#10b981' : '#e5e7eb',
                      color: payoutData.pagination.has_previous ? '#fff' : '#9ca3af',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: payoutData.pagination.has_previous ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Previous
                  </button>
                  
                  <span style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Page {currentPage} of {payoutData.pagination.total_pages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!payoutData.pagination.has_next}
            style={{
                      background: payoutData.pagination.has_next ? '#10b981' : '#e5e7eb',
                      color: payoutData.pagination.has_next ? '#fff' : '#9ca3af',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: payoutData.pagination.has_next ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <Package size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                No transactions found
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af'
              }}>
                Try adjusting your filters or check back later
              </div>
            </div>
          )}
          </div>
      </div>

      <CourierBottomNavigation currentPath="/courier/payouts" />
    </div>
  );
};

export default MobileCourierPayout;
