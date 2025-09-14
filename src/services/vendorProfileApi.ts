// Vendor Profile API Service
export interface VendorProfile {
  id: number;
  business_name: string;
  business_category: string;
  business_description: string;
  business_address: string;
  logo: string;
  banner_image: string;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  offers_delivery: boolean;
  delivery_time: string;
  service_areas: string[];
  opening_hours: string;
  closing_hours: string;
  is_open: boolean;
  price_range: {
    min: number;
    max: number;
    currency: string;
  };
  contact_phone: string;
  contact_email: string;
  website?: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  is_favorited: boolean;
  created_at: string;
  verification_date: string;
}

export interface MenuItem {
  id: number;
  name: string; // Frontend alias for dish_name
  description: string; // Frontend alias for item_description
  dish_name: string; // Backend field name
  item_description: string; // Backend field name
  price: number;
  currency: string;
  image: string;
  available_now: boolean;
  preparation_time: number;
  ingredients: string[];
  allergens: string[];
  is_vegetarian: boolean;
  is_spicy: boolean;
  calories?: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  category: string;
  item_count: number;
  items: MenuItem[];
}

export interface Review {
  id: number;
  user_name: string;
  user_avatar: string;
  rating: number;
  review_text: string;
  created_at: string;
  is_verified: boolean;
}

export interface ReviewsData {
  recent_reviews: Review[];
  total_reviews: number;
  average_rating: number;
  rating_breakdown: {
    [key: string]: number;
  };
}

export interface VendorStats {
  total_orders: number;
  total_revenue: number;
  orders_last_30_days: number;
  menu_items: number;
  years_in_business: number;
  recommendation_score: number;
}

export interface VendorProfileResponse {
  success: boolean;
  vendor: VendorProfile;
  menu_categories: MenuCategory[];
  reviews: ReviewsData;
  stats: VendorStats;
}

export interface MenuItemsResponse {
  success: boolean;
  count: number;
  vendor_id: number;
  vendor_name: string;
  filters_applied: {
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    vegetarian_only?: boolean;
  };
  menu_items: MenuItem[];
}

class VendorProfileApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/user/vendors`;

  /**
   * Get complete vendor profile with menu and reviews
   */
  async getVendorProfile(vendorId: number): Promise<VendorProfileResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${vendorId}/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('access_token') && {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend field names to frontend interface
      if (data.success && data.menu_categories) {
        data.menu_categories = data.menu_categories.map((category: any) => ({
          ...category,
          items: category.items.map((item: any) => ({
            ...item,
            name: item.dish_name || item.name, // Map dish_name to name
            description: item.item_description || item.description, // Map item_description to description
          }))
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      throw error; // Re-throw error instead of returning mock data
    }
  }

  /**
   * Get vendor menu items with optional filtering
   */
  async getVendorMenu(
    vendorId: number, 
    filters: {
      category?: string;
      search?: string;
      min_price?: number;
      max_price?: number;
      vegetarian_only?: boolean;
    } = {}
  ): Promise<MenuItemsResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.vegetarian_only) params.append('vegetarian_only', 'true');

      const url = `${this.baseUrl}/${vendorId}/menu/${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      console.error('Error fetching vendor menu:', error);
      throw error;
    }
  }

  /**
   * Toggle vendor favorite status
   */
  async toggleFavorite(vendorId: number): Promise<{ success: boolean; is_favorited: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${vendorId}/favorite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

}

export const vendorProfileApi = new VendorProfileApiService();
