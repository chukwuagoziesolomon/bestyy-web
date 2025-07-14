import React from 'react';
import '../MenuPage.css';

const menuItems = [
  {
    name: 'Lagos Pizza',
    price: 4999,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=400&h=300&fit=crop',
    rating: 4,
    reviews: 131,
  },
  {
    name: 'Lagos Pizza',
    price: 4999,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=400&h=300&fit=crop',
    rating: 4,
    reviews: 131,
  },
  {
    name: 'Lagos Pizza',
    price: 4999,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=400&h=300&fit=crop',
    rating: 4,
    reviews: 131,
  },
  {
    name: 'Lagos Pizza',
    price: 4999,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=400&h=300&fit=crop',
    rating: 4,
    reviews: 131,
  },
  {
    name: 'Lagos Pizza',
    price: 4999,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=400&h=300&fit=crop',
    rating: 4,
    reviews: 131,
  },
  {
    name: 'Lagos Pizza',
    price: 4999,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=400&h=300&fit=crop',
    rating: 4,
    reviews: 131,
  },
];

const MenuPage = () => (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', minHeight: '100vh', padding: '0 0 2rem 0' }}>
    <h2 style={{ fontWeight: 900, fontSize: 32, marginBottom: 32, letterSpacing: 0.5, color: '#222', textAlign: 'left', marginLeft: 32, marginTop: 32 }}>Menu</h2>
    <div className="menu-grid">
      {menuItems.map((item, i) => (
        <div key={i} className="menu-card">
          <div className="menu-card__img-wrap">
            <img src={item.image} alt={item.name} className="menu-card__img" />
            <button className="menu-card__heart">
              <span role="img" aria-label="favorite">♡</span>
            </button>
          </div>
          <div className="menu-card__body">
            <div className="menu-card__title">{item.name}</div>
            <div className="menu-card__price">₦ {item.price.toLocaleString()}</div>
            <div className="menu-card__rating">
              {[1,2,3,4,5].map(star => (
                <span key={star} style={{ color: star <= item.rating ? '#F59E42' : '#E5E7EB', fontSize: 18 }}>★</span>
              ))}
              <span className="menu-card__reviews">({item.reviews})</span>
            </div>
            <button className="menu-card__edit">Edit Item</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MenuPage; 