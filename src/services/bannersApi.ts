// Banners API Service
// Handles fetching promotional banners for the explore/recommendations page

export interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  banner_type: 'homepage' | 'promotional' | 'seasonal' | 'vendor_spotlight';
  priority: number;
  click_url: string | null;
  display_start_date?: string;
  display_end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BannersResponse {
  success: boolean;
  count: number;
  banner_type?: string;
  banners: Banner[];
}

export interface BannerDetailResponse {
  success: boolean;
  banner: Banner;
}

class BannersApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL}/api/user/banners`;

  /**
   * Get all active banners
   */
  async getBanners(params?: {
    limit?: number;
    type?: 'homepage' | 'promotional' | 'seasonal' | 'vendor_spotlight';
  }): Promise<BannersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params?.type) {
      queryParams.append('type', params.type);
    }

    const url = `${this.baseUrl}/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
      console.log('🔵 [BannersApi] Fetching from URL:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🟢 [BannersApi] Raw response received:', data);
      console.log('🟢 [BannersApi] Response keys:', Object.keys(data));
      
      // Handle different response formats
      // Format 1: Direct array response
      if (Array.isArray(data)) {
        console.log('🟡 [BannersApi] Format: Direct array with', data.length, 'items');
        return {
          success: true,
          count: data.length,
          banners: data
        };
      }
      
      // Format 2: Response with results field (pagination format)
      if (data.results && Array.isArray(data.results)) {
        console.log('🟡 [BannersApi] Format: results field with', data.results.length, 'items');
        return {
          success: true,
          count: data.count || data.results.length,
          banners: data.results
        };
      }
      
      // Format 3: Standard response with banners field
      if (data.banners && Array.isArray(data.banners)) {
        console.log('🟡 [BannersApi] Format: banners field with', data.banners.length, 'items');
        return data;
      }
      
      // Format 4: Response with data field
      if (data.data && Array.isArray(data.data)) {
        console.log('🟡 [BannersApi] Format: data field with', data.data.length, 'items');
        return {
          success: true,
          count: data.data.length,
          banners: data.data
        };
      }
      
      console.warn('🔴 [BannersApi] Unknown response format:', data);
      return {
        success: false,
        count: 0,
        banners: []
      };
    } catch (error) {
      console.error('🔴 [BannersApi] Error fetching banners:', error);
      throw error;
    }
  }

  /**
   * Get banner details by ID
   */
  async getBannerById(id: number): Promise<BannerDetailResponse> {
    const url = `${this.baseUrl}/${id}/`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching banner details:', error);
      throw error;
    }
  }

  /**
   * Get promotional banners for explore page
   */
  async getPromotionalBanners(limit: number = 5): Promise<BannersResponse> {
    return this.getBanners({ type: 'promotional', limit });
  }
}

export const bannersApi = new BannersApiService();
