// Enhanced Recommendations List Component
import React, { useState, useEffect } from 'react';
import { Store, AlertCircle, RefreshCw, MapPin, Utensils } from 'lucide-react';
import EnhancedVendorCard from './EnhancedVendorCard';
import PremiumLoadingAnimation from './PremiumLoadingAnimation';
import { 
  useEnhancedRecommendations, 
  useCurrentMealTime, 
  useFilteredRecommendations 
} from '../hooks/useEnhancedRecommendations';
import { 
  EnhancedVendorRecommendation, 
  MealTime 
} from '../services/enhancedRecommendationsApi';
import './EnhancedRecommendationsList.css';

interface EnhancedRecommendationsListProps {
  city?: string;
  enableSlideshow?: boolean;
  showStartupMetrics?: boolean;
  filterByMealTime?: boolean;
  limit?: number;
  onVendorClick?: (vendor: EnhancedVendorRecommendation) => void;
  className?: string;
}

const EnhancedRecommendationsList: React.FC<EnhancedRecommendationsListProps> = ({
  city = 'Lagos',
  enableSlideshow = true,
  showStartupMetrics = false,
  filterByMealTime = false,
  limit = 10,
  onVendorClick,
  className = ''
}) => {
  const currentMealTime = useCurrentMealTime();
  const [selectedMealFilter, setSelectedMealFilter] = useState<MealTime | 'all'>('all');

  const { data, loading, error, refetch } = useEnhancedRecommendations({
    city,
    slideshow: enableSlideshow,
    vendor_benefits: showStartupMetrics,
    meal_time: 'auto',
    limit
  });

  const filteredData = useFilteredRecommendations(
    data?.recommendations || [], 
    filterByMealTime && selectedMealFilter !== 'all' ? selectedMealFilter : undefined
  );

  const handleMealFilterChange = (mealTime: MealTime | 'all') => {
    setSelectedMealFilter(mealTime);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className={`enhanced-recommendations-list loading ${className}`}>
        <PremiumLoadingAnimation message="Finding the best restaurants for you..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`enhanced-recommendations-list error ${className}`}>
        <div className="error-message">
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h3>Unable to load recommendations</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            <RefreshCw size={16} style={{ marginRight: '8px' }} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.recommendations.length) {
    return (
      <div className={`enhanced-recommendations-list empty ${className}`}>
        <div className="empty-message">
          <Store size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
          <h3>No restaurants found</h3>
          <p>No restaurants are currently available in your area. Try a different city or check back later.</p>
          <button onClick={handleRefresh} className="refresh-button">
            <RefreshCw size={16} style={{ marginRight: '8px' }} />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Filter out vendors with name or category 'Airbnb'
  const rawRecommendations = filterByMealTime ? filteredData.recommendations : data.recommendations;
  const displayRecommendations = rawRecommendations.filter(
    vendor =>
      vendor.business_name?.toLowerCase() !== 'airbnb' &&
      vendor.business_category?.toLowerCase() !== 'airbnb'
  );

  return (
    <div className={`enhanced-recommendations-list ${className}`}>
      <div className="recommendations-header">
        <div className="header-main">
          <h2>
            {data.current_meal_time === 'breakfast' && 'Breakfast Recommendations'}
            {data.current_meal_time === 'lunch' && 'Lunch Recommendations'}
            {data.current_meal_time === 'dinner' && 'Dinner Recommendations'}
            {data.current_meal_time === 'snacks' && 'Snack Recommendations'}
          </h2>
          <p className="location-info">
            <MapPin size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {data.city} • {data.total_vendors} restaurants
          </p>
        </div>

        <div className="header-controls">
          {filterByMealTime && (
            <div className="meal-filter">
              <label>Filter by meal:</label>
              <select 
                value={selectedMealFilter} 
                onChange={(e) => handleMealFilterChange(e.target.value as MealTime | 'all')}
                className="meal-select"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
          )}

          <button onClick={handleRefresh} className="refresh-button" title="Refresh recommendations">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {filterByMealTime && selectedMealFilter !== 'all' && (
        <div className="filter-info">
          <span className="filter-badge">{selectedMealFilter}</span>
          <span className="filter-results">
            {filteredData.filteredCount} of {filteredData.totalCount} restaurants
          </span>
        </div>
      )}

      {data.slideshow_enabled && (
        <div className="slideshow-info">
          Interactive slideshow enabled - hover over restaurant images to explore their menu!
        </div>
      )}

      {showStartupMetrics && data.vendor_benefits_included && data.startup_optimization && (
        <div className="startup-metrics-summary">
          <h3>🚀 Market Insights</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Potential Partners</span>
              <span className="metric-value">{data.startup_optimization.total_potential_partners}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Avg Partnership Score</span>
              <span className="metric-value">{data.startup_optimization.average_partnership_score}%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Market Penetration</span>
              <span className="metric-value">{data.startup_optimization.market_penetration}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Growth Opportunity</span>
              <span className={`metric-value opportunity-${data.startup_optimization.growth_opportunity.toLowerCase()}`}>
                {data.startup_optimization.growth_opportunity}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="recommendations-grid">
        {displayRecommendations.map((vendor) => (
          <EnhancedVendorCard
            key={vendor.id}
            vendor={vendor}
            onClick={onVendorClick}
            showSlideshow={true}
            showMetrics={showStartupMetrics}
          />
        ))}
      </div>

      {displayRecommendations.length === 0 && filterByMealTime && selectedMealFilter !== 'all' && (
        <div className="no-filtered-results">
          <p>No restaurants serve {selectedMealFilter} in {city} right now.</p>
          <button 
            onClick={() => setSelectedMealFilter('all')}
            className="show-all-button"
          >
            Show All Restaurants
          </button>
        </div>
      )}

      <div className="recommendations-footer">
        <p className="last-updated">
          Updated just now • Current meal time: <strong>{data.current_meal_time}</strong>
        </p>
        {data.slideshow_enabled && (
          <p className="feature-note">
            📱 Tip: Tap restaurant cards to see detailed menu slideshows
          </p>
        )}
      </div>
    </div>
  );
};

export default EnhancedRecommendationsList;
