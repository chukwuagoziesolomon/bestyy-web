import React, { useEffect, useState } from 'react';
import { listMenuItems, deleteMenuItem, API_URL } from '../api';
import { showError, showSuccess } from '../toast';
import '../MenuPage.css';
import { useNavigate } from 'react-router-dom';

// Menu item type for fetched data
type MenuItem = {
  id: number;
  dish_name: string;
  price: string;
  image?: string;
  rating?: number;
  reviews?: number;
};

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    async function getMenuItems() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await listMenuItems(token);
          setMenuItems(data.menu_items || data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Could not fetch menu items');
      } finally {
        setLoading(false);
      }
    }
    getMenuItems();
  }, [token]);

  const handleEditClick = (id: number) => {
    navigate(`/dashboard/menu/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    if (!token) return showError('Not authenticated');
    setDeletingId(id);
    try {
      await deleteMenuItem(token, String(id));
      showSuccess('Menu item deleted');
      setMenuItems(items => items.filter(item => item.id !== id));
    } catch (err: any) {
      showError(err.message || 'Failed to delete menu item');
    } finally {
      setDeletingId(null);
    }
  };

  const getCorrectImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      return '/image1.png'; // Return a default placeholder if no image path is provided
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `${API_URL}${imagePath}`;
    }
    return '/image1.png';
  };

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', minHeight: '100vh', padding: '0 0 2rem 0' }}>
      <h2 style={{ fontWeight: 900, fontSize: 32, letterSpacing: 0.5, color: '#222', textAlign: 'left', marginLeft: 32, marginTop: 32, marginBottom: 0 }}>Menu</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '18px 32px 32px 32px' }}>
        <button
          style={{
            background: 'linear-gradient(90deg, #10b981 0%, #34e7e4 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            border: 'none',
            borderRadius: 8,
            padding: '12px 28px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #e5e7eb',
          }}
          onClick={() => navigate('/dashboard/menu/add')}
        >
          + Add Item
        </button>
      </div>
      {loading ? (
        <div style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 48 }}>Loading menu items...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', fontSize: 18, textAlign: 'center', marginTop: 48 }}>{error}</div>
      ) : (
        <div className="menu-grid">
          {menuItems.length === 0 ? (
            <div style={{ color: '#888', fontSize: 18, textAlign: 'center', width: '100%', gridColumn: '1/-1', marginTop: 48 }}>No menu items found.</div>
          ) : (
            menuItems.map((item) => (
              <div key={item.id} className="menu-card">
                <div className="menu-card__img-wrap">
                  <img src={getCorrectImageUrl(item.image)} alt={item.dish_name} className="menu-card__img" />
                  <button className="menu-card__heart">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
                <div className="menu-card__body">
                  <div className="menu-card__title">{item.dish_name}</div>
                  <div className="menu-card__price">₦ {parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="menu-card__rating">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} style={{ color: star <= (item.rating || 0) ? '#F59E42' : '#E5E7EB', fontSize: 18 }}>★</span>
                    ))}
                    <span className="menu-card__reviews">({item.reviews || 0})</span>
                  </div>
                  <div className="menu-card__actions-row">
                    <button className="menu-card__delete" onClick={() => handleDelete(item.id)} title="Delete" disabled={deletingId === item.id}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                    <button className="menu-card__edit" onClick={() => handleEditClick(item.id)} title="Edit">
                      Edit Item
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MenuPage; 