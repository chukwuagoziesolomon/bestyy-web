import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AddToCartModal from './AddToCartModal';
import GuestCheckoutModal, { GuestInfo } from './components/GuestCheckoutModal';
import './VendorProfile.css';
import { vendorProfileApi } from './services/vendorProfileApi';
import type { VendorProfile as VendorProfileType, MenuCategory, MenuItem, ReviewsData, VendorStats } from './services/vendorProfileApi';

const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showGuestCheckout, setShowGuestCheckout] = useState(false);
  
  // API state
  const [vendor, setVendor] = useState<VendorProfileType | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load vendor profile data
  const loadVendorProfile = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await vendorProfileApi.getVendorProfile(parseInt(id));
      
      if (data.success) {
        setVendor(data.vendor);
        setMenuCategories(data.menu_categories);
        setReviews(data.reviews);
        setStats(data.stats);
        
        // Set initial active category to first available category
        if (data.menu_categories.length > 0) {
          setActiveCategory(data.menu_categories[0].category);
        }
      }
    } catch (err) {
      setError('Failed to load vendor profile');
      console.error('Error loading vendor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadVendorProfile();
  }, [id]);

  // Get categories from API data
  const categories = ['All', ...menuCategories.map(cat => cat.category)];

  // Get filtered menu items based on active category
  const getFilteredMenuItems = (): MenuItem[] => {
    if (activeCategory === 'All') {
      return menuCategories.flatMap(category => category.items);
    }
    
    const category = menuCategories.find(cat => cat.category === activeCategory);
    return category ? category.items : [];
  };

  const menuItems = getFilteredMenuItems();

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item: any, quantity: number, customizations: any) => {
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      ...item,
      quantity,
      customizations,
      totalPrice: item.price * quantity
    };
    
    setCartItems(prev => [...prev, cartItem]);
    setIsModalOpen(false);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
        : item
    ));
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleGuestCheckout = (guestInfo: GuestInfo) => {
    // Store guest info and cart data in localStorage for the payment page
    const orderData = {
      guestInfo,
      cartItems,
      vendor: {
        id: vendor?.id,
        business_name: vendor?.business_name,
        business_address: vendor?.business_address
      },
      total: calculateCartTotal() + 500, // Add delivery fee
      deliveryFee: 500
    };
    
    localStorage.setItem('guestOrderData', JSON.stringify(orderData));
    
    // Navigate to payment page
    navigate('/payment', { 
      state: { 
        isGuestOrder: true,
        orderData 
      } 
    });
  };

  const handleCheckoutClick = () => {
    setShowGuestCheckout(true);
  };

  if (loading) {
    return (
      <div className="vendor-profile">
        <div className="loading-state">
          <p>Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="vendor-profile">
        <div className="error-state">
          <p>{error || 'Vendor not found'}</p>
          <button onClick={loadVendorProfile}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-profile">
      {/* Main Content */}
      <div className="vendor-main-content">
        {/* Left Content Area */}
        <div className="vendor-content">
          {/* Restaurant Banner */}
          <div className="restaurant-banner">
            <img src={vendor.banner_image} alt={vendor.business_name} />
            <div className="banner-overlay">
              <div className="restaurant-info">
                <h1>{vendor.business_name}</h1>
                <div className="restaurant-details">
                  <div className="rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>{vendor.rating} ({vendor.total_reviews})</span>
                  </div>
                  <div className="delivery-time">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    <span>{vendor.delivery_time}</span>
                  </div>
                  <div className={`status ${vendor.is_open ? 'open' : 'closed'}`}>
                    {vendor.is_open ? 'Open' : 'Closed'}
                  </div>
                </div>
              </div>
            </div>
            {vendor.is_featured && (
              <div className="promo-badge">
                <span>Featured Vendor</span>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="about-section">
            <h2>About {vendor.business_name}</h2>
            <div className="about-content">
              <div className="about-text">
                <p>{vendor.business_description}</p>
                <div className="vendor-meta">
                  <div className="meta-item">
                    <strong>Address:</strong> {vendor.business_address}
                  </div>
                  <div className="meta-item">
                    <strong>Hours:</strong> {vendor.opening_hours} - {vendor.closing_hours}
                  </div>
                  <div className="meta-item">
                    <strong>Price Range:</strong> ₦{vendor.price_range.min} - ₦{vendor.price_range.max}
                  </div>
                  <div className="meta-item">
                    <strong>Delivery:</strong> {vendor.offers_delivery ? 'Available' : 'Pickup Only'}
                  </div>
                  {vendor.service_areas.length > 0 && (
                    <div className="meta-item">
                      <strong>Service Areas:</strong> {vendor.service_areas.join(', ')}
                    </div>
                  )}
                </div>
                <div className="about-features">
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Fresh Ingredients</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Quality Assured</span>
                  </div>
                </div>
              </div>
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">{vendor.rating}</div>
                  <div className="stat-label">Rating</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{vendor.total_reviews}</div>
                  <div className="stat-label">Reviews</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{vendor.delivery_time}</div>
                  <div className="stat-label">Delivery Time</div>
                </div>
                {stats && (
                  <div className="stat-item">
                    <div className="stat-number">{stats.years_in_business}</div>
                    <div className="stat-label">Years</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="category-navigation">
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
          </div>

          {/* Menu Items Grid */}
          <div className="menu-items-grid">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item-card" onClick={() => handleItemClick(item)}>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  {!item.available_now && (
                    <div className="unavailable-overlay">
                      <span>Unavailable</span>
                    </div>
                  )}
                  {item.is_vegetarian && (
                    <div className="vegetarian-badge">🌱 Veg</div>
                  )}
                  {item.is_spicy && (
                    <div className="spicy-badge">🌶️ Spicy</div>
                  )}
                </div>
                <div className="item-content">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="item-details">
                    <div className="item-prep-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      {item.preparation_time} min
                    </div>
                    {item.calories && (
                      <div className="item-calories">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                          <line x1="3" y1="6" x2="21" y2="6"/>
                          <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        {item.calories} cal
                      </div>
                    )}
                  </div>
                  <div className="item-price">₦{item.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Shopping Cart */}
        <div className="shopping-cart-sidebar">
          <div className="cart-content">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p>Your cart is empty</p>
                <small>Add items from the menu to get started</small>
              </div>
            ) : (
              <>
                <div className="cart-header">
                  <h3>Your Order</h3>
                  <span className="cart-count">{cartItems.length} items</span>
                </div>
                
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="cart-item-total">
                        ₦{item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-total">
                  <div className="total-line">
                    <span>Total</span>
                    <span>₦{calculateCartTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <button className="checkout-btn" onClick={handleCheckoutClick}>
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="vendor-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-text">
            <p>&copy; 2024 Bestyy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add to Cart Modal */}
      {selectedItem && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Guest Checkout Modal */}
      <GuestCheckoutModal
        isOpen={showGuestCheckout}
        onClose={() => setShowGuestCheckout(false)}
        onProceed={handleGuestCheckout}
        cartTotal={calculateCartTotal()}
        itemCount={cartItems.length}
      />
    </div>
  );
};

export default VendorProfile;