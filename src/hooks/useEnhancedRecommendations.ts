// React hooks for enhanced recommendations API
import { useState, useEffect, useCallback } from 'react';
import { 
  enhancedRecommendationsApi, 
  EnhancedRecommendationsResponse, 
  EnhancedRecommendationFilters,
  MealTime,
  EnhancedVendorRecommendation
} from '../services/enhancedRecommendationsApi';

interface UseRecommendationsState {
  data: EnhancedRecommendationsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for standard recommendations
 */
export function useRecommendations(filters: { city?: string; limit?: number } = {}): UseRecommendationsState {
  const [data, setData] = useState<EnhancedRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await enhancedRecommendationsApi.getStandardRecommendations(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      console.error('useRecommendations error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.city, filters.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook for enhanced recommendations with slideshow
 */
export function useEnhancedRecommendations(filters: EnhancedRecommendationFilters = {}): UseRecommendationsState {
  const [data, setData] = useState<EnhancedRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching enhanced recommendations with filters:', filters);
      const result = await enhancedRecommendationsApi.getEnhancedRecommendations(filters);
      console.log('✅ Enhanced recommendations loaded:', result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch enhanced recommendations');
      console.error('useEnhancedRecommendations error:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook for slideshow recommendations
 */
export function useSlideshowRecommendations(filters: { city?: string; limit?: number } = {}): UseRecommendationsState {
  return useEnhancedRecommendations({
    ...filters,
    slideshow: true,
    vendor_benefits: false,
    meal_time: 'auto'
  });
}

/**
 * Hook for startup metrics recommendations
 */
export function useStartupMetricsRecommendations(filters: { city?: string; limit?: number } = {}): UseRecommendationsState {
  return useEnhancedRecommendations({
    ...filters,
    slideshow: true,
    vendor_benefits: true,
    meal_time: 'auto'
  });
}

/**
 * Hook for meal-specific recommendations
 */
export function useMealRecommendations(
  mealTime: MealTime, 
  filters: { city?: string; limit?: number; slideshow?: boolean } = {}
): UseRecommendationsState {
  return useEnhancedRecommendations({
    ...filters,
    meal_time: mealTime,
    slideshow: filters.slideshow || false,
    vendor_benefits: false
  });
}

/**
 * Hook for getting current meal time
 */
export function useCurrentMealTime(): MealTime {
  const [mealTime, setMealTime] = useState<MealTime>('lunch');

  useEffect(() => {
    const getCurrentMealTime = (): MealTime => {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 6 && hour < 11) return 'breakfast';
      if (hour >= 11 && hour < 16) return 'lunch';
      if (hour >= 16 && hour < 22) return 'dinner';
      return 'snacks';
    };

    const updateMealTime = () => {
      setMealTime(getCurrentMealTime());
    };

    // Update immediately
    updateMealTime();

    // Update every hour
    const interval = setInterval(updateMealTime, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return mealTime;
}

/**
 * Hook for vendor slideshow functionality
 */
export function useVendorSlideshow(vendor: EnhancedVendorRecommendation | null) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const images = vendor?.slideshow?.images || [];
  const totalImages = images.length;

  const nextImage = useCallback(() => {
    if (totalImages > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  }, [totalImages]);

  const previousImage = useCallback(() => {
    if (totalImages > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  }, [totalImages]);

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < totalImages) {
      setCurrentImageIndex(index);
    }
  }, [totalImages]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  // Auto-advance slideshow
  useEffect(() => {
    if (totalImages > 1 && !isPaused) {
      const interval = setInterval(nextImage, 4000); // Change every 4 seconds
      return () => clearInterval(interval);
    }
  }, [nextImage, totalImages, isPaused]);

  // Reset to first image when vendor changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [vendor?.id]);

  return {
    currentImage: images[currentImageIndex] || null,
    currentImageIndex,
    totalImages,
    nextImage,
    previousImage,
    goToImage,
    pause,
    resume,
    isPaused,
    hasMultipleImages: totalImages > 1
  };
}

/**
 * Hook for filtering recommendations by meal time
 */
export function useFilteredRecommendations(
  recommendations: EnhancedVendorRecommendation[], 
  filterMealTime?: MealTime
) {
  const currentMealTime = useCurrentMealTime();
  const targetMealTime = filterMealTime || currentMealTime;

  const filteredRecommendations = recommendations.filter(vendor => {
    // If vendor has menu items, check if they serve the target meal
    if (vendor.menu_items) {
      return vendor.menu_items.meal_type === targetMealTime;
    }
    
    // If vendor has slideshow with meal categories, check those
    if (vendor.slideshow?.images) {
      return vendor.slideshow.images.some(image => image.meal_category === targetMealTime);
    }
    
    // Default: include all vendors if no meal categorization data
    return true;
  });

  return {
    recommendations: filteredRecommendations,
    currentMealTime,
    targetMealTime,
    totalCount: recommendations.length,
    filteredCount: filteredRecommendations.length
  };
}

/**
 * Hook for API health monitoring
 */
export function useApiHealth() {
  const [health, setHealth] = useState<{ status: string; timestamp: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      setIsChecking(true);
      const result = await enhancedRecommendationsApi.checkApiHealth();
      setHealth(result);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({ status: 'error', timestamp: new Date().toISOString() });
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    health,
    isChecking,
    checkHealth,
    isHealthy: health?.status === 'healthy'
  };
}