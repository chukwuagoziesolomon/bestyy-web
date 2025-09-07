import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Landmark, Calendar, ChevronDown, CreditCard, TrendingUp, Package, Clock, DollarSign, Filter, RefreshCw, Download } from 'lucide-react';
import { showSuccess, showError } from '../toast';
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

const DesktopCourierPayout: React.FC = () => {
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

  // Export data function
  const handleExport = () => {
    showSuccess('Export feature coming soon!');
  };

  if (loading && !payoutData) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        padding: '32px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <RefreshCw size={48} className="animate-spin" color="#10b981" />
          <span style={{ color: '#6b7280', fontSize: '18px' }}>Loading payout data...</span>
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
        padding: '32px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <span style={{ color: '#dc2626', fontSize: '18px', fontWeight: '600' }}>
              {error}
            </span>
            <div style={{ marginTop: '24px' }}>
              <button
                onClick={fetchPayoutData}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
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
      padding: '32px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          margin: 0,
          color: '#1f2937'
        }}>
          Payout Dashboard
        </h1>
        <button
          onClick={handleExport}
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Summary Cards */}
      {payoutData?.summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#e6fffa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} color="#10b981" />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  Total Earnings
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {formatCurrency(payoutData.summary.total_earnings)}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#10b981',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <TrendingUp size={16} />
              +{payoutData.summary.trend_percentage}% from last period
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={24} color="#3b82f6" />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  Total Deliveries
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {payoutData.summary.total_deliveries}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {payoutData.summary.period_days} days period
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Landmark size={24} color="#f59e0b" />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  Avg per Delivery
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {formatCurrency(payoutData.summary.average_earnings_per_delivery)}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Per delivery average
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CreditCard size={24} color="#8b5cf6" />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  Delivery Fees
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {formatCurrency(payoutData.summary.total_delivery_fees)}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Total fees earned
            </div>
          </div>
        </div>
      )}

      {/* Filters and Transactions */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Filters Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
            color: '#1f2937'
          }}>
            Transaction History
          </h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={fetchPayoutData}
              style={{
                background: 'none',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <RefreshCw size={16} />
            </button>

            {/* Date Range Filter */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                  minWidth: '160px'
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
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                  minWidth: '140px'
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

        {/* Transactions Table */}
        {payoutData?.transactions && payoutData.transactions.length > 0 ? (
          <>
            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    borderBottom: '2px solid #f3f4f6'
                  }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '16px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Order Details
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '16px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Customer
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '16px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Delivery Info
                    </th>
                    <th style={{
                      textAlign: 'right',
                      padding: '16px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Amount
                    </th>
                    <th style={{
                      textAlign: 'center',
                      padding: '16px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Status
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '16px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payoutData.transactions.map((transaction) => (
                    <tr key={transaction.order_id} style={{
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <td style={{
                        padding: '16px 12px',
                        verticalAlign: 'top'
                      }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {transaction.order_name}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          ID: #{transaction.order_id}
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        verticalAlign: 'top'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          {transaction.customer}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {transaction.delivery_address}
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        verticalAlign: 'top'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            color: '#6b7280'
                          }}>
                            <Clock size={14} />
                            {transaction.delivery_time_minutes} mins
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            color: '#6b7280'
                          }}>
                            <Package size={14} />
                            {transaction.distance_km} km
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        textAlign: 'right',
                        verticalAlign: 'top'
                      }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#10b981',
                          marginBottom: '4px'
                        }}>
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          Fee: {formatCurrency(transaction.delivery_fee)}
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#10b981',
                          background: '#f0fdf4',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          display: 'inline-block',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {transaction.status}
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        verticalAlign: 'top'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          {formatDate(transaction.date)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {payoutData.pagination && payoutData.pagination.total_pages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                marginTop: '32px',
                paddingTop: '24px',
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
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
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
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
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
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <Package size={64} color="#d1d5db" style={{ marginBottom: '20px' }} />
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
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
  );
};

export default DesktopCourierPayout;
