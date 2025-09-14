import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard: React.FC = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const categories = [
    { name: 'Food', icon: '/food.png', active: true, bgColor: '#fef2f2', borderColor: '#ef4444', available: true },
    { name: 'Flights', icon: '/plane.png', active: false, bgColor: '#f0fdf4', borderColor: '#10b981', available: false },
    { name: 'Tickets', icon: '/ticket.png', active: false, bgColor: '#faf5ff', borderColor: '#8b5cf6', available: false },
    { name: 'Shortlet', icon: '/house.png', active: false, bgColor: '#f9fafb', borderColor: '#6b7280', available: false },
    { name: 'Hotels', icon: '/house.png', active: false, bgColor: '#faf5ff', borderColor: '#8b5cf6', available: false },
    { name: 'Airbnb', icon: '/Airbnb.png', active: false, bgColor: '#f0fdf4', borderColor: '#10b981', available: false },
    { name: 'Service', icon: '/food.png', active: false, bgColor: '#fef2f2', borderColor: '#ef4444', available: false }
  ];

  const specialOffers = [
    {
      id: 1,
      title: "Weekend Getaway Special",
      subtitle: "Exclusive shortlet deals for your weekend",
      buttonText: "View Offers",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop",
      bgGradient: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
      borderColor: "#10b981"
    },
    {
      id: 2,
      title: "Food Festival 2024",
      subtitle: "Taste the best local cuisines with 30% off",
      buttonText: "Order Now",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop",
      bgGradient: "linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)",
      borderColor: "#ef4444"
    },
    {
      id: 3,
      title: "Travel Deals",
      subtitle: "Book your next adventure with amazing discounts",
      buttonText: "Explore",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop",
      bgGradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      borderColor: "#0ea5e9"
    }
  ];

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === specialOffers.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [specialOffers.length]);

  const goToBanner = (index: number) => {
    setCurrentBannerIndex(index);
  };

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === specialOffers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? specialOffers.length - 1 : prevIndex - 1
    );
  };

  const featuredItems = [
    { id: 1, name: 'Galaxy Pizza Lagos', time: '30-40 min', tag: 'Pizza', price: '₦7000', featured: true },
    { id: 2, name: 'Burger Palace', time: '15-25 min', tag: 'Burgers', price: '₦5000', featured: false },
    { id: 3, name: 'Sushi Master', time: '20-30 min', tag: 'Japanese', price: '₦12000', featured: true },
    { id: 4, name: 'Taco Fiesta', time: '10-20 min', tag: 'Mexican', price: '₦3500', featured: false },
    { id: 5, name: 'Pasta Corner', time: '25-35 min', tag: 'Italian', price: '₦8000', featured: true },
    { id: 6, name: 'Curry House', time: '20-30 min', tag: 'Indian', price: '₦6000', featured: false }
  ];

  return (
    <div className="user-dashboard">
      {/* Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <div className="logo-section">
            <img src="/logo.png" alt="Bestyy Logo" className="navbar-logo-img" />
            <div className="location-section">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="location-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="location-text">Enugu, Nigeria</span>
            </div>
          </div>
        </div>
        
        <div className="navbar-right">
          <div className="user-controls">
            <button className="control-btn dark-mode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
            </button>
            <button className="control-btn notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="profile-picture">
              <img src="/profile-placeholder.jpg" alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-header">
            <h1>Explore Bestyy</h1>
            <div className="menu-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div className="hero-description">
            <p>🍽️ Craving something delicious? Explore our curated selection of top-rated restaurants and food vendors. From local favorites to international cuisine, satisfy your taste buds with the best food deals in town!</p>
          </div>

          {/* Categories */}
          <div className="categories-section">
            <div className="categories-scroll">
              {categories.map((category, index) => (
                <div 
                  key={index} 
                  className={`category-item ${category.active ? 'active' : ''} ${!category.available ? 'coming-soon' : ''}`}
                  style={{
                    backgroundColor: category.bgColor,
                    borderColor: category.active ? category.borderColor : 'transparent'
                  }}
                >
                  <div className="category-icon">
                    <img src={category.icon} alt={category.name} className="category-icon-img" />
                  </div>
                  <span className="category-name">{category.name}</span>
                  {!category.available && (
                    <span className="coming-soon-badge">Coming Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Offers Banner */}
          <div className="special-offers-container">
            <div 
              className="weekend-banner full-image-banner"
              style={{
                backgroundImage: `url(${specialOffers[currentBannerIndex].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="banner-overlay"></div>
              <div className="banner-content">
                <h2>{specialOffers[currentBannerIndex].title}</h2>
                <p>{specialOffers[currentBannerIndex].subtitle}</p>
                <button className="view-offers-btn">{specialOffers[currentBannerIndex].buttonText}</button>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="banner-controls">
              <button className="banner-nav-btn prev-btn" onClick={prevBanner}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <div className="banner-dots">
                {specialOffers.map((_, index) => (
                  <button
                    key={index}
                    className={`banner-dot ${index === currentBannerIndex ? 'active' : ''}`}
                    onClick={() => goToBanner(index)}
                  />
                ))}
              </div>
              
              <button className="banner-nav-btn next-btn" onClick={nextBanner}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="featured-section">
          <h2>Featured</h2>
          <div className="featured-grid">
            {featuredItems.map((item, index) => (
              <Link key={index} to={`/vendor/${item.id}`} className="featured-card-link">
                <div className="featured-card">
                  {item.featured && <div className="featured-badge">FEATURED</div>}
                  <div className="card-image">
                    <img src={`https://images.unsplash.com/photo-${1568901346375 + index}?w=400&h=300&fit=crop`} alt={item.name} />
                  </div>
                  <div className="card-content">
                    <h3>{item.name}</h3>
                    <p className="delivery-time">{item.time}</p>
                    <div className="card-footer">
                      <span className="item-tag">{item.tag}</span>
                      <span className="item-price">{item.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button className="view-more-btn">View more</button>
        </section>
      </main>

    </div>
  );
};

export default UserDashboard;
