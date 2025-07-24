import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { listMenuItems, API_URL } from '../api';
import '../MenuPage.css';
import ProfileImage from '../components/ProfileImage';

const StockPage = () => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchMenuItems() {
      setLoading(true);
      try {
        if (token) {
          const data = await listMenuItems(token);
          setItems(data.menu_items || data || []);
        }
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, [token]);

  const handleToggle = (idx: number) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, inStock: !item.inStock } : item));
  };

  const getCorrectImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      return '/image1.png';
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
      {/* Main Content: Title, Add Button, Table Card */}
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ fontWeight: 900, fontSize: 32, letterSpacing: 0.5, color: '#222', margin: 0 }}>Item Stock</h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 28px', cursor: 'pointer' }}>
          <Plus size={20} /> Add new Item
        </button>
      </div>
      {/* Table Card */}
      <div className="dashboard-card" style={{ borderRadius: 16, padding: 0, maxWidth: 1200, margin: '0 auto', overflowX: 'auto', border: '1.5px solid #f3f4f6', boxShadow: '0 2px 16px #f3f4f6' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading menu items...</div>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 17, fontFamily: 'inherit' }}>
          <thead>
            <tr style={{ color: '#222', fontWeight: 800, background: '#fff' }}>
              <th style={{ padding: '24px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>Image</th>
              <th style={{ padding: '24px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>Dish Name</th>
              <th style={{ padding: '24px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>Description</th>
              <th style={{ padding: '24px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>Price</th>
              <th style={{ padding: '24px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>Category</th>
              <th style={{ padding: '24px 18px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>Stock Toggle</th>
              <th style={{ padding: '24px 18px', textAlign: 'center', fontWeight: 700, borderBottom: '1px solid #D1D5DB' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.filter(item => (item.dish_name || item.name || '').toLowerCase().includes(search.toLowerCase())).map((item, i, arr) => (
              <tr key={i} style={{ background: '#fff' }}>
                <td style={{ padding: '24px 18px', borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>
                  <img src={getCorrectImageUrl(item.image)} alt={item.dish_name || item.name} style={{ width: 54, height: 54, borderRadius: 12, objectFit: 'cover' }} />
                </td>
                <td style={{ padding: '24px 18px', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>{item.dish_name || item.name}</td>
                <td style={{ padding: '24px 18px', color: '#555', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>{item.item_description || item.description}</td>
                <td style={{ padding: '24px 18px', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>₦{parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '24px 18px', color: '#555', borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>{item.category}</td>
                <td style={{ padding: '24px 18px', textAlign: 'center', borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>
                  <label className="switch">
                    <input type="checkbox" checked={item.available_now ?? item.inStock} onChange={() => handleToggle(i)} />
                    <span className="slider"></span>
                  </label>
                </td>
                <td style={{ padding: '24px 18px', textAlign: 'center', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>
                  <button style={{ background: '#f8fafc', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: 6, marginRight: 8, cursor: 'pointer' }} title="Edit">
                    <Edit size={18} color="#10b981" />
                  </button>
                  <button style={{ background: '#f8fafc', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: 6, cursor: 'pointer' }} title="Delete">
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default StockPage; 