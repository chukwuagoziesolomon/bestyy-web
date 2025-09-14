import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './explore.css';
import { recommendationsApi, VendorRecommendation, RecommendationsResponse } from './services/recommendationsApi';
import { categoriesApi, Category } from './services/categoriesApi';
import { specialOffersApi as oldSpecialOffersApi, SpecialOffer as OldSpecialOffer } from './services/specialOffersApi';
import { specialOffersApiNew as specialOffersApi, SpecialOffer } from './services/specialOffersApiNew';
import NotificationBell from './components/NotificationBell';

const Explore: React.FC = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<VendorRecommendation[]>([]);
  const [recommendationsData, setRecommendationsData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [specialOffers, setSpecialOffers] = useState<OldSpecialOffer[]>([]);
  const [specialOffersNew, setSpecialOffersNew] = useState<SpecialOffer[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [specialOffersNewLoading, setSpecialOffersNewLoading] = useState(true);
  const [specialOffersNewError, setSpecialOffersNewError] = useState<string | null>(null);

  // Use actual backend data instead of dynamic/localStorage data
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [userLocation, setUserLocation] = useState('Lagos'); // Will be fetched from backend
  const [userProfile, setUserProfile] = useState(null); // Will be fetched from backend

  // Auto-rotate special offers every 5 seconds
  useEffect(() => {
    if (specialOffersNew.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === specialOffersNew.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [specialOffersNew.length]);

  const goToBanner = (index: number) => {
    if (index >= 0 && index < specialOffersNew.length) {
      setCurrentBannerIndex(index);
    }
  };

  const nextBanner = () => {
    if (specialOffersNew.length === 0) return;
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === specialOffersNew.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevBanner = () => {
    if (specialOffersNew.length === 0) return;
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? specialOffersNew.length - 1 : prevIndex - 1
    );
  };

  // Load recommendations from API
  const loadRecommendations = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await recommendationsApi.getRecommendations({
        category: selectedCategory,
        page,
        page_size: 20,
        city: userLocation
      });
      
      if (page === 1) {
        setRecommendations(data.recommendations);
      } else {
        // Append for pagination
        setRecommendations(prev => [...prev, ...data.recommendations]);
      }
      
      setRecommendationsData(data);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories from API
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoriesApi.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load special offers from API (legacy - keeping for compatibility)
  const loadSpecialOffers = async () => {
    try {
      setOffersLoading(true);
      const data = await oldSpecialOffersApi.getSpecialOffers();
      setSpecialOffers(data.offers);
    } catch (err) {
      console.error('Error loading special offers:', err);
    } finally {
      setOffersLoading(false);
    }
  };

  // Load special offers from API
  const loadSpecialOffersNew = async () => {
    try {
      setSpecialOffersNewLoading(true);
      setSpecialOffersNewError(null);
      
      const data = await specialOffersApi.getHomepageSpecialOffers(5);
      
      // Filter active special offers and sort by priority
      const activeOffers = specialOffersApi.filterActiveSpecialOffers(data);
      const sortedOffers = specialOffersApi.sortSpecialOffersByPriority(activeOffers);
      
      // Filter special offers based on user profile if available
      const userType = userProfile?.user_type;
      const isNewUser = userProfile?.created_at ? 
        (new Date().getTime() - new Date(userProfile.created_at).getTime()) < (30 * 24 * 60 * 60 * 1000) : false;
      
      const filteredOffers = specialOffersApi.filterSpecialOffersForUser(sortedOffers, userType, isNewUser);
      
      setSpecialOffersNew(filteredOffers);
    } catch (err) {
      console.error('Error loading special offers:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load special offers';
      setSpecialOffersNewError(errorMessage);
      setSpecialOffersNew([]);
    } finally {
      setSpecialOffersNewLoading(false);
    }
  };

  // Load user profile and location from backend
  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/user/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
        // Update location from user data if available
        if (userData.location) {
          setUserLocation(userData.location);
        }
      }
    } catch (err) {
      console.log('Could not load user profile:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    loadRecommendations(1);
    loadCategories();
    loadSpecialOffers();
    loadUserProfile();
    loadSpecialOffersNew();
  }, []);

  // Reload recommendations when category or location changes
  useEffect(() => {
    if (selectedCategory && userLocation) {
      loadRecommendations(1);
    }
  }, [selectedCategory, userLocation]);

  // Reload special offers when user profile changes (for target audience filtering)
  useEffect(() => {
    if (userProfile) {
      loadSpecialOffersNew();
    }
  }, [userProfile]);

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Reload recommendations for selected category
    loadRecommendations(1);
  };

  return (
    <div className="explore">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">b</span>
            </div>
          </div>
          <div className="location-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="location-pin">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="location-text">from {userLocation}, Nigeria</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="profile-section">
            <div className="profile-picture">
              <img 
                src={userProfile?.profile_image || userProfile?.avatar || "/profile-placeholder.jpg"} 
                alt="Profile" 
              />
            </div>
            <button className="menu-button">
              <div className="menu-icon">
                <div className="menu-line"></div>
                <div className="menu-line"></div>
                <div className="menu-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-main">
        {/* Explore Bestyy Section */}
        <section className="explore-section">
          <h1 className="explore-title">Explore Bestyy</h1>
          <div className="category-cards">
            <div className="category-card food-card" onClick={() => handleCategoryClick('Food')}>
              <div className="category-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4v11a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V11h4c1.1 0 2-.9 2-2V2H3z"/>
                  <path d="M8 11h8"/>
                  <path d="M12 7v4"/>
                </svg>
              </div>
              <span className="category-name">Food</span>
            </div>
            
            <div className="category-card flights-card" onClick={() => handleCategoryClick('Flights')}>
              <div className="category-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <span className="category-name">Flights</span>
            </div>
            
            <div className="category-card tickets-card" onClick={() => handleCategoryClick('Tickets')}>
              <div className="category-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
                  <path d="M13 5v2"/>
                  <path d="M13 17v2"/>
                  <path d="M13 11v2"/>
                </svg>
              </div>
              <span className="category-name">Tickets</span>
            </div>
          </div>
        </section>

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
            <p>
              Craving something delicious? Explore our curated selection of top-rated restaurants and food vendors. From local favorites to international cuisine, satisfy your taste buds with the best food deals in town!
            </p>
          </div>

          {/* Categories */}
          <div className="categories-section">
            {categoriesLoading ? (
              <div className="loading-state">
                <p>Loading categories...</p>
              </div>
            ) : (
              <div className="categories-scroll">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className={`category-item ${category.active ? 'active' : ''} ${!category.available ? 'coming-soon' : ''}`}
                    style={{
                      backgroundColor: category.bgColor,
                      borderColor: category.active ? category.borderColor : 'transparent'
                    }}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="category-icon">
                      <img src={category.icon} alt={category.name} className="category-icon-img" />
                    </div>
                    <span className="category-name">{category.name}</span>
                    {category.itemCount && category.itemCount > 0 && (
                      <span className="item-count">({category.itemCount})</span>
                    )}
                    {!category.available && (
                      <div className="coming-soon-badge">Coming Soon</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Special Offers Banner */}
          <div className="special-offers-container">
            {specialOffersNewLoading ? (
              <div className="loading-state">
                <p>Loading special offers...</p>
              </div>
            ) : specialOffersNewError ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3>Failed to Load Special Offers</h3>
                <p>{specialOffersNewError}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    className="retry-button"
                    onClick={loadSpecialOffersNew}
                  >
                    Retry API
                  </button>
                  {specialOffers.length > 0 && (
                    <button 
                      className="retry-button"
                      onClick={() => {
                        setSpecialOffersNewError(null);
                        // Use old special offers as fallback
                        setSpecialOffersNew(specialOffers.map(offer => ({
                          id: offer.id,
                          title: offer.title,
                          description: offer.subtitle,
                          banner_image: offer.image,
                          banner_type: 'homepage' as const,
                          status: offer.isActive ? 'active' as const : 'inactive' as const,
                          priority: 5,
                          click_url: '',
                          target_audience: ['all_users'],
                          display_start_date: offer.startDate || new Date().toISOString(),
                          display_end_date: offer.endDate || null,
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                          is_active: offer.isActive
                        })));
                      }}
                      style={{ background: '#059669' }}
                    >
                      Use Fallback
                    </button>
                  )}
                </div>
                <p className="fallback-note">
                  <small>Backend server may not be running. Check console for details.</small>
                </p>
              </div>
            ) : specialOffersNew.length > 0 && specialOffersNew[currentBannerIndex] ? (
              <>
                <div 
                  className="weekend-banner full-image-banner"
                  style={{
                    backgroundImage: `url(${specialOffersNew[currentBannerIndex].banner_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                  onClick={() => {
                    if (specialOffersNew[currentBannerIndex].click_url) {
                      window.open(specialOffersNew[currentBannerIndex].click_url, '_blank');
                    }
                  }}
                >
                  <div className="banner-overlay"></div>
                  <div className="banner-content">
                    <h2>{specialOffersNew[currentBannerIndex].title}</h2>
                    <p>{specialOffersNew[currentBannerIndex].description}</p>
                    {specialOffersNew[currentBannerIndex].click_url && (
                      <button className="view-offers-btn">View Details</button>
                    )}
                  </div>
                </div>

                {specialOffersNew.length > 1 && (
                  <div className="banner-controls">
                    <button className="banner-nav-btn prev-btn" onClick={prevBanner}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                    
                    <div className="banner-dots">
                      {specialOffersNew.map((_, index) => (
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
                )}
              </>
            ) : (
              <div className="no-offers">
                <p>No special offers available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Section */}
        <section className="featured-section">
          <h2 className="featured-title">Featured</h2>
          {loading && (
            <div className="loading-state">
              <p>Loading recommendations...</p>
            </div>
          )}
          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => loadRecommendations(1)}>Retry</button>
            </div>
          )}
          {!loading && !error && (
            <>
              <div className="featured-grid">
                {recommendations.map((vendor, index) => {
                  // Check if this is the first non-featured vendor (to add separator)
                  const isFirstNonFeatured = !vendor.is_featured && 
                    (index === 0 || recommendations[index - 1].is_featured);
                  
                  return (
                    <React.Fragment key={vendor.id}>
                      {isFirstNonFeatured && (
                        <div className="section-separator">
                          <div className="separator-line"></div>
                          <span className="separator-text">Other Recommendations</span>
                          <div className="separator-line"></div>
                        </div>
                      )}
                      <Link to={`/vendor/${vendor.id}`} className="featured-card-link">
                        <div className="featured-card">
                          {vendor.is_featured && <div className="featured-badge">FEATURED</div>}
                          <div className="card-image">
                            <img 
                              src={vendor.logo} 
                              alt={vendor.business_name}
                              onError={(e) => {
                                // Fallback to thumbnail if main logo fails
                                const target = e.target as HTMLImageElement;
                                target.src = vendor.logo_thumbnail;
                              }}
                            />
                          </div>
                          <div className="card-content">
                            <h3 className="vendor-name">{vendor.business_name}</h3>
                            <div className="delivery-info">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="clock-icon">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12,6 12,12 16,14"/>
                              </svg>
                              <span className="delivery-time">{vendor.delivery_time}</span>
                            </div>
                            <div className="category-tag">
                              <span className="tag-icon">▲</span>
                              <span className="tag-text">{vendor.business_category}</span>
                            </div>
                            <div className="price-section">
                              <span className="price">₦ {vendor.is_featured ? '7000' : '5000'}</span>
                              <button className="add-to-cart">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                  <line x1="3" y1="6" x2="21" y2="6"/>
                                  <path d="M16 10a4 4 0 0 1-8 0"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </React.Fragment>
                  );
                })}
              </div>
              {recommendationsData?.has_next && (
                <button 
                  className="view-more-btn"
                  onClick={() => loadRecommendations(recommendationsData.next_page || 1)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'View more'}
                </button>
              )}
            </>
          )}
        </section>
      </main>

      {/* Mobile Footer */}
      <footer className="mobile-footer">
        <div className="footer-links">
          <a href="#home" className="footer-link">HOME⁴</a>
          <a href="#how-it-works" className="footer-link">HOW IT WORKS²⁷</a>
          <a href="#features" className="footer-link">FEATURES</a>
          <a href="#faq" className="footer-link">FAQ'S</a>
        </div>
        
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">Whatsapp</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="external-link">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
          <div className="contact-item">
            <span className="contact-label">+1 999 888-77-64</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">hello@bestie.com</span>
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
          <div className="footer-bottom-links">
            <a href="#privacy" className="footer-bottom-link">Privacy</a>
            <span className="copyright">© 2025 - Copyright</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Explore;
