// Vendor Autocomplete Search API Service

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export interface VendorAutocompleteResult {
  id: number;
  business_name: string;
  category: string;
  address: string;
  service_areas: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  offers_delivery: boolean;
  opening_hours: string;
  closing_hours: string;
  product_count: number;
  phone: string;
  matching_products?: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
  }>;
}

export interface AutocompleteResponse {
  success: boolean;
  query: string;
  count: number;
  results: VendorAutocompleteResult[];
}

export interface SuggestionsResponse {
  success: boolean;
  query: string;
  suggestions: string[];
}

export interface CuisineSearchResponse {
  success: boolean;
  cuisine: string;
  count: number;
  results: VendorAutocompleteResult[];
}

class VendorAutocompleteService {
  /**
   * Autocomplete search with full vendor details
   * Fast search with smart ranking
   */
  async autocompleteSearch(
    query: string,
    options?: {
      limit?: number;
      location?: string;
      category?: string;
      food?: string;
      min_price?: number;
      max_price?: number;
    }
  ): Promise<AutocompleteResponse> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.location) params.append('location', options.location);
    if (options?.category) params.append('category', options.category);
    if (options?.food) params.append('food', options.food);
    if (options?.min_price !== undefined) params.append('min_price', options.min_price.toString());
    if (options?.max_price !== undefined) params.append('max_price', options.max_price.toString());

    try {
      const response = await fetch(
        `${API_URL}/api/user/vendors/autocomplete/?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Autocomplete search error:', error);
      throw error;
    }
  }

  /**
   * Get simple vendor name suggestions
   * Lightweight endpoint for autocomplete dropdowns
   */
  async getSuggestions(
    query: string,
    limit: number = 5
  ): Promise<SuggestionsResponse> {
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', limit.toString());

    try {
      const response = await fetch(
        `${API_URL}/api/user/vendors/suggestions/?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Suggestions error:', error);
      throw error;
    }
  }

  /**
   * Search vendors by cuisine type
   */
  async searchByCuisine(
    cuisine: string,
    limit: number = 10
  ): Promise<CuisineSearchResponse> {
    const params = new URLSearchParams();
    params.append('cuisine', cuisine);
    params.append('limit', limit.toString());

    try {
      const response = await fetch(
        `${API_URL}/api/user/vendors/by-cuisine/?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Cuisine search error:', error);
      throw error;
    }
  }
}

export const vendorAutocompleteApi = new VendorAutocompleteService();
