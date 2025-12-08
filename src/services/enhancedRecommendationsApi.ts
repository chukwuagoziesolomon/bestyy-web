// Enhanced Recommendations API Service with slideshow and startup metrics
// Implements the full API specification from the documentation

export interface SlideshowImage {
  url: string;
  thumbnail: string;
  detail: string;
  title: string;
  description: string;
  price: number;
  meal_category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  relevance_score: number;
}

export interface SlideshowData {
  images: SlideshowImage[];
  total_items: number;
  meal_specific_items: number;
}

export interface MealCategorizedItems {
  breakfast: number;
  lunch: number;
  dinner: number;
  snacks: number;
  current_meal_items: number;
}

export interface VendorAttractionMetrics {
  partnership_score: number;
  revenue_potential: string;
  commission_rate: string;
  onboarding_incentives: string[];
  marketing_support: {
    social_media_promotion: boolean;
    featured_vendor_opportunities: boolean;
    email_marketing_inclusion: boolean;
    app_banner_placement: boolean;
  };
  growth_indicators: {
    market_demand: 'High' | 'Medium' | 'Low';
    competition_level: 'High' | 'Medium' | 'Low';
    customer_retention: string;
    order_frequency: string;
  };
  support_benefits: {
    dedicated_account_manager: boolean;
    '24_7_technical_support': boolean;
    business_analytics_dashboard: boolean;
    inventory_management_tools: boolean;
  };
  estimated_rating: number;
  social_proof_count: number;
}

export interface StartupOptimization {
  total_potential_partners: number;
  average_partnership_score: number;
  market_penetration: string;
  growth_opportunity: 'High' | 'Medium' | 'Low';
}

export interface EnhancedVendorRecommendation {
  id: number;
  business_name: string;
  business_category: string;
  business_address: string;
  logo: string;
  cover_image?: string | null;
  logo_thumbnail: string;
  menu_items: {
    meal_type: string;
    meal_time: string;
    items: {
      id: number;
      name: string;
      description: string;
      price: number;
      currency: string;
      category: string;
      image: string;
      relevance_score: number;
    }[];
    total_available: number;
  };
  slideshow: SlideshowData;
  attraction_metrics: VendorAttractionMetrics;
  delivery_time: string;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  featured_priority: number;
  subscription_plan: string;
  recommendation_score: number;
  offers_delivery: boolean;
  service_areas: string[];
  opening_hours?: string | null;
  closing_hours?: string | null;
  is_open: boolean;
  distance?: string | null;
  vendor_benefits: {
    commission_free_period: string;
    marketing_support: boolean;
    analytics_dashboard: boolean;
    customer_support: string;
  };
}

export interface EnhancedRecommendationsResponse {
  recommendations: EnhancedVendorRecommendation[];
  current_meal_time: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  total_vendors: number;
  city: string;
  slideshow_enabled?: boolean;
  vendor_benefits_included?: boolean;
  startup_optimization?: StartupOptimization;
}

export interface EnhancedRecommendationFilters {
  city?: string;
  slideshow?: boolean;
  vendor_benefits?: boolean;
  meal_time?: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'auto';
  limit?: number;
}

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

