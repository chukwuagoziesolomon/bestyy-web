import React from 'react';
import { Link } from 'react-router-dom';
import './ExploreDesktop.css';
import './ExploreMobile.css';
import Footer from './Footer';

const Explore: React.FC = () => {
  // State for user location and profile
  const userLocation = 'Enugu';
  const userProfile = null;

  return (
    <div className="explore-page">
      {/* Top Header */}
      <header className="explore-header">
        <div className="header-left">
          <div className="logo-section">
            <img src="/logo.png" alt="Bestyy Logo" className="header-logo" />
            <span className="location-text">Enugu, Nigeria</span>
          </div>
        </div>
        
        <div className="header-center">
          <h1 className="main-title">Explore Bestyy</h1>
        </div>
        
        <div className="header-right">
          <div className="header-controls">
            <button className="control-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <button className="control-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="profile-picture">
              <img 
                src={userProfile?.profile_image || userProfile?.avatar || "/user1.png"} 
                alt="Profile" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="category-navigation">
        <div className="category-list">
          <div className="category-item active">
            <div className="category-icon">
              <img src="/food.png" alt="Food" className="category-image" />
            </div>
            <span className="category-name">Food</span>
          </div>

          <div className="category-item coming-soon">
            <div className="category-icon">
              <img src="/plane.png" alt="Flights" className="category-image" />
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
            <span className="category-name">Flights</span>
          </div>

          <div className="category-item coming-soon">
            <div className="category-icon">
              <img src="/ticket.png" alt="Tickets" className="category-image" />
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
            <span className="category-name">Tickets</span>
          </div>

          {/* Additional categories for desktop */}
          <div className="category-item coming-soon desktop-only">
            <div className="category-icon">
              <img src="/house.png" alt="Shortlet" className="category-image" />
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
            <span className="category-name">Shortlet</span>
          </div>

          <div className="category-item coming-soon desktop-only">
            <div className="category-icon">
              <img src="/house.png" alt="Hotels" className="category-image" />
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
            <span className="category-name">Hotels</span>
          </div>

          <div className="category-item coming-soon desktop-only">
            <div className="category-icon">
              <img src="/Airbnb.png" alt="Airbnb" className="category-image" />
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
            <span className="category-name">Airbnb</span>
          </div>

          <div className="category-item desktop-only">
            <div className="category-icon">
              <img src="/food.png" alt="Services" className="category-image" />
            </div>
            <span className="category-name">Services</span>
          </div>
        </div>
      </nav>

      {/* Promotional Banner */}
      <section className="promotional-banner">
        <div className="banner-slideshow">
          <div className="banner-container">
            <div className="banner-slide active">
              <div className="banner-overlay"></div>
              <div className="banner-text">
                <h2>Weekend Getaway Special</h2>
                <p>Exclusive shortlet deals for your weekend</p>
                <button className="view-offers-btn">View Offers</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <h2 className="featured-title">Featured</h2>

        <div className="featured-grid">
          <Link to="/vendor/1" className="featured-card">
            <div className="featured-badge">FEATURED</div>
            <div className="card-image">
              <img src="/pizza1.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <span className="rating-text">5 Fast</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/2" className="featured-card">
            <div className="featured-badge">FEATURED</div>
            <div className="card-image">
              <img src="/pizza2.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <span className="rating-text">5 Fast</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/3" className="featured-card">
            <div className="featured-badge">FEATURED</div>
            <div className="card-image">
              <img src="/pizza3.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="clock-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className="rating-text">30-40 min</span>
              </div>
              <div className="category-tag">
                <span className="tag-text">🍕 Pizza</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/4" className="featured-card">
            <div className="card-image">
              <img src="/pizza4.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="clock-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className="rating-text">30-40 min</span>
              </div>
              <div className="category-tag">
                <span className="tag-text">🍕 Pizza</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/5" className="featured-card">
            <div className="card-image">
              <img src="/pizza5.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <span className="rating-text">5 Fast</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/6" className="featured-card">
            <div className="card-image">
              <img src="/pizza6.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <span className="rating-text">5 Fast</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/7" className="featured-card">
            <div className="card-image">
              <img src="/pizza7.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <span className="rating-text">5 Fast</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/8" className="featured-card">
            <div className="card-image">
              <img src="/pizza8.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <span className="rating-text">5 Fast</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>

          <Link to="/vendor/9" className="featured-card">
            <div className="card-image">
              <img src="/pizza9.jpg" alt="Galaxy Pizza Lagos" />
            </div>
            <div className="card-content">
              <h3 className="vendor-name">Galaxy Pizza Lagos</h3>
              <div className="rating-info">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <span className="rating-text">5 Fast</span>
              </div>
              <div className="price-section">
                <span className="price">₦ 7000</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="view-more-container">
          <button className="view-more-btn">View more</button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Explore;
