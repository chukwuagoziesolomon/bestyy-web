import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Filter, RefreshCw, Package, Eye, EyeOff, Home, List, Utensils, Layers, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVendorStockItems, toggleStockItemAvailability, fetchStockSummary } from '../api';
import { getMenuItemImageUrl, getFallbackImageUrl, debugImageUrl } from '../utils/imageUtils';
import { showError, showSuccess } from '../toast';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';

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

interface StockSummary {
  total_items: number;
  available_items: number;
  unavailable_items: number;
  in_stock_items: number;
  out_of_stock_items: number;
  low_stock_items: number;
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
  low_stock_items: number;
}

const MobileVendorStock: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  
  // Advanced filtering state
  const [filters, setFilters] = useState({
    search: '',
    availability: undefined as boolean | undefined,
    stock_status: undefined as 'in_stock' | 'out_of_stock' | 'low_stock' | undefined,
    category: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('access_token') || 
                 localStorage.getItem('vendor_token') || 
                 localStorage.getItem('token') || 
                 localStorage.getItem('auth_token');

  // Fetch stock items
  const fetchStockItems = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetchVendorStockItems(token, {
        page_size: 100, // Get all items for stock management
        ...filters
      });

      // API returns the data directly, not wrapped in success/data structure
      setStockItems(response.results || []);
    } catch (error) {
      console.error('Error fetching stock items:', error);
      showError('Error fetching stock items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock summary
  const fetchSummary = async () => {
    if (!token) return;

    try {
      const response = await fetchStockSummary(token);
      // API returns the data directly, not wrapped in success/data structure
      setStockSummary(response);
    } catch (error) {
      console.error('Error fetching stock summary:', error);
    }
  };

  useEffect(() => {
    fetchStockItems();
    fetchSummary();
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


  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    if (!token) return;

    try {
      setUpdatingId(id);
      await toggleStockItemAvailability(token, id);
      showSuccess(`Item ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchStockItems(); // Refresh the list
      fetchSummary(); // Refresh summary
    } catch (error) {
      console.error('Error toggling availability:', error);
      showError('Error updating item availability');
    } finally {
      setUpdatingId(null);
    }
  };

  const categories = ['all', 'Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Other'];

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('businessName');
    localStorage.removeItem('businessLogo');
    navigate('/login');
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader />

      {/* Stock Summary Cards */}
      {stockSummary && (
        <div style={{
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <div style={{
            background: '#f0fdf4',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>
              {stockSummary.total_items}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Total Items</div>
          </div>
          <div style={{
            background: '#fef3c7',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #fde68a'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#d97706', marginBottom: '4px' }}>
              {stockSummary.low_stock_items}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Low Stock</div>
          </div>
          <div style={{
            background: '#dcfce7',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>
              {stockSummary.available_items}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Available</div>
          </div>
          <div style={{
            background: '#fee2e2',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
              {stockSummary.unavailable_items}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Unavailable</div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div style={{
        padding: '0 16px 16px 16px'
      }}>
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: showFilters ? '#10b981' : 'white',
                color: showFilters ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: 'Nunito Sans, sans-serif',
                flex: 1
              }}
            >
              <Filter size={14} />
              Filters
              <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </button>

            <button
              onClick={() => {
                fetchStockItems();
                fetchSummary();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Availability Filter */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Availability
                </label>
                <select
                  value={filters.availability === undefined ? '' : filters.availability.toString()}
                  onChange={(e) => handleFilterChange('availability', e.target.value === '' ? undefined : e.target.value === 'true')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="">All</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              {/* Stock Status Filter */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Stock Status
                </label>
                <select
                  value={filters.stock_status || ''}
                  onChange={(e) => handleFilterChange('stock_status', e.target.value || undefined)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="">All</option>
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="low_stock">Low Stock</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                style={{
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stock Items List */}
      <div style={{ background: '#fff' }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#666'
          }}>
            Loading stock items...
          </div>
        ) : stockItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <Package size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>No items found</p>
            <p style={{ fontSize: '14px', margin: 0 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div>
            {stockItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: index < stockItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                  gap: '16px'
                }}
              >
                {/* Image Thumbnail */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {(() => {
                    const imageUrl = getMenuItemImageUrl(item);
                    // Debug the first few items to understand the structure
                    if (index < 3) {
                      debugImageUrl(item, 'MobileVendorStock');
                    }

                    return imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.dish_name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.log('Mobile stock image failed to load:', imageUrl);
                          const fallbackUrl = getFallbackImageUrl(imageUrl);
                          if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                            console.log('Trying fallback URL:', fallbackUrl);
                            e.currentTarget.src = fallbackUrl;
                          } else {
                            console.log('No fallback available, showing placeholder');
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div style="color: #9ca3af; font-size: 12px; text-align: center;">No Image</div>';
                          }
                        }}
                      />
                    ) : (
                      <div style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center' }}>
                        No Image
                      </div>
                    );
                  })()}
                </div>

                {/* Item Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 4px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.dish_name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.item_description || 'No description available'}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div style={{ flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleAvailability(item.id, item.available_now)}
                    disabled={updatingId === item.id}
                    style={{
                      width: '48px',
                      height: '28px',
                      borderRadius: '14px',
                      border: 'none',
                      cursor: updatingId === item.id ? 'not-allowed' : 'pointer',
                      background: item.available_now ? '#10b981' : '#d1d5db',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                      opacity: updatingId === item.id ? 0.6 : 1
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fff',
                      transform: item.available_now ? 'translateX(20px)' : 'translateX(0)',
                      transition: 'transform 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {updatingId === item.id && (
                        <div style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid #10b981',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                      )}
                    </div>
                  </button>
                  {updatingId === item.id && (
                    <div style={{
                      fontSize: '10px',
                      color: '#6b7280',
                      textAlign: 'center',
                      marginTop: '2px'
                    }}>
                      Updating...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/stock" />

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default MobileVendorStock;

