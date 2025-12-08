# Enhanced Recommendations API Integration Guide

## Overview
This guide shows you how to integrate the enhanced recommendations API with slideshow functionality, meal-time categorization, and vendor attraction metrics in your React application.

## Quick Start

### 1. Basic Integration
```tsx
import { EnhancedRecommendationsList } from './components/EnhancedRecommendationsList';

function MyExplorePage() {
  return (
    <div>
      <h1>Restaurants Near You</h1>
      <EnhancedRecommendationsList 
        city="Lagos"
        enableSlideshow={true}
        limit={10}
      />
    </div>
  );
}
```

### 2. Using Hooks for Custom Implementation
```tsx
import { useEnhancedRecommendations } from './hooks/useEnhancedRecommendations';

function CustomRecommendations() {
  const { data, loading, error } = useEnhancedRecommendations({
    city: 'Lagos',
    slideshow: true,
    vendor_benefits: true,
    limit: 5
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Current Meal Time: {data?.current_meal_time}</h2>
      {data?.recommendations.map(vendor => (
        <div key={vendor.vendor_id}>
          <h3>{vendor.vendor_name}</h3>
          <p>Rating: {vendor.rating} ⭐</p>
          <p>Delivery: {vendor.delivery_time}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Meal-Specific Recommendations
```tsx
import { useMealRecommendations, useCurrentMealTime } from './hooks/useEnhancedRecommendations';

function MealRecommendations() {
  const currentMealTime = useCurrentMealTime();
  const { data } = useMealRecommendations(currentMealTime, {
    city: 'Lagos',
    slideshow: true,
    limit: 8
  });

  return (
    <div>
      <h2>Perfect for {currentMealTime}</h2>
      <EnhancedRecommendationsList 
        city="Lagos"
        enableSlideshow={true}
        filterByMealTime={true}
      />
    </div>
  );
}
```

### 4. Startup Metrics Dashboard
```tsx
import { useStartupMetricsRecommendations } from './hooks/useEnhancedRecommendations';

