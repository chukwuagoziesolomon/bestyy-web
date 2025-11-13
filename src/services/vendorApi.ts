// Vendor Profile and Menu API Services

export interface VendorProfile {
  id: number;
  business_name: string;
  business_category: string;
  business_description: string;
  business_address: string;
  phone: string;
  phone_number: string;
  logo: string;
  cover_image: string;
  cover_photo: string;
  bio: string;
  is_featured: boolean;
  verification_status: string;
  service_areas: string[];
  delivery_radius: string;
  delivery_time: string;
  offers_delivery: boolean;
  opening_hours: string;
  closing_hours: string;
  is_open: boolean;
  rating: number;
  total_reviews: number;
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  category: string;
  item_count: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  is_available: boolean;
  preparation_time?: number;
  ingredients: string[];
  allergens: string[];
  is_vegetarian: boolean;
  is_spicy: boolean;
  calories?: number;
  created_at: string;
  updated_at: string;
}

export interface VendorProfileResponse {
  success: boolean;
  vendor: VendorProfile;
  menu_categories: MenuCategory[];
  reviews: {
    recent_reviews: any[];
    total_reviews: number;
    average_rating: number;
    rating_breakdown: { [key: number]: number };
  };
  stats: {
    recent_orders_last_30_days: number;
    popularity_score: number;
    member_since: string;
  };
}

export interface MenuItemsResponse {
  success: boolean;
  count: number;
  vendor_id: number;
  vendor_name: string;
  filters_applied: {
    category?: string;
    search?: string;
    min_price?: string;
    max_price?: string;
    vegetarian_only: boolean;
  };
  menu_items: MenuItem[];
}

export interface VendorMenuResponse {
  success: boolean;
  vendor: VendorProfile;
  menu_items: {
    id: number;
    dish_name: string;
    item_description: string;
    price: number;
    category: string;
    image: string;
    video: string | null;
    available_now: boolean;
    quantity: number;
    created_at: string;
  }[];
  categories: { [key: string]: {
    id: number;
    dish_name: string;
    item_description: string;
    price: number;
    category: string;
    image: string;
    video: string | null;
    available_now: boolean;
    quantity: number;
    created_at: string;
  }[] };
  total_items: number;
}

export interface MenuFilters {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  vegetarian_only?: boolean;
}

class VendorApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL}/api/user/vendors`;

  /**
   * Get complete vendor profile with menu categories
   */
  async getVendorProfile(vendorId: number): Promise<VendorProfileResponse> {
    const url = `${this.baseUrl}/${vendorId}/profile/`;

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
      console.error('Error fetching vendor profile:', error);
      throw error;
    }
  }

  /**
   * Get vendor menu items with filtering
   */
  async getVendorMenu(vendorId: number, filters: MenuFilters = {}): Promise<MenuItemsResponse> {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    if (filters.vegetarian_only) params.append('vegetarian_only', 'true');

    const url = `${this.baseUrl}/${vendorId}/menu/${params.toString() ? `?${params.toString()}` : ''}`;

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
      console.error('Error fetching vendor menu:', error);
      throw error;
    }
  }

  /**
   * Get vendor profile and menu data from the new /menu/ endpoint
   */
  async getVendorMenuProfile(vendorId: number): Promise<VendorMenuResponse> {
    const url = `${this.baseUrl}/${vendorId}/menu/`;

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
      console.error('Error fetching vendor menu profile:', error);
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

export const vendorApi = new VendorApiService();