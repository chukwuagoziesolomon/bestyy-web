import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './VendorProfile.css';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const VendorProfile: React.FC = () => {
  // Match route param name in App.tsx: /vendor/:id
  const { id } = useParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);

  // Static vendor data
  const vendor = {
    id: id || '1',
    name: 'Burger Palace',
    rating: 4.8,
    totalRatings: 2341,
    // Use an appetizing hero image that exists in public/
    heroImage: '/1000121265.jpg',
    promoCode: 'BESTYY00',
    promoDiscount: '25% OFF'
  };

  // Static menu items
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with melted cheese, lettuce, tomato, onions, pickles and our special sauce on a toasted sesame bun.',
      price: 20000,
      image: '/1000121265.jpg',
      category: 'Burgers'
    },
    {
      id: '2',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with melted cheese, lettuce, tomato, onions, pickles and our special sauce on a toasted sesame bun.',
      price: 20000,
      image: '/1000121265.jpg',
      category: 'Burgers'
    },
    {
      id: '3',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with melted cheese, lettuce, tomato, onions, pickles and our special sauce on a toasted sesame bun.',
      price: 20000,
      image: '/1000121265.jpg',
      category: 'Burgers'
    },
    {
      id: '4',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with melted cheese, lettuce, tomato, onions, pickles and our special sauce on a toasted sesame bun.',
      price: 20000,
      image: '/1000121265.jpg',
      category: 'Burgers'
    },
    {
      id: '5',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with melted cheese, lettuce, tomato, onions, pickles and our special sauce on a toasted sesame bun.',
      price: 20000,
      image: '/1000121265.jpg',
      category: 'Burgers'
    },
    {
      id: '6',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with melted cheese, lettuce, tomato, onions, pickles and our special sauce on a toasted sesame bun.',
      price: 20000,
      image: '/1000121265.jpg',
      category: 'Burgers'
    }
  ];

  const categories = ['All', 'Burgers', 'Sandwiches', 'Pizzas', 'Salads', 'Pasta', 'Bowls', 'Drinks'];

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleWhatsAppCheckout = () => {
    const message = cartItems.length > 0
      ? `Hi! I'd like to order: ${cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ')} from ${vendor.name}. Total: ₦${getTotalPrice().toLocaleString()}`
      : `Hi! I'm interested in ordering from ${vendor.name}`;
    
    const whatsappUrl = `https://wa.me/19998887764?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="vendor-profile">
      {/* Header */}
      <header className="vendor-header">
        <div className="header-left">
          <div className="logo-section">
            <img src="/logo.png" alt="Bestyy Logo" className="header-logo" />
            <span className="location-text">Enugu, Nigeria</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-controls">
            <button className="control-btn desktop-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <button className="control-btn desktop-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button
              className="cart-btn mobile-only"
              onClick={() => setShowCartModal(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              )}
            </button>
            <div className="profile-picture">
              <img src="/user1.png" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="vendor-hero">
        <div className="hero-image">
          <img src={vendor.heroImage} alt={vendor.name} />
          <div className="promo-banner">
            <span>{vendor.promoDiscount} your first order with code {vendor.promoCode}</span>
          </div>
        </div>
        <div className="vendor-info">
          <h1 className="vendor-name">{vendor.name}</h1>
          <div className="vendor-rating">
            <div className="stars">
              <span>⭐</span>
              <span className="rating-number">{vendor.rating}</span>
              <span className="rating-count">({vendor.totalRatings})</span>
            </div>
          </div>
        </div>
      </section>

      <div className="vendor-content">
        {/* Menu Categories */}
        <nav className="menu-categories">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        <div className="main-content">
          {/* Menu Items */}
          <section className="menu-section">
            <div className="menu-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-content">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-footer">
                      <span className="item-price">₦ {item.price.toLocaleString()}</span>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cart Section */}
          <aside className="cart-section">
            <div className="cart-container">
              <div className="cart-content">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <div className="empty-cart-illustration" aria-hidden="true">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="60" cy="92" rx="32" ry="6" fill="#F3F4F6"/>
                        <path d="M30 72h60c0-11.046-8.954-20-20-20H50c-11.046 0-20 8.954-20 20z" fill="#F9FAFB" stroke="#E5E7EB"/>
                        <path d="M44 46a16 16 0 0 1 32 0" stroke="#E5E7EB" strokeWidth="2"/>
                        <circle cx="60" cy="68" r="2" fill="#E5E7EB"/>
                      </svg>
                    </div>
                    <p>No item has been added yet</p>
                    <p>Add item and checkout via WhatsApp</p>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="cart-item-details">
                          <h4 className="cart-item-name">{item.name}</h4>
                          <p className="cart-item-price">₦ {item.price.toLocaleString()}</p>
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                              className="quantity-btn increment"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="cart-total">
                      <div className="total-row">
                        <span>Total</span>
                        <strong>₦ {getTotalPrice().toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                )}
                {cartItems.length > 0 && (
                  <button 
                    className="whatsapp-checkout-btn"
                    onClick={handleWhatsAppCheckout}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Checkout via WhatsApp
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="vendor-footer">
        <div className="footer-content">
          <div className="footer-section locations">
            <h4>LOCATIONS <sup>4</sup></h4>
            <ul>
              <li>ENUGU 27</li>
              <li>ABUJA</li>
              <li>LAGOS</li>
              <li>PORTHARCOURT</li>
            </ul>
          </div>
          
          <div className="footer-section contact">
            <div className="contact-item">
              <span>+1 999 888-77-64</span>
            </div>
            <div className="contact-item">
              <span>hello@bestie.com</span>
            </div>
            <div className="contact-item">
              <span>Whatsapp</span>
            </div>
          </div>
          
          <div className="footer-section partners">
            <a href="#" className="partners-link">Become Partners</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          </div>
          
          <div className="footer-bottom-right">
            <a href="#privacy" className="privacy-link">Privacy</a>
            <span className="copyright">© 2025 — Copyright</span>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="cart-modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h2>Your Cart</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowCartModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="cart-modal-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart-modal">
                  <div className="empty-cart-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <h3>No item has been added yet</h3>
                  <p>Add item and checkout via WhatsApp</p>
                </div>
              ) : (
                <div className="cart-modal-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-modal-item">
                      <div className="cart-modal-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-modal-item-details">
                        <h4 className="cart-modal-item-name">{item.name}</h4>
                        <p className="cart-modal-item-price">₦ {item.price.toLocaleString()}</p>
                        <div className="cart-modal-quantity-controls">
                          <button
                            className="cart-modal-quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="cart-modal-quantity">{item.quantity}</span>
                          <button
                            className="cart-modal-quantity-btn increment"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className="cart-modal-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-modal-footer">
                <div className="cart-modal-total">
                  <div className="total-row">
                    <span>Total</span>
                    <strong>₦ {getTotalPrice().toLocaleString()}</strong>
                  </div>
                </div>
                <button
                  className="cart-modal-checkout-btn"
                  onClick={() => {
                    handleWhatsAppCheckout();
                    setShowCartModal(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Checkout on WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;