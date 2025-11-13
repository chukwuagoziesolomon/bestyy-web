// Unified Search API Service

export interface SearchResult {
  type: 'vendor' | 'courier';
  id: number;
  business_name?: string;
  business_category?: string;
  rating?: number;
  offers_delivery?: boolean;
  delivery_time?: string;
  // Courier specific fields
  name?: string;
  email?: string;
  completed_deliveries?: number;
  verification_status?: string;
  // Common fields
  [key: string]: any;
}

export interface SearchResponse {
  success: boolean;
  search_type: string;
  total_results: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  search_params: {
    query?: string;
    cuisine?: string;
    city?: string;
    [key: string]: any;
  };
  results: SearchResult[];
}

export interface SearchFilters {
  q?: string; // General search query
  type?: 'all' | 'vendor' | 'courier';
  category?: string;
  cuisine?: string;
  state?: string;
  city?: string;
  area?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  delivery_only?: boolean;
  verification_status?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}

class SearchApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL}/api/user/search`;

  /**
   * Unified search for vendors and couriers
   */
  async search(filters: SearchFilters = {}): Promise<SearchResponse> {
    const params = new URLSearchParams();

    if (filters.q) params.append('q', filters.q);
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.cuisine) params.append('cuisine', filters.cuisine);
    if (filters.state) params.append('state', filters.state);
    if (filters.city) params.append('city', filters.city);
    if (filters.area) params.append('area', filters.area);
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    if (filters.min_rating) params.append('min_rating', filters.min_rating.toString());
    if (filters.delivery_only) params.append('delivery_only', 'true');
    if (filters.verification_status) params.append('verification_status', filters.verification_status);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());

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
      console.error('Error performing search:', error);
      throw error;
    }
  }

  /**
   * Search vendors only
   */
  async searchVendors(filters: Omit<SearchFilters, 'type'> & { type?: 'vendor' } = {}): Promise<SearchResponse> {
    return this.search({ ...filters, type: 'vendor' });
  }

  /**
   * Search couriers only
   */
  async searchCouriers(filters: Omit<SearchFilters, 'type'> & { type?: 'courier' } = {}): Promise<SearchResponse> {
    return this.search({ ...filters, type: 'courier' });
  }

  /**
   * Search everything (vendors and couriers)
   */
  async searchAll(query: string, filters: Omit<SearchFilters, 'q' | 'type'> = {}): Promise<SearchResponse> {
    return this.search({ ...filters, q: query, type: 'all' });
  }
}

export const searchApi = new SearchApiService();