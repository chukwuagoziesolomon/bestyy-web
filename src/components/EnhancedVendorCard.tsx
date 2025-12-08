// Enhanced Vendor Card Component with slideshow support
import React from 'react';
import { EnhancedVendorRecommendation, SlideshowImage } from '../services/enhancedRecommendationsApi';
import { useVendorSlideshow } from '../hooks/useEnhancedRecommendations';
import './EnhancedVendorCard.css';

interface EnhancedVendorCardProps {
  vendor: EnhancedVendorRecommendation;
  onClick?: (vendor: EnhancedVendorRecommendation) => void;
  showSlideshow?: boolean;
  showMetrics?: boolean;
  className?: string;
}

const EnhancedVendorCard: React.FC<EnhancedVendorCardProps> = ({
  vendor,
  onClick,
  showSlideshow = false,
  showMetrics = false,
  className = ''
}) => {
  const slideshow = useVendorSlideshow(vendor);

  const handleCardClick = () => {
    if (onClick) {
      onClick(vendor);
    }
  };

  const handleSlideshowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderSlideshow = () => {
    // Debug: Check if slideshow data exists
    if (process.env.NODE_ENV === 'development') {
      console.log('Vendor slideshow data:', vendor.business_name, vendor.slideshow);
    }
    
    // Always show slideshow if images exist, otherwise show single image
    const hasValidSlideshow = vendor.slideshow?.images && vendor.slideshow.images.length > 0;
    
    if (!hasValidSlideshow) {
      return (
        <div className="vendor-image">
          <img 
            src={vendor.cover_image || vendor.logo} 
            alt={vendor.business_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.currentTarget.src = vendor.logo;
            }}
          />
        </div>
      );
    }

    return (
      <div 
        className="vendor-slideshow" 
        onClick={handleSlideshowClick}
        onMouseEnter={slideshow.pause}
        onMouseLeave={slideshow.resume}
      >
        <div className="slideshow-container">
          <div className="slideshow-images">
            {slideshow.currentImage && (
              <div className="slideshow-image">
                <img 
                  src={slideshow.currentImage.url} 
                  alt={slideshow.currentImage.title}
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = vendor.logo_thumbnail || vendor.logo;
                  }}
                />

              </div>
            )}
          </div>

          {slideshow.hasMultipleImages && (
            <>
              <button 
                className="slideshow-nav prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  slideshow.previousImage();
                }}
                aria-label="Previous image"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button 
                className="slideshow-nav next" 
                onClick={(e) => {
                  e.stopPropagation();
                  slideshow.nextImage();
                }}
                aria-label="Next image"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="slideshow-dots">
                {vendor.slideshow.images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === slideshow.currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      slideshow.goToImage(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {vendor.slideshow && (
          <div className="slideshow-info">
            <span className="item-count">
              {vendor.slideshow.meal_specific_items} of {vendor.slideshow.total_items} items
            </span>
            {slideshow.currentImage && (
              <span className="relevance-score">
                {slideshow.currentImage.relevance_score.toFixed(1)}% match
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMetrics = () => {
    if (!showMetrics || !vendor.attraction_metrics) {
      return null;
    }

    const metrics = vendor.attraction_metrics;

    return (
      <div className="vendor-metrics">
        <div className="metrics-header">
          <h4>Partnership Opportunity</h4>
          <span className="partnership-score">{metrics.partnership_score}%</span>
        </div>
        
        <div className="metrics-details">
          <div className="metric-item">
            <span className="metric-label">Revenue Potential:</span>
            <span className="metric-value">{metrics.revenue_potential}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Commission:</span>
            <span className="metric-value">{metrics.commission_rate}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Market Demand:</span>
            <span className={`metric-value demand-${metrics.growth_indicators.market_demand.toLowerCase()}`}>
              {metrics.growth_indicators.market_demand}
            </span>
          </div>
        </div>

        {metrics.onboarding_incentives.length > 0 && (
          <div className="incentives">
            <h5>Onboarding Benefits</h5>
            <ul>
              {metrics.onboarding_incentives.slice(0, 2).map((incentive, index) => (
                <li key={index}>{incentive}</li>
              ))}
              {metrics.onboarding_incentives.length > 2 && (
                <li>+{metrics.onboarding_incentives.length - 2} more benefits</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`enhanced-vendor-card ${className} ${vendor.is_open ? 'available' : 'unavailable'}`}
      onClick={handleCardClick}
    >
      {renderSlideshow()}
      
      {vendor.is_featured && (
        <div className="featured-badge">FEATURED</div>
      )}
      
      <div className="vendor-content">
        {/* Restaurant Name - Most Prominent */}
        <h3 className="vendor-name">{vendor.business_name}</h3>
        
        {/* Rating */}
        <div className="rating-row">
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < Math.floor(vendor.rating) ? 'star filled' : 'star empty'}>
                ⭐
              </span>
            ))}
          </div>
          <span className="rating-count">({vendor.total_reviews})</span>
        </div>
        
        {/* Category Tag */}
        {vendor.business_category && (
          <div className="category-badge">
            {vendor.business_category}
          </div>
        )}
        
        {/* Current Featured Dish (from slideshow) */}
        {slideshow.currentImage && (
          <div className="featured-dish">
            <p className="dish-name">{slideshow.currentImage.title}</p>
            <p className="dish-price">₦{slideshow.currentImage.price.toLocaleString()}</p>
          </div>
        )}
        
        {/* Delivery Info */}
        <div className="delivery-info">
          {vendor.delivery_time && (
            <span className="info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              {vendor.delivery_time}
            </span>
          )}
          <span className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            {vendor.offers_delivery ? 'Delivery' : 'Pickup only'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVendorCard;
