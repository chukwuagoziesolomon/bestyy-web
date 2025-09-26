import React from 'react';
import { Link } from 'react-router-dom';
import './ExploreDesktop.css';
import './ExploreMobile.css';

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
      <footer className="explore-footer">
        <div className="footer-navigation">
          <div className="footer-nav-links">
            <a href="#" className="footer-nav-link">HOME</a>
            <a href="#" className="footer-nav-link">HOW IT WORKS</a>
            <a href="#" className="footer-nav-link">FEATURES</a>
            <a href="#" className="footer-nav-link">FAQ'S</a>
          </div>
        </div>

        <div className="footer-contact">
          <div className="contact-item">
            <span>Whatsapp</span>
          </div>
          <div className="contact-item">
            <span>+1 999 888-77-64</span>
          </div>
          <div className="contact-item">
            <span>hello@bestie.com</span>
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

        {/* Desktop footer content */}
        <div className="footer-content desktop-only">
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
      </footer>
    </div>
  );
};

export default Explore;
