// Unified Vendor Recommendation API Service
// Removed mock recommendations import - using only real API data

export interface PreviewImage {
  id: number;
  dish_name: string;
  image: string;
  thumbnail: string;
  price: number;
}

export interface FoodImage {
  id: number;
  dish_name: string;
  image: string;
  thumbnail: string;
  price: number;
}

export interface VendorRecommendation {
  id: number;
  business_name: string;
  business_category: string;
  business_address: string;
  logo: string;
  cover_image?: string;  // Added cover_image support
  logo_thumbnail: string;
  preview_image?: PreviewImage | null;  // New: Single preview image from API
  food_images: FoodImage[];  // Legacy support
  delivery_time: string;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  featured_priority?: number;
  recommendation_score: number;
  offers_delivery: boolean;
  service_areas: string[];
  opening_hours: string;
  closing_hours: string;
  is_open: boolean;
  distance?: number;
}

export interface RecommendationsResponse {
  success: boolean;
  recommendations: VendorRecommendation[];
  total_count: number;
  filters_applied: {
    category?: string;
    cuisine?: string;
    city?: string;
    limit?: number;
  };
}

export interface RecommendationFilters {
  category?: string;
  cuisine?: string;
  page?: number;
  page_size?: number;
  limit?: number;
  latitude?: number;
  longitude?: number;
  city?: string;
}

class RecommendationsApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL}/api/user/recommendations`;

  /**
   * Get unified vendor recommendations
   */
  async getRecommendations(filters: RecommendationFilters = {}): Promise<RecommendationsResponse> {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.cuisine) params.append('cuisine', filters.cuisine);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.latitude) params.append('latitude', filters.latitude.toString());
    if (filters.longitude) params.append('longitude', filters.longitude.toString());
    if (filters.city) params.append('city', filters.city);

    const url = `${this.baseUrl}/${params.toString() ? `?${params.toString()}` : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if available
          ...(localStorage.getItem('access_token') && {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error; // Re-throw error instead of using mock data
    }
  }

  /**
   * Rate a vendor after ordering
   */
  async rateVendor(vendorId: number, rating: number, reviewText?: string, orderId?: number) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          rating,
          review_text: reviewText,
          order_id: orderId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error rating vendor:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: {
    preferred_locations?: string[];
    current_city?: string;
    preferred_cuisines?: string[];
    dietary_restrictions?: string[];
    price_range_min?: number;
    price_range_max?: number;
    prefers_delivery?: boolean;
    max_delivery_time?: number;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

}

export const recommendationsApi = new RecommendationsApiService();
