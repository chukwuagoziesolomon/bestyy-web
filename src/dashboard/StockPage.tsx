import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { fetchVendorStockItems, toggleStockItemAvailability, fetchStockSummary } from '../api';
import { getMenuItemImageUrl, getFallbackImageUrl } from '../utils/imageUtils';
import MobileVendorStock from './MobileVendorStock';

// Interface for stock item data from API
interface StockItem {
  id: number;
  vendor: number;
  vendor_name: string;
  dish_name: string;
  item_description: string;
  price: string;
  category: string;
  image: string;
  image_url: string;
  image_urls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
  available_now: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface StockItemsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StockItem[];
}

interface StockSummary {
  total_items: number;
  available_items: number;
  unavailable_items: number;
  in_stock_items: number;
  out_of_stock_items: number;
  low_stock_items: number;
}

interface CategoryBreakdown {
  category: string;
  total_items: number;
  available_items: number;
  out_of_stock_items: number;
}

interface StockSummaryResponse {
  summary: StockSummary;
  category_breakdown: CategoryBreakdown[];
}

const StockPage: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // API state management
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingItems, setTogglingItems] = useState<Set<number>>(new Set());
  
  // Filtering state
  const [filters, setFilters] = useState({
    search: '',
    availability: undefined as boolean | undefined,
    stock_status: undefined as 'in_stock' | 'out_of_stock' | 'low_stock' | undefined,
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get token function - using the same pattern as other working components
  const getToken = () => {
    return localStorage.getItem('access_token') || 
           localStorage.getItem('vendor_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('auth_token');
  };

  // Fetch stock items from API
  const fetchStockItems = async () => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchVendorStockItems(token, {
        page: 1,
        page_size: 100, // Get all items for stock management
        ...filters
      });
      
      setStockItems(response.results);
    } catch (err) {
      console.error('Error fetching stock items:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stock items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock summary
  const fetchStockSummaryData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetchStockSummary(token);
      setStockSummary(response.summary);
    } catch (err) {
      console.error('Error fetching stock summary:', err);
    }
  };

  // Toggle item availability
  const toggleItemAvailability = async (itemId: number) => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      setTogglingItems(prev => new Set(prev).add(itemId));
      
      const response = await toggleStockItemAvailability(token, itemId);
      
      // Update local state with the response data
      setStockItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, available_now: response.item.available_now } : item
      ));
      
      // Refresh summary data
      fetchStockSummaryData();
      
    } catch (err) {
      console.error('Error toggling item availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to update item availability');
    } finally {
      setTogglingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchStockItems();
    fetchStockSummaryData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      availability: undefined,
      stock_status: undefined,
      category: ''
    });
  };

  // Format currency
  const formatCurrency = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileVendorStock />;
  }

  const handleEdit = (id: number) => {
    console.log('Edit item:', id);
    // Navigate to edit page or open edit modal
  };

  const handleDelete = (id: number) => {
    console.log('Delete item:', id);
    // Show confirmation dialog and delete item
  };

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
          Item Stock
        </h1>
      </div>

      {/* Stock Summary Cards */}
      {stockSummary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Items</div>
            <div style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>{stockSummary.total_items}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Available</div>
            <div style={{ color: '#059669', fontSize: '24px', fontWeight: '700' }}>{stockSummary.available_items}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Unavailable</div>
            <div style={{ color: '#dc2626', fontSize: '24px', fontWeight: '700' }}>{stockSummary.unavailable_items}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>In Stock</div>
            <div style={{ color: '#059669', fontSize: '24px', fontWeight: '700' }}>{stockSummary.in_stock_items}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Out of Stock</div>
            <div style={{ color: '#dc2626', fontSize: '24px', fontWeight: '700' }}>{stockSummary.out_of_stock_items}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Low Stock</div>
            <div style={{ color: '#d97706', fontSize: '24px', fontWeight: '700' }}>{stockSummary.low_stock_items}</div>
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
              placeholder="Search items..."
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
            onClick={() => {
              fetchStockItems();
              fetchStockSummaryData();
            }}
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
            {/* Availability Filter */}
            <select
              value={filters.availability === undefined ? '' : filters.availability.toString()}
              onChange={(e) => handleFilterChange('availability', e.target.value === '' ? undefined : e.target.value === 'true')}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Nunito Sans, sans-serif',
                background: 'white'
              }}
            >
              <option value="">All Availability</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            {/* Stock Status Filter */}
            <select
              value={filters.stock_status || ''}
              onChange={(e) => handleFilterChange('stock_status', e.target.value || undefined)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Nunito Sans, sans-serif',
                background: 'white'
              }}
            >
              <option value="">All Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
            </select>

            {/* Category Filter */}
            <input
              type="text"
              placeholder="Category filter..."
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Nunito Sans, sans-serif',
                minWidth: '150px'
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

      {/* Stock Table */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden'
      }}>
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
                  Image
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Dish Name
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Description
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Price
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Category
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Stock Toggle
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '16px'
                  }}>
                    Loading stock items...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#dc2626',
                    fontSize: '16px'
                  }}>
                    {error}
                  </td>
                </tr>
              ) : stockItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '16px'
                  }}>
                    No stock items found
                  </td>
                </tr>
              ) : (
                stockItems.map((item, index) => (
                  <tr key={item.id} style={{
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    {/* Image */}
                    <td style={{
                      padding: '16px'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: '#f3f4f6'
                      }}>
                        <img
                          src={getMenuItemImageUrl(item)}
                          alt={item.dish_name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            console.log('Stock page image failed to load:', getMenuItemImageUrl(item));
                            const fallbackUrl = getFallbackImageUrl(getMenuItemImageUrl(item) || '');
                            if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                              e.currentTarget.src = fallbackUrl;
                            } else {
                              e.currentTarget.src = 'https://via.placeholder.com/60x60?text=No+Image';
                            }
                          }}
                        />
                      </div>
                    </td>

                    {/* Dish Name */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      {item.dish_name}
                    </td>

                    {/* Description */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#6b7280',
                      maxWidth: '200px'
                    }}>
                      {item.item_description || 'No description'}
                    </td>

                    {/* Price */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '600'
                    }}>
                      {formatCurrency(item.price)}
                    </td>

                    {/* Category */}
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {item.category}
                    </td>

                    {/* Stock Toggle */}
                    <td style={{
                      padding: '16px'
                    }}>
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        disabled={togglingItems.has(item.id)}
                        style={{
                          width: '48px',
                          height: '24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: item.available_now ? '#10b981' : '#d1d5db',
                          cursor: togglingItems.has(item.id) ? 'not-allowed' : 'pointer',
                          position: 'relative',
                          transition: 'background 0.2s ease',
                          opacity: togglingItems.has(item.id) ? 0.6 : 1
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: '2px',
                          left: item.available_now ? '26px' : '2px',
                          transition: 'left 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                      {togglingItems.has(item.id) && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginTop: '4px'
                        }}>
                          Updating...
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td style={{
                      padding: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => handleEdit(item.id)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.borderColor = '#9ca3af';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                        >
                          <Edit size={16} color="#6b7280" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.borderColor = '#fca5a5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                        >
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
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

export default StockPage;