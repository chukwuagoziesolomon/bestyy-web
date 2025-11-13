import React, { useState, useEffect } from 'react';
import { Heart, Filter, Calendar, ChevronDown, MessageCircle, Star, Utensils, Building2, Trash2 } from 'lucide-react';
import UserHeader from '../components/UserHeader';
import UserBottomNavigation from '../components/UserBottomNavigation';
import { useResponsive } from '../hooks/useResponsive';
import { fetchUserFavorites, removeFavorite } from '../api';

// Types matching the desktop version
interface FoodItem {
  id: number;
  dish_name: string;
  price: string;
  item_description?: string;
  image?: string;
}

interface Vendor {
  id: number;
  business_name: string;
  business_category: string;
  address?: string;
}

interface Favorite {
  id: number;
  favorite_type: 'food' | 'venue';
  food_item: FoodItem | null;
  vendor: Vendor | null;
  created_at: string;
}

const MobileFavoritesPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'food' | 'venue'>('all');
  const [favourites, setFavourites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('access_token');

  // Fetch favorites from API
  useEffect(() => {
    const loadFavorites = async () => {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserFavorites(token);
        console.log('Fetched favorites:', data);
        const favoritesArray = data.results || data || [];
        setFavourites(favoritesArray);
      } catch (err: any) {
        console.error('Error fetching favorites:', err);
        setError(err.message || 'Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [token]);

  const handleRemoveFavorite = async (favoriteId: number) => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      await removeFavorite(token, favoriteId);
      alert('Favorite removed successfully!');
      // Remove from local state
      setFavourites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove favorite');
    }
  };

  const filteredFavourites = favourites.filter(fav => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'food') return fav.favorite_type === 'food';
    if (selectedFilter === 'venue') return fav.favorite_type === 'venue';
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFavoriteDisplayData = (favorite: Favorite) => {
    if (favorite.favorite_type === 'food' && favorite.food_item) {
      return {
        name: favorite.food_item.dish_name,
        description: favorite.food_item.item_description || 'Food item',
        price: favorite.food_item.price,
        image: favorite.food_item.image,
        type: 'food'
      };
    } else if (favorite.favorite_type === 'venue' && favorite.vendor) {
      return {
        name: favorite.vendor.business_name,
        description: favorite.vendor.business_category,
        address: favorite.vendor.address || 'Address not available',
        image: null,
        type: 'venue'
      };
    }
    return null;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: isTablet ? '768px' : '414px', // Tablet: 768px, Mobile: 414px
      margin: '0 auto',
      position: 'relative',
      paddingBottom: '80px'
    }}>
      <UserHeader />

      {/* Description */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '16px',
        marginTop: '8px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6c757d',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp
        </p>
      </div>

      {/* Filter Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
            border: 'none',
              background: selectedFilter === 'all' ? '#10b981' : '#f3f4f6',
              color: selectedFilter === 'all' ? 'white' : '#6c757d',
              fontSize: '14px',
              fontWeight: '500',
            cursor: 'pointer'
            }}
          >
            All ({favourites.length})
          </button>
          <button
            onClick={() => setSelectedFilter('food')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedFilter === 'food' ? '#10b981' : '#f3f4f6',
              color: selectedFilter === 'food' ? 'white' : '#6c757d',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
              gap: '4px'
            }}
          >
            <Utensils size={14} />
            Food ({favourites.filter(f => f.favorite_type === 'food').length})
          </button>
          <button
            onClick={() => setSelectedFilter('venue')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
            border: 'none',
              background: selectedFilter === 'venue' ? '#10b981' : '#f3f4f6',
              color: selectedFilter === 'venue' ? 'white' : '#6c757d',
              fontSize: '14px',
              fontWeight: '500',
            cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Building2 size={14} />
            Venues ({favourites.filter(f => f.favorite_type === 'venue').length})
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '16px' }}>
        {loading ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '16px'
          }}>
            Loading favorites...
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#dc3545',
            fontSize: '16px'
          }}>
            Error: {error}
          </div>
        ) : filteredFavourites.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '16px'
          }}>
            {selectedFilter === 'all' ? 'No favourites found.' : `No ${selectedFilter} favourites found.`}
          </div>
        ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            {filteredFavourites.map((favorite, index) => {
              const displayData = getFavoriteDisplayData(favorite);
              if (!displayData) return null;
              
              return (
                          <div key={favorite.id}>
                {/* Favorite Item */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px'
              }}>
                  {/* Type Icon */}
                  <div style={{
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: displayData.type === 'food' ? '#fef3c7' : '#dbeafe'
                  }}>
                    {displayData.type === 'food' ? (
                      <Utensils size={20} color="#d97706" />
                    ) : (
                      <Building2 size={20} color="#1e40af" />
                    )}
                  </div>

                  {/* Item Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <h3 style={{
                      color: '#111827',
                      fontWeight: '500',
                      fontSize: '14px',
                      margin: 0,
                      paddingRight: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                        {displayData.name}
                    </h3>
                    <span style={{
                      color: '#111827',
                      fontWeight: '700',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}>
                        {displayData.type === 'food' ? displayData.price : ''}
                    </span>
                  </div>
                  
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    margin: '0 0 8px 0'
                  }}>
                      {displayData.description}
                    </p>
                    
                    {displayData.type === 'venue' && (
                      <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0 0 8px 0'
                      }}>
                        {displayData.address}
                      </p>
                    )}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#9ca3af',
                      fontSize: '12px'
                    }}>
                        {formatDate(favorite.created_at)}
                    </span>
                    
                      <button 
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                          backgroundColor: '#fee2e2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={12} color="#dc2626" />
                      <span style={{
                        fontSize: '12px',
                          color: '#dc2626',
                        fontWeight: '500'
                      }}>
                          Remove
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider (except for last item) */}
                {index < filteredFavourites.length - 1 && (
                <div style={{
                  borderBottom: '1px solid #f3f4f6',
                    marginLeft: '72px'
                }}></div>
              )}
            </div>
            );
            })}
        </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <UserBottomNavigation currentPath="/user/favorites" />
    </div>
  );
};

export default MobileFavoritesPage;
