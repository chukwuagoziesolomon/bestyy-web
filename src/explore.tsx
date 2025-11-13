import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ExploreDesktop.css';
import './ExploreMobile.css';
import Footer from './Footer';
import { recommendationsApi, VendorRecommendation, RecommendationsResponse } from './services/recommendationsApi';

const Explore: React.FC = () => {
  // State for user location and profile
  const [userLocation, setUserLocation] = useState<string>('Lagos');
  const userProfile = null;

  // State for recommendations functionality
  const [recommendations, setRecommendations] = useState<VendorRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initial load - fetch all vendors
  useEffect(() => {
    fetchInitialResults();
  }, []);

  // Search effect - debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm.trim());
      } else {
        fetchInitialResults();
      }
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm]);

  const fetchInitialResults = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(false);

      const response: RecommendationsResponse = await recommendationsApi.getRecommendations({
        city: userLocation,
        limit: 20
      });

      if (response.success) {
        setRecommendations(response.recommendations);
      } else {
        setError('Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching initial results:', err);
      setError('Unable to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      setIsSearching(true);
      setError(null);

      const response: RecommendationsResponse = await recommendationsApi.getRecommendations({
        city: userLocation,
        limit: 20,
        category: query // Add search query as category filter
      });

      if (response.success) {
        setRecommendations(response.recommendations);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Use recommendations directly (they are already vendor recommendations)
  const vendorResults = recommendations;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="explore-page">
      {/* Top Header */}
      <header className="explore-header">
        <div className="header-left">
          <div className="logo-section">
            <img src="/logo.png" alt="Bestyy Logo" className="header-logo" />
            <span className="location-text">{userLocation}, Nigeria</span>
          </div>
        </div>
        
        <div className="header-center">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder={isSearching ? "Searching..." : "Search for restaurants, dishes..."}
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
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

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Loading amazing restaurants...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <div className="error-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="error-icon">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={() => fetchInitialResults()}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State - No vendors at all */}
        {!loading && !error && vendorResults.length === 0 && !searchTerm && (
          <div className="empty-state">
            <div className="empty-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
                <path d="M3 2v7h.01M21 15v7h-.01M12 2v20M3 9l9-7 9 7M9 22V12h6v10"/>
              </svg>
              <h3>No restaurants available</h3>
              <p>It looks like no restaurants are currently available in your area.</p>
              <button className="retry-button" onClick={() => fetchInitialResults()}>
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        {!loading && !error && vendorResults.length > 0 && (
          <div className="featured-grid">
            {vendorResults.map((vendor) => (
              <Link to={`/vendor/${vendor.id}`} key={vendor.id} className="featured-card" onClick={() => console.log('Clicked vendor:', vendor.id)}>
                {vendor.is_featured && (
                  <div className="featured-badge">FEATURED</div>
                )}
                <div className="card-image">
                  <img
                    src={vendor.food_images?.[0]?.image ? `${process.env.REACT_APP_API_URL}${vendor.food_images[0].image}` : (vendor.logo ? `${process.env.REACT_APP_API_URL}${vendor.logo}` : "/placeholder-vendor.jpg")}
                    alt={vendor.business_name || 'Vendor'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-vendor.jpg";
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3 className="vendor-name">{vendor.business_name || 'Unknown Vendor'}</h3>
                  {vendor.food_images?.[0]?.dish_name && (
                    <p className="dish-name">{vendor.food_images[0].dish_name}</p>
                  )}
                  <div className="rating-info">
                    <div className="stars">
                      {vendor.rating && vendor.rating > 0 ? (
                        <>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} style={{ color: i < Math.floor(vendor.rating) ? '#fbbf24' : '#e5e7eb' }}>
                              ⭐
                            </span>
                          ))}
                        </>
                      ) : (
                        <span>⭐⭐⭐⭐⭐</span>
                      )}
                    </div>
                    <span className="rating-text">
                      {vendor.rating ? `${vendor.rating.toFixed(1)} (${vendor.total_reviews} reviews)` : 'No reviews yet'}
                    </span>
                  </div>
                  {vendor.delivery_time && (
                    <div className="rating-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="clock-icon">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <span className="rating-text">{vendor.delivery_time}</span>
                    </div>
                  )}
                  {vendor.business_category && (
                    <div className="category-tag">
                      <span className="tag-text">{vendor.business_category}</span>
                    </div>
                  )}
                  <div className="price-section">
                    <span className="price">
                      {vendor.food_images?.[0]?.price ? `₦ ${vendor.food_images[0].price.toLocaleString()}` : (vendor.offers_delivery ? 'Delivery available' : 'Pickup only')}
                    </span>
                  </div>
                  {vendor.distance && (
                    <div className="rating-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="location-icon">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span className="rating-text">{vendor.distance.toFixed(1)} km away</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View More Button */}
        {!loading && !error && vendorResults.length > 0 && (
          <div className="view-more-container">
            <button className="view-more-btn">View more</button>
          </div>
        )}

        {/* No Results State - Search returned no results */}
        {!loading && !error && vendorResults.length === 0 && searchTerm && (
          <div className="no-results-state">
            <div className="no-results-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="no-results-icon">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <line x1="8" y1="8" x2="16" y2="16"/>
              </svg>
              <h3>No restaurants found</h3>
              <p>We couldn't find any restaurants matching "{searchTerm}"</p>
              <button className="retry-button" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Explore;
