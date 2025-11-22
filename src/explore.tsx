import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExploreDesktop.css';
import './ExploreMobile.css';
import Footer from './Footer';
import PremiumLoadingAnimation from './components/PremiumLoadingAnimation';
import { recommendationsApi, VendorRecommendation, RecommendationsResponse } from './services/recommendationsApi';
import { vendorAutocompleteApi, VendorAutocompleteResult } from './services/vendorAutocompleteApi';
import { bannersApi, Banner } from './services/bannersApi';
import { getVendorProfileUrl } from './utils/urlUtils';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  
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
  
  // Autocomplete state
  const [autocompleteResults, setAutocompleteResults] = useState<VendorAutocompleteResult[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Banner slideshow state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);
  const [bannersLoading, setBannersLoading] = useState<boolean>(true);

  // Fetch banners function
  const fetchBanners = async () => {
    try {
      setBannersLoading(true);
      console.log('Starting to fetch banners...');
      
      // Fetch all active banners (not just promotional)
      const response = await bannersApi.getBanners({ limit: 10 });
      
      console.log('Banner API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Is Array:', Array.isArray(response));
      console.log('Response.banners:', response?.banners);
      console.log('Response.success:', response?.success);
      
      // Handle response - banners should be in response.banners after API conversion
      let bannersToSet = [];
      
      if (response && response.banners && Array.isArray(response.banners)) {
        console.log('Found banners in response.banners');
        // Filter for active banners only if is_active field exists
        bannersToSet = response.banners.filter(banner => 
          banner.is_active !== false // Show if is_active is true or undefined
        );
      } else if (Array.isArray(response)) {
        console.log('Response itself is an array');
        bannersToSet = response;
      }
      
      console.log('Final banners to set:', bannersToSet);
      setBanners(bannersToSet);
      
      if (bannersToSet.length === 0) {
        console.warn('No banners available after processing');
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      setBanners([]);
    } finally {
      setBannersLoading(false);
    }
  };

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

  // Initial load - fetch all vendors and banners
  useEffect(() => {
    fetchInitialResults();
    fetchBanners();
  }, []);

  // Banner auto-rotation effect
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Autocomplete search effect - debounced
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performAutocompleteSearch(searchTerm.trim());
      } else {
        setAutocompleteResults([]);
        setShowAutocomplete(false);
      }
    }, 300); // 300ms debounce for autocomplete

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm]);

  // Click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performAutocompleteSearch = async (query: string) => {
    try {
      setAutocompleteLoading(true);
      
      const response = await vendorAutocompleteApi.autocompleteSearch(query, {
        limit: 8,
        location: userLocation
      });

      if (response.success) {
        setAutocompleteResults(response.results);
        setShowAutocomplete(true);
      }
    } catch (err) {
      console.error('Autocomplete search error:', err);
      setAutocompleteResults([]);
    } finally {
      setAutocompleteLoading(false);
    }
  };

  const handleAutocompleteSelect = (vendor: VendorAutocompleteResult) => {
    setSearchTerm('');
    setShowAutocomplete(false);
    setAutocompleteResults([]);
    // Navigate to vendor profile page
    const vendorUrl = getVendorProfileUrl(vendor.business_name, vendor.id);
    navigate(vendorUrl);
  };

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm.trim()) {
      fetchInitialResults();
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      setShowAutocomplete(false);

      // Use autocomplete API for full search
      const response = await vendorAutocompleteApi.autocompleteSearch(searchTerm.trim(), {
        limit: 50,
        location: userLocation
      });

      if (response.success) {
        // Convert autocomplete results to recommendations format
        const convertedResults: VendorRecommendation[] = response.results.map(vendor => ({
          id: vendor.id,
          business_name: vendor.business_name,
          business_category: vendor.category,
          business_address: vendor.address,
          logo: vendor.logo || '',
          logo_thumbnail: vendor.logo || '',
          food_images: [],
          delivery_time: '30-45 mins',
          rating: 4.5,
          total_reviews: 0,
          is_featured: false,
          featured_priority: 0,
          recommendation_score: 0,
          offers_delivery: vendor.offers_delivery,
          service_areas: vendor.service_areas.split(',').map(s => s.trim()),
          opening_hours: vendor.opening_hours,
          closing_hours: vendor.closing_hours,
          is_open: true,
        }));
        
        setRecommendations(convertedResults);
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
        <div className="header-top">
          <div className="logo-location">
            <img src="/logo.png" alt="Bestyy Logo" className="header-logo" />
          </div>
          
          <div className="header-search" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder={isSearching ? "Searching..." : "Search for restaurants, dishes..."}
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (autocompleteResults.length > 0) {
                    setShowAutocomplete(true);
                  }
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setAutocompleteResults([]);
                    setShowAutocomplete(false);
                    fetchInitialResults();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showAutocomplete && (
            <div className="autocomplete-dropdown">
              {autocompleteLoading ? (
                <div className="autocomplete-loading">
                  <div className="loading-spinner-small"></div>
                  <span>Searching...</span>
                </div>
              ) : autocompleteResults.length > 0 ? (
                <>
                  {autocompleteResults.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="autocomplete-item"
                      onClick={() => handleAutocompleteSelect(vendor)}
                    >
                      {vendor.logo && (
                        <img 
                          src={vendor.logo} 
                          alt={vendor.business_name}
                          className="autocomplete-logo"
                          onError={(e) => {
                            e.currentTarget.src = '/logo.png';
                          }}
                        />
                      )}
                      <div className="autocomplete-details">
                        <h4 className="autocomplete-name">{vendor.business_name}</h4>
                        <p className="autocomplete-info">
                          {vendor.category} • {vendor.product_count} items
                        </p>
                        <p className="autocomplete-address">{vendor.address}</p>
                      </div>
                      {vendor.offers_delivery && (
                        <span className="delivery-badge">🚚 Delivery</span>
                      )}
                    </div>
                  ))}
                  {autocompleteResults.length >= 8 && (
                    <div className="autocomplete-footer" onClick={handleSearchSubmit}>
                      <span>View all results for "{searchTerm}"</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <div className="autocomplete-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <p>No restaurants found for "{searchTerm}"</p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </header>

      {/* Promotional Banner Slideshow */}
      {bannersLoading ? (
        <div className="banner-slideshow">
          <PremiumLoadingAnimation message="Loading banners..." />
        </div>
      ) : banners && banners.length > 0 ? (
        <div className="banner-slideshow">
          <div className="banner-container">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`banner-slide ${index === currentBannerIndex ? 'active' : ''}`}
                onClick={() => {
                  if (banner.click_url) {
                    if (banner.click_url.startsWith('http')) {
                      window.open(banner.click_url, '_blank');
                    } else {
                      navigate(banner.click_url);
                    }
                  }
                }}
                style={{ cursor: banner.click_url ? 'pointer' : 'default' }}
              >
                <img 
                  src={banner.image_url} 
                  alt={banner.title}
                  className="banner-image"
                />
                <div className="banner-content">
                  <h2 className="banner-title">{banner.title}</h2>
                  {banner.description && (
                    <p className="banner-description">{banner.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          {banners.length > 1 && (
            <div className="banner-dots">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`banner-dot ${index === currentBannerIndex ? 'active' : ''}`}
                  onClick={() => setCurrentBannerIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="banner-slideshow">
          <div className="banner-loading">No promotional banners available</div>
        </div>
      )}

      {/* Category Navigation */}
      <div className="category-nav">
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
      </div>

      {/* Featured Section */}
      <section className="featured-section">
        <h2 className="featured-title">Featured</h2>

        {/* Loading State */}
        {loading && (
          <PremiumLoadingAnimation message="Loading amazing restaurants..." />
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
              <Link to={getVendorProfileUrl(vendor.business_name, vendor.id)} key={vendor.id} className="featured-card" onClick={() => console.log('Clicked vendor:', vendor.id)}>
                {vendor.is_featured && (
                  <div className="featured-badge">FEATURED</div>
                )}
                <div className="card-image">
                  <img
                    src={
                      vendor.preview_image?.image ||
                      vendor.preview_image?.thumbnail ||
                      vendor.cover_image ||
                      vendor.food_images?.[0]?.image ||
                      vendor.logo ||
                      "/placeholder-vendor.jpg"
                    }
                    alt={vendor.preview_image?.dish_name || vendor.business_name || 'Vendor'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-vendor.jpg";
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3 className="vendor-name">{vendor.business_name || 'Unknown Vendor'}</h3>
                  {(vendor.preview_image?.dish_name || vendor.food_images?.[0]?.dish_name) && (
                    <p className="dish-name">{vendor.preview_image?.dish_name || vendor.food_images[0].dish_name}</p>
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
                      {(vendor.preview_image?.price || vendor.food_images?.[0]?.price) ? 
                        `₦ ${(vendor.preview_image?.price || vendor.food_images[0].price).toLocaleString()}` : 
                        (vendor.offers_delivery ? 'Delivery available' : 'Pickup only')
                      }
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
