import React, { useState, useEffect } from 'react';
import { Star, Filter, Trash2, Utensils, Building2 } from 'lucide-react';
import { fetchUserFavorites, removeFavorite } from '../api';
import { showError, showSuccess } from '../toast';

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

const UserFavourites = () => {
  const [favourites, setFavourites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'venue'>('all');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    async function getFavorites() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await fetchUserFavorites(token);
          console.log('Fetched favorites:', data); // Debug log
          const favoritesArray = data.results || data || [];
          setFavourites(favoritesArray);
        }
      } catch (err: any) {
        setError(err.message || 'Could not fetch favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    }
    getFavorites();
  }, [token]);

  const handleRemoveFavorite = async (favoriteId: number) => {
    if (!token) {
      showError('Authentication required');
      return;
    }

    try {
      await removeFavorite(token, favoriteId);
      showSuccess('Favorite removed successfully!');
      // Remove from local state
      setFavourites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (err: any) {
      showError(err.message || 'Failed to remove favorite');
    }
  };

  const filteredFavourites = favourites.filter(fav => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'food') return fav.favorite_type === 'food';
    if (activeFilter === 'venue') return fav.favorite_type === 'venue';
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
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
    {/* Header */}
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Favourites</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>Your saved food items and favorite restaurants for quick access.</div>
    </div>

    {/* Filter Bar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 0, overflow: 'hidden', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', borderRight: '1.5px solid #f3f4f6', fontWeight: 700, color: '#222', fontSize: 16 }}>
        <Filter size={20} /> Filter By
      </div>
      <button
        onClick={() => setActiveFilter('all')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '18px 28px',
          borderRight: '1.5px solid #f3f4f6',
          fontWeight: activeFilter === 'all' ? 700 : 600,
          color: activeFilter === 'all' ? '#10b981' : '#222',
          fontSize: 16,
          cursor: 'pointer',
          background: 'none',
          border: 'none'
        }}
      >
        All ({favourites.length})
      </button>
      <button
        onClick={() => setActiveFilter('food')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '18px 28px',
          borderRight: '1.5px solid #f3f4f6',
          fontWeight: activeFilter === 'food' ? 700 : 600,
          color: activeFilter === 'food' ? '#10b981' : '#222',
          fontSize: 16,
          cursor: 'pointer',
          background: 'none',
          border: 'none'
        }}
      >
        <Utensils size={18} /> Food ({favourites.filter(f => f.favorite_type === 'food').length})
      </button>
      <button
        onClick={() => setActiveFilter('venue')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '18px 28px',
          borderRight: '1.5px solid #f3f4f6',
          fontWeight: activeFilter === 'venue' ? 700 : 600,
          color: activeFilter === 'venue' ? '#10b981' : '#222',
          fontSize: 16,
          cursor: 'pointer',
          background: 'none',
          border: 'none'
        }}
      >
        <Building2 size={18} /> Venues ({favourites.filter(f => f.favorite_type === 'venue').length})
      </button>
    </div>

    {/* Favourites Table/List */}
      {loading ? (
      <div style={{ color: '#888', fontSize: 18, padding: 32, textAlign: 'center' }}>Loading favorites...</div>
      ) : error ? (
      <div style={{ color: '#dc3545', fontSize: 18, padding: 32, textAlign: 'center' }}>Error: {error}</div>
    ) : filteredFavourites.length === 0 ? (
      <div style={{ 
        color: '#888', 
        fontSize: 18, 
        padding: 32, 
        textAlign: 'center',
        background: '#fafafa',
        borderRadius: 16,
        border: '2px dashed #e5e7eb'
      }}>
        {activeFilter === 'all' ? 'No favourites found.' : `No ${activeFilter} favourites found.`}
      </div>
    ) : (
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: 0, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        {/* Table Header */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', minHeight: 60, fontWeight: 700, fontSize: 16, color: '#888' }}>
          <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e5e7eb', padding: '16px 0' }}>
            <Star size={20} color="#facc15" fill="#facc15" />
          </div>
          <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e5e7eb', padding: '16px 0' }}>
            TYPE
          </div>
          <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e5e7eb', padding: '16px 0' }}>
            IMAGE
          </div>
          <div style={{ flex: 2, padding: '16px 18px', borderRight: '1px solid #e5e7eb' }}>NAME</div>
          <div style={{ flex: 3, padding: '16px 18px', borderRight: '1px solid #e5e7eb' }}>DETAILS</div>
          <div style={{ flex: 2, padding: '16px 18px', borderRight: '1px solid #e5e7eb' }}>DATE</div>
          <div style={{ flex: 2, padding: '16px 18px', textAlign: 'center' }}>ACTION</div>
        </div>
        {/* Table Body */}
        {filteredFavourites.map((favorite, i) => {
          const displayData = getFavoriteDisplayData(favorite);
          if (!displayData) return null;

          return (
            <div key={favorite.id} style={{ display: 'flex', alignItems: 'center', minHeight: 80, borderBottom: i !== filteredFavourites.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
              <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e5e7eb', padding: '16px 0' }}>
                <Star size={24} color="#facc15" fill="#facc15" />
              </div>
              <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e5e7eb', padding: '16px 0' }}>
                {displayData.type === 'food' ? (
                  <Utensils size={20} color="#10b981" />
                ) : (
                  <Building2 size={20} color="#3b82f6" />
                )}
              </div>
              <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e5e7eb', padding: '16px 0' }}>
                {displayData.image ? (
                  <img src={displayData.image} alt={displayData.name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', background: '#fff', border: '1px solid #e5e7eb' }} />
                ) : (
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
                    {displayData.type === 'food' ? <Utensils size={16} color="#9ca3af" /> : <Building2 size={16} color="#9ca3af" />}
                  </div>
                )}
              </div>
              <div style={{ flex: 2, fontWeight: 700, fontSize: 17, padding: '16px 18px', borderRight: '1px solid #e5e7eb' }}>{displayData.name}</div>
              <div style={{ flex: 3, color: '#888', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRight: '1px solid #e5e7eb' }}>
                {displayData.type === 'food' ? (
                  <div>
                    <div>{displayData.description}</div>
                    <div style={{ color: '#10b981', fontWeight: 700 }}>₦{displayData.price}</div>
                  </div>
                ) : (
                  <div>
                    <div>{displayData.description}</div>
                    <div>{displayData.address}</div>
                  </div>
                )}
              </div>
              <div style={{ flex: 2, color: '#888', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRight: '1px solid #e5e7eb' }}>{formatDate(favorite.created_at)}</div>
              <div style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: 8, padding: '16px 18px' }}>
                <button 
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  style={{ 
                    background: '#fef2f2', 
                    color: '#dc2626', 
                    fontWeight: 600, 
                    fontSize: 14, 
                    border: '1px solid #fecaca', 
                    borderRadius: 8, 
                    padding: '8px 16px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Trash2 size={14} /> Remove
                </button>
                <button style={{ background: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: 15, border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>
                  Order Via WhatsApp
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
  </div>
);
};

export default UserFavourites; 