class EnhancedRecommendationsService {
  private baseUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/user/recommendations`;

  /**
   * Get current meal time based on local time
   */
  private getCurrentMealTime(): MealTime {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 22) return 'dinner';
    return 'snacks';
  }

  /**
   * Get enhanced recommendations with slideshow and startup metrics
   */
  async getEnhancedRecommendations(filters: EnhancedRecommendationFilters = {}): Promise<EnhancedRecommendationsResponse> {
    const params = new URLSearchParams();
    
    // Add query parameters
    if (filters.city) params.append('city', filters.city);
    if (filters.slideshow !== undefined) params.append('slideshow', filters.slideshow.toString());
    if (filters.vendor_benefits !== undefined) params.append('vendor_benefits', filters.vendor_benefits.toString());
    if (filters.meal_time && filters.meal_time !== 'auto') params.append('meal_time', filters.meal_time);
    if (filters.limit) params.append('limit', filters.limit.toString());

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    
    console.log('🔄 Enhanced Recommendations API Request:', {
      url,
      filters,
      currentMealTime: this.getCurrentMealTime()
    });

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth token if available (optional for public recommendations)
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      console.log('📥 Enhanced Recommendations API Response:', {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json();
      
      console.log('📦 Raw API Response:', rawData);
      
      // Transform API response to match our interface
      const data: EnhancedRecommendationsResponse = {
        recommendations: rawData.recommendations?.map((vendor: any) => ({
          id: vendor.id,
          business_name: vendor.business_name,
          business_category: vendor.business_category,
          business_address: vendor.business_address,
          logo: vendor.logo,
          cover_image: vendor.cover_image,
          logo_thumbnail: vendor.logo_thumbnail,
          menu_items: vendor.menu_items,
          slideshow: vendor.slideshow,
          attraction_metrics: vendor.attraction_metrics,
          delivery_time: vendor.delivery_time,
          rating: vendor.rating,
          total_reviews: vendor.total_reviews,
          is_featured: vendor.is_featured || false,
          featured_priority: vendor.featured_priority || 0,
          subscription_plan: vendor.subscription_plan || 'free',
          recommendation_score: vendor.recommendation_score || 0,
          offers_delivery: vendor.offers_delivery || false,
          service_areas: vendor.service_areas || [],
          opening_hours: vendor.opening_hours,
          closing_hours: vendor.closing_hours,
          is_open: vendor.is_open,
          distance: vendor.distance,
          vendor_benefits: vendor.vendor_benefits || {
            commission_free_period: '30 days',
            marketing_support: true,
            analytics_dashboard: true,
            customer_support: '24/7'
          }
        })) || [],
        current_meal_time: rawData.current_meal_time || this.getCurrentMealTime(),
        total_vendors: rawData.total_count || 0,
        city: rawData.filters_applied?.city || filters.city || 'Lagos',
        slideshow_enabled: filters.slideshow || false,
        vendor_benefits_included: filters.vendor_benefits || false
      };
      
      console.log('✅ Transformed Enhanced Recommendations Data:', {
        vendorCount: data.recommendations.length,
        currentMealTime: data.current_meal_time,
        slideshowEnabled: data.slideshow_enabled,
        firstVendorSlideshow: data.recommendations[0]?.slideshow
      });

      return data;
    } catch (error) {
      console.error('❌ Enhanced Recommendations API Error:', error);
      
      // Return fallback data instead of throwing error for better UX
      return this.getFallbackRecommendations(filters);
    }
  }

  /**
   * Get standard recommendations (backward compatibility)
   */
  async getStandardRecommendations(filters: { city?: string; limit?: number } = {}): Promise<EnhancedRecommendationsResponse> {
    return this.getEnhancedRecommendations({
      ...filters,
      slideshow: false,
      vendor_benefits: false,
      meal_time: 'auto'
    });
  }

  /**
   * Get slideshow recommendations for featured display
   */
  async getSlideshowRecommendations(filters: { city?: string; limit?: number } = {}): Promise<EnhancedRecommendationsResponse> {
    return this.getEnhancedRecommendations({
      ...filters,
      slideshow: true,
      vendor_benefits: false,
      meal_time: 'auto'
    });
  }

  /**
   * Get startup metrics recommendations for business intelligence
   */
  async getStartupMetricsRecommendations(filters: { city?: string; limit?: number } = {}): Promise<EnhancedRecommendationsResponse> {
    return this.getEnhancedRecommendations({
      ...filters,
      slideshow: true,
      vendor_benefits: true,
      meal_time: 'auto'
    });
  }

  /**
   * Get meal-specific recommendations
   */
  async getMealRecommendations(mealTime: MealTime, filters: { city?: string; limit?: number; slideshow?: boolean } = {}): Promise<EnhancedRecommendationsResponse> {
    return this.getEnhancedRecommendations({
      ...filters,
      meal_time: mealTime,
      slideshow: filters.slideshow || false,
      vendor_benefits: false
    });
  }

  /**
   * Fallback data when API fails
   */
  private getFallbackRecommendations(filters: EnhancedRecommendationFilters): EnhancedRecommendationsResponse {
    console.log('🔄 Using fallback recommendations data');
    
    const mockRecommendations: EnhancedVendorRecommendation[] = [
      {
        id: 1,
        business_name: "Galaxy Kitchen",
        business_category: "Nigerian Cuisine",
        business_address: "Lagos, Nigeria",
        logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop",
        cover_image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
        logo_thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop",
        menu_items: {
          meal_type: "lunch",
          meal_time: "11:00-16:00",
          items: [
            {
              id: 1,
              name: "Jollof Rice",
              description: "Nigerian spiced rice",
              price: 1500,
              currency: "NGN",
              category: "Main Course",
              image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
              relevance_score: 5
            }
          ],
          total_available: 1
        },
        rating: 4.5,
        delivery_time: "25-35 mins",
        total_reviews: 342,
        is_featured: false,
        featured_priority: 0,
        subscription_plan: "free",
        recommendation_score: 85.7,
        offers_delivery: true,
        service_areas: ["Lagos"],
        opening_hours: "09:00",
        closing_hours: "22:00",
        is_open: true,
        distance: "2.3 km",
        vendor_benefits: {
          commission_free_period: "30 days",
          marketing_support: true,
          analytics_dashboard: true,
          customer_support: "24/7"
        },
        slideshow: {
          images: [
            {
              url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
              thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop",
              detail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
              title: "Jollof Rice Special",
              description: "Delicious Nigerian jollof rice with chicken",
              price: 2500,
              meal_category: this.getCurrentMealTime(),
              relevance_score: 92.5
            }
          ],
          total_items: 8,
          meal_specific_items: 6
        },
        attraction_metrics: {
          partnership_score: 85.7,
          revenue_potential: "₦50,000 - ₦150,000/month",
          commission_rate: "12%",
          onboarding_incentives: [
            "Zero commission for first month",
            "Free professional food photography"
          ],
          marketing_support: {
            social_media_promotion: true,
            featured_vendor_opportunities: true,
            email_marketing_inclusion: true,
            app_banner_placement: true
          },
          growth_indicators: {
            market_demand: "High" as const,
            competition_level: "Medium" as const,
            customer_retention: "85%",
            order_frequency: "3.2 orders/week"
          },
          support_benefits: {
            dedicated_account_manager: true,
            '24_7_technical_support': true,
            business_analytics_dashboard: true,
            inventory_management_tools: true
          },
          estimated_rating: 4.5,
          social_proof_count: 342
        }
      }
    ];

    return {
      recommendations: mockRecommendations,
      current_meal_time: filters.meal_time === 'auto' ? this.getCurrentMealTime() : (filters.meal_time || this.getCurrentMealTime()),
      total_vendors: mockRecommendations.length,
      city: filters.city || "Lagos",
      slideshow_enabled: filters.slideshow || false,
      vendor_benefits_included: filters.vendor_benefits || false
    };
  }

  /**
   * Check API health and availability
   */
  async checkApiHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { status: 'healthy', timestamp: new Date().toISOString(), ...data };
      } else {
        return { status: 'unhealthy', timestamp: new Date().toISOString() };
      }
    } catch (error) {
      console.error('API Health Check Failed:', error);
      return { status: 'error', timestamp: new Date().toISOString() };
    }
  }
}

// Export singleton instance
export const enhancedRecommendationsApi = new EnhancedRecommendationsService();

// Export legacy compatibility
export const recommendationsApiEnhanced = enhancedRecommendationsApi;