function StartupDashboard() {
  const { data, loading } = useStartupMetricsRecommendations({
    city: 'Lagos',
    limit: 20
  });

  if (loading) return <div>Loading metrics...</div>;

  return (
    <div>
      <h1>Market Insights</h1>
      {data?.startup_optimization && (
        <div className="metrics-summary">
          <h2>Market Overview</h2>
          <p>Total Potential Partners: {data.startup_optimization.total_potential_partners}</p>
          <p>Average Partnership Score: {data.startup_optimization.average_partnership_score}%</p>
          <p>Market Penetration: {data.startup_optimization.market_penetration}</p>
          <p>Growth Opportunity: {data.startup_optimization.growth_opportunity}</p>
        </div>
      )}
      
      <EnhancedRecommendationsList 
        city="Lagos"
        showStartupMetrics={true}
        enableSlideshow={true}
      />
    </div>
  );
}
```

## API Hook Reference

### useEnhancedRecommendations(filters)
Main hook for fetching enhanced recommendations with full customization.

**Parameters:**
```typescript
interface EnhancedRecommendationFilters {
  city?: string;
  slideshow?: boolean;
  vendor_benefits?: boolean;
  meal_time?: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'auto';
  limit?: number;
}
```

**Returns:**
```typescript
{
  data: EnhancedRecommendationsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

### useRecommendations(filters)
Simplified hook for basic recommendations (backward compatibility).

**Example:**
```tsx
const { data, loading } = useRecommendations({ city: 'Lagos', limit: 5 });
```

### useSlideshowRecommendations(filters)
Hook specifically for slideshow-enabled recommendations.

**Example:**
```tsx
const { data } = useSlideshowRecommendations({ city: 'Abuja', limit: 10 });
```

### useMealRecommendations(mealTime, filters)
Hook for meal-specific recommendations.

**Example:**
```tsx
const { data } = useMealRecommendations('lunch', { 
  city: 'Lagos', 
  slideshow: true 
});
```

### useCurrentMealTime()
Hook to get the current meal time based on local time.

**Example:**
```tsx
const mealTime = useCurrentMealTime(); // 'breakfast', 'lunch', 'dinner', or 'snacks'
```

### useVendorSlideshow(vendor)
Hook for managing slideshow functionality for a specific vendor.

**Example:**
```tsx
function VendorCard({ vendor }) {
  const slideshow = useVendorSlideshow(vendor);
  
  return (
    <div>
      {slideshow.currentImage && (
        <img src={slideshow.currentImage.url} alt={slideshow.currentImage.title} />
      )}
      <button onClick={slideshow.nextImage}>Next</button>
      <div>Image {slideshow.currentImageIndex + 1} of {slideshow.totalImages}</div>
    </div>
  );
}
```

## Component Reference

### EnhancedRecommendationsList
Main component for displaying recommendations with full functionality.

**Props:**
```typescript
interface EnhancedRecommendationsListProps {
  city?: string;                    // Default: 'Lagos'
  enableSlideshow?: boolean;        // Default: true
  showStartupMetrics?: boolean;     // Default: false
  filterByMealTime?: boolean;       // Default: false
  limit?: number;                   // Default: 10
  onVendorClick?: (vendor) => void; // Optional click handler
  className?: string;               // Additional CSS classes
}
```

**Example:**
```tsx
<EnhancedRecommendationsList
  city="Lagos"
  enableSlideshow={true}
  showStartupMetrics={true}
  filterByMealTime={true}
  limit={12}
  onVendorClick={(vendor) => navigate(`/vendor/${vendor.vendor_id}`)}
/>
```

### EnhancedVendorCard
Individual vendor card component with slideshow support.

**Props:**
```typescript
interface EnhancedVendorCardProps {
  vendor: EnhancedVendorRecommendation;
  onClick?: (vendor) => void;
  showSlideshow?: boolean;          // Default: false
  showMetrics?: boolean;            // Default: false
  className?: string;
}
```

## Advanced Usage Examples

### 1. Multiple City Comparison
```tsx
function MultiCityDashboard() {
  const cities = ['Lagos', 'Abuja', 'Kano'];
  
  return (
    <div>
      {cities.map(city => (
        <div key={city}>
          <h2>{city} Restaurants</h2>
          <EnhancedRecommendationsList 
            city={city}
            limit={5}
            showStartupMetrics={true}
          />
        </div>
      ))}
    </div>
  );
}
```

### 2. Real-time Meal Time Updates
```tsx
function SmartRecommendations() {
  const currentMealTime = useCurrentMealTime();
  const [previousMealTime, setPreviousMealTime] = useState(currentMealTime);
  
  useEffect(() => {
    if (currentMealTime !== previousMealTime) {
      // Meal time changed, show notification
      toast.info(`Now showing ${currentMealTime} recommendations!`);
      setPreviousMealTime(currentMealTime);
    }
  }, [currentMealTime, previousMealTime]);
  
  return (
    <EnhancedRecommendationsList 
      filterByMealTime={true}
      enableSlideshow={true}
    />
  );
}
```

### 3. Custom Vendor Display
```tsx
function CustomVendorGrid() {
  const { data } = useEnhancedRecommendations({
    city: 'Lagos',
    slideshow: true,
    limit: 20
  });
  
  return (
    <div className="vendor-grid">
      {data?.recommendations.map(vendor => (
        <div key={vendor.vendor_id} className="vendor-item">
          <EnhancedVendorCard
            vendor={vendor}
            showSlideshow={true}
            onClick={(v) => console.log('Clicked:', v.vendor_name)}
          />
        </div>
      ))}
    </div>
  );
}
```

### 4. Business Intelligence Dashboard
```tsx
function BusinessDashboard() {
  const { data } = useStartupMetricsRecommendations({ limit: 50 });
  
  const topPerformers = data?.recommendations
    .filter(v => v.vendor_attraction_metrics)
    .sort((a, b) => b.vendor_attraction_metrics!.partnership_score - a.vendor_attraction_metrics!.partnership_score)
    .slice(0, 10);
  
  return (
    <div>
      <h1>Top Partnership Opportunities</h1>
      <div className="metrics-overview">
        {data?.startup_optimization && (
          <div className="stat-cards">
            <div className="stat-card">
              <h3>{data.startup_optimization.total_potential_partners}</h3>
              <p>Potential Partners</p>
            </div>
            <div className="stat-card">
              <h3>{data.startup_optimization.average_partnership_score}%</h3>
              <p>Avg Partnership Score</p>
            </div>
            <div className="stat-card">
              <h3>{data.startup_optimization.growth_opportunity}</h3>
              <p>Growth Opportunity</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="top-performers">
        {topPerformers?.map(vendor => (
          <EnhancedVendorCard
            key={vendor.vendor_id}
            vendor={vendor}
            showMetrics={true}
            showSlideshow={true}
          />
        ))}
      </div>
    </div>
  );
}
```

## URL Integration

### Query Parameters
The enhanced explore page supports URL parameters:

```
/explore?city=Lagos&slideshow=true&metrics=true&meal_filter=true
```

**Parameters:**
- `city`: Filter by city (default: Lagos)
- `slideshow`: Enable slideshow mode (true/false)
- `metrics`: Show startup metrics (true/false)  
- `meal_filter`: Enable meal time filtering (true/false)

### Programmatic Navigation
```tsx
import { useNavigate, useSearchParams } from 'react-router-dom';

function NavigationExample() {
  const navigate = useNavigate();
  
  const showLagosBreakfast = () => {
    navigate('/explore?city=Lagos&slideshow=true&meal_filter=true');
  };
  
  const showStartupMetrics = () => {
    navigate('/explore?city=Abuja&metrics=true&slideshow=true');
  };
  
  return (
    <div>
      <button onClick={showLagosBreakfast}>Lagos Breakfast</button>
      <button onClick={showStartupMetrics}>Startup Metrics</button>
    </div>
  );
}
```

## Error Handling

### Graceful Fallbacks
```tsx
function RobustRecommendations() {
  const { data, loading, error } = useEnhancedRecommendations({
    city: 'Lagos'
  });
  
  if (loading) {
    return <div className="loading-skeleton">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="error-state">
        <h3>Unable to load recommendations</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }
  
  if (!data?.recommendations.length) {
    return (
      <div className="empty-state">
        <h3>No restaurants found</h3>
        <p>Try a different city or check back later.</p>
      </div>
    );
  }
  
  return <EnhancedRecommendationsList city="Lagos" />;
}
```

## Performance Optimization

### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

const EnhancedRecommendationsList = lazy(() => 
  import('./components/EnhancedRecommendationsList')
);

function OptimizedExplore() {
  return (
    <Suspense fallback={<div>Loading recommendations...</div>}>
      <EnhancedRecommendationsList city="Lagos" />
    </Suspense>
  );
}
```

### Memoization
```tsx
import { memo, useMemo } from 'react';

const MemoizedVendorCard = memo(EnhancedVendorCard);

function OptimizedGrid({ vendors }) {
  const sortedVendors = useMemo(() => 
    vendors.sort((a, b) => b.popularity_score - a.popularity_score),
    [vendors]
  );
  
  return (
    <div>
      {sortedVendors.map(vendor => (
        <MemoizedVendorCard key={vendor.vendor_id} vendor={vendor} />
      ))}
    </div>
  );
}
```

This integration guide provides everything you need to implement the enhanced recommendations API in your application with full slideshow, meal categorization, and startup metrics functionality.