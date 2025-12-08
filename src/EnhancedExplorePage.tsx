// Enhanced Explore Page Component with new recommendations API
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import EnhancedRecommendationsList from './components/EnhancedRecommendationsList';
import { EnhancedVendorRecommendation } from './services/enhancedRecommendationsApi';
import { useCurrentMealTime } from './hooks/useEnhancedRecommendations';
import { bannersApi, Banner } from './services/bannersApi';
import { vendorAutocompleteApi, VendorAutocompleteResult } from './services/vendorAutocompleteApi';
import { getVendorProfileUrl } from './utils/urlUtils';
import Footer from './Footer';
import PremiumLoadingAnimation from './components/PremiumLoadingAnimation';
import './EnhancedExplorePage.css';
import './ExploreDesktop.css';
import './ExploreMobile.css';

const EnhancedExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMealTime = useCurrentMealTime();

  // URL parameters
  const cityParam = searchParams.get('city') || 'Lagos';
  const slideshowParam = searchParams.get('slideshow') === 'true';
  const metricsParam = searchParams.get('metrics') === 'true';
  const mealFilterParam = searchParams.get('meal_filter') === 'true';

  // State
  const [city, setCity] = useState(cityParam);
  const [enableSlideshow, setEnableSlideshow] = useState(slideshowParam);
  const [showStartupMetrics, setShowStartupMetrics] = useState(metricsParam);
  const [filterByMealTime, setFilterByMealTime] = useState(mealFilterParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<VendorAutocompleteResult[]>([]);
  
  // Banner slideshow state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);
  const [bannersLoading, setBannersLoading] = useState<boolean>(true);

  // Nigerian cities
  const nigerianCities = [
    'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 
    'Kaduna', 'Jos', 'Ilorin', 'Onitsha', 'Warri', 'Aba', 'Calabar'
  ];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (city !== 'Lagos') params.set('city', city);
    if (enableSlideshow) params.set('slideshow', 'true');
    if (showStartupMetrics) params.set('metrics', 'true');
    if (filterByMealTime) params.set('meal_filter', 'true');
    
    setSearchParams(params);
  }, [city, enableSlideshow, showStartupMetrics, filterByMealTime, setSearchParams]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      setBannersLoading(true);
      try {
        const response = await bannersApi.getBanners({ limit: 5 });
        setBanners(response.banners || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Banner slideshow
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Search autocomplete
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length >= 2) {
        try {
          const response = await vendorAutocompleteApi.autocompleteSearch(searchTerm, { limit: 5 });
          setAutocompleteResults(response.results);
          setShowAutocomplete(true);
        } catch (error) {
          console.error('Search error:', error);
          setAutocompleteResults([]);
        }
      } else {
        setAutocompleteResults([]);
        setShowAutocomplete(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleVendorClick = (vendor: EnhancedVendorRecommendation) => {
    const profileUrl = getVendorProfileUrl(vendor.business_name, vendor.id);
    navigate(profileUrl);
  };

  const handleSearchResultClick = (result: VendorAutocompleteResult) => {
    const profileUrl = getVendorProfileUrl(result.business_name, result.id);
    navigate(profileUrl);
    setShowAutocomplete(false);
    setSearchTerm('');
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    // Clear search when city changes
    setSearchTerm('');
    setShowAutocomplete(false);
  };

  return (
    <div className="enhanced-explore-page">
      {/* Header Section */}
      <header className="explore-header">
        <div className="header-top">
          <div className="logo-location">
            <img src="/logo.png" alt="Bestyy Logo" className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
          </div>

          {/* Search Bar */}
          <div className="header-search">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="search-input-wrapper">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search restaurants, cuisine, or dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete Results */}
            {showAutocomplete && autocompleteResults.length > 0 && (
              <div className="autocomplete-dropdown">
                {autocompleteResults.map((result) => (
                  <div
                    key={result.id}
                    className="autocomplete-item"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <img src={result.logo || '/default-vendor.png'} alt={result.business_name} className="autocomplete-logo" />
                    <div className="autocomplete-details">
                      <h4 className="autocomplete-name">{result.business_name}</h4>
                      <p className="autocomplete-info">{result.category || 'Restaurant'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Promotional Banner Slideshow */}
      {bannersLoading ? (
        <div className="banner-section">
          <PremiumLoadingAnimation message="Loading banners..." />
        </div>
      ) : banners.length > 0 ? (
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
        <div className="banner-section">
          <div className="no-banners">No promotional banners available</div>
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
              <span className="coming-soon-badge">Soon</span>
            </div>
            <span className="category-name">Flights</span>
          </div>

          <div className="category-item coming-soon">
            <div className="category-icon">
              <img src="/ticket.png" alt="Tickets" className="category-image" />
              <span className="coming-soon-badge">Soon</span>
            </div>
            <span className="category-name">Tickets</span>
          </div>

          <div className="category-item coming-soon">
            <div className="category-icon">
              <img src="/house.png" alt="Shortlet" className="category-image" />
              <span className="coming-soon-badge">Soon</span>
            </div>
            <span className="category-name">Shortlet</span>
          </div>

          <div className="category-item coming-soon">
            <div className="category-icon">
              <img src="/hotel.png" alt="Hotels" className="category-image" />
              <span className="coming-soon-badge">Soon</span>
            </div>
            <span className="category-name">Hotels</span>
          </div>

          <div className="category-item coming-soon">
            <div className="category-icon">
              <img src="/airbnb.png" alt="Airbnb" className="category-image" />
              <span className="coming-soon-badge">Soon</span>
            </div>
            <span className="category-name">Airbnb</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="explore-main">
        <EnhancedRecommendationsList
          city={city}
          enableSlideshow={enableSlideshow}
          showStartupMetrics={showStartupMetrics}
          filterByMealTime={filterByMealTime}
          limit={12}
          onVendorClick={handleVendorClick}
          className="main-recommendations"
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EnhancedExplorePage;
