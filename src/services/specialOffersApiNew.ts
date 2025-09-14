// Special Offers API Service
// Handles fetching and managing special offers from the backend

export interface SpecialOffer {
  id: number;
  title: string;
  description: string;
  banner_image: string;
  banner_type: 'homepage' | 'promotional' | 'seasonal' | 'vendor_spotlight';
  status: 'active' | 'inactive';
  priority: number;
  click_url: string;
  target_audience: string[];
  display_start_date: string;
  display_end_date: string | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface SpecialOffersResponse {
  success: boolean;
  count: number;
  banner_type: string;
  banners: SpecialOffer[];
}

export interface SpecialOfferDetailResponse {
  success: boolean;
  banner: SpecialOffer;
}

export interface SpecialOfferCreateRequest {
  title: string;
  description: string;
  banner_image: File;
  banner_type: 'homepage' | 'promotional' | 'seasonal' | 'vendor_spotlight';
  status?: 'active' | 'inactive';
  priority?: number;
  click_url?: string;
  target_audience?: string[];
  display_start_date?: string;
  display_end_date?: string;
}

export interface SpecialOfferUpdateRequest {
  title?: string;
  description?: string;
  banner_image?: File;
  banner_type?: 'homepage' | 'promotional' | 'seasonal' | 'vendor_spotlight';
  status?: 'active' | 'inactive';
  priority?: number;
  click_url?: string;
  target_audience?: string[];
  display_start_date?: string;
  display_end_date?: string;
}

class SpecialOffersApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }

  // Get special offers with optional filtering
  async getSpecialOffers(options: {
    type?: 'homepage' | 'promotional' | 'seasonal' | 'vendor_spotlight';
    limit?: number;
  } = {}): Promise<SpecialOffer[]> {
    try {
      const { type = 'homepage', limit = 5 } = options;
      const url = new URL(`${this.baseUrl}/api/user/banners/`);
      
      if (type) {
        url.searchParams.append('type', type);
      }
      if (limit) {
        url.searchParams.append('limit', limit.toString());
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SpecialOffersResponse = await response.json();
      return result.banners || [];
    } catch (error) {
      console.error('Error fetching special offers:', error);
      // Throw the error instead of returning empty array so the UI can handle it
      throw error;
    }
  }

  // Get homepage special offers (most common use case)
  async getHomepageSpecialOffers(limit: number = 5): Promise<SpecialOffer[]> {
    return this.getSpecialOffers({ type: 'homepage', limit });
  }

  // Get promotional special offers
  async getPromotionalSpecialOffers(limit: number = 5): Promise<SpecialOffer[]> {
    return this.getSpecialOffers({ type: 'promotional', limit });
  }

  // Get seasonal special offers
  async getSeasonalSpecialOffers(limit: number = 5): Promise<SpecialOffer[]> {
    return this.getSpecialOffers({ type: 'seasonal', limit });
  }

  // Get vendor spotlight special offers
  async getVendorSpotlightSpecialOffers(limit: number = 5): Promise<SpecialOffer[]> {
    return this.getSpecialOffers({ type: 'vendor_spotlight', limit });
  }

  // Get special offer details by ID
  async getSpecialOfferById(offerId: number): Promise<SpecialOffer | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/user/banners/${offerId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SpecialOfferDetailResponse = await response.json();
      return result.banner;
    } catch (error) {
      console.error('Error fetching special offer details:', error);
      return null;
    }
  }

  // Create new special offer (Admin only)
  async createSpecialOffer(offerData: SpecialOfferCreateRequest): Promise<SpecialOffer | null> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const formData = new FormData();
      formData.append('title', offerData.title);
      formData.append('description', offerData.description);
      formData.append('banner_image', offerData.banner_image);
      formData.append('banner_type', offerData.banner_type);
      
      if (offerData.status) {
        formData.append('status', offerData.status);
      }
      if (offerData.priority) {
        formData.append('priority', offerData.priority.toString());
      }
      if (offerData.click_url) {
        formData.append('click_url', offerData.click_url);
      }
      if (offerData.target_audience) {
        formData.append('target_audience', JSON.stringify(offerData.target_audience));
      }
      if (offerData.display_start_date) {
        formData.append('display_start_date', offerData.display_start_date);
      }
      if (offerData.display_end_date) {
        formData.append('display_end_date', offerData.display_end_date);
      }

      const response = await fetch(`${this.baseUrl}/api/user/banners/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.banner;
    } catch (error) {
      console.error('Error creating special offer:', error);
      return null;
    }
  }

  // Update special offer (Admin only)
  async updateSpecialOffer(offerId: number, offerData: SpecialOfferUpdateRequest): Promise<SpecialOffer | null> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const formData = new FormData();
      
      if (offerData.title) {
        formData.append('title', offerData.title);
      }
      if (offerData.description) {
        formData.append('description', offerData.description);
      }
      if (offerData.banner_image) {
        formData.append('banner_image', offerData.banner_image);
      }
      if (offerData.banner_type) {
        formData.append('banner_type', offerData.banner_type);
      }
      if (offerData.status) {
        formData.append('status', offerData.status);
      }
      if (offerData.priority) {
        formData.append('priority', offerData.priority.toString());
      }
      if (offerData.click_url) {
        formData.append('click_url', offerData.click_url);
      }
      if (offerData.target_audience) {
        formData.append('target_audience', JSON.stringify(offerData.target_audience));
      }
      if (offerData.display_start_date) {
        formData.append('display_start_date', offerData.display_start_date);
      }
      if (offerData.display_end_date) {
        formData.append('display_end_date', offerData.display_end_date);
      }

      const response = await fetch(`${this.baseUrl}/api/user/banners/${offerId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.banner;
    } catch (error) {
      console.error('Error updating special offer:', error);
      return null;
    }
  }

  // Delete special offer (Admin only)
  async deleteSpecialOffer(offerId: number): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${this.baseUrl}/api/user/banners/${offerId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting special offer:', error);
      return false;
    }
  }

  // Check if special offer is currently active based on dates
  isSpecialOfferActive(offer: SpecialOffer): boolean {
    if (!offer.is_active || offer.status !== 'active') {
      return false;
    }

    const now = new Date();
    const startDate = new Date(offer.display_start_date);
    const endDate = offer.display_end_date ? new Date(offer.display_end_date) : null;

    if (now < startDate) {
      return false;
    }

    if (endDate && now > endDate) {
      return false;
    }

    return true;
  }

  // Filter active special offers
  filterActiveSpecialOffers(offers: SpecialOffer[]): SpecialOffer[] {
    return offers.filter(offer => this.isSpecialOfferActive(offer));
  }

  // Sort special offers by priority (higher priority first)
  sortSpecialOffersByPriority(offers: SpecialOffer[]): SpecialOffer[] {
    return offers.sort((a, b) => b.priority - a.priority);
  }

  // Get special offers for current user based on target audience
  filterSpecialOffersForUser(offers: SpecialOffer[], userType?: string, isNewUser?: boolean): SpecialOffer[] {
    return offers.filter(offer => {
      if (!offer.target_audience || offer.target_audience.length === 0) {
        return true; // Show to all if no target audience specified
      }

      // Check if user matches target audience
      return offer.target_audience.some(audience => {
        switch (audience) {
          case 'all_users':
            return true;
          case 'new_users':
            return isNewUser;
          case 'existing_users':
            return !isNewUser;
          case 'vendors':
            return userType === 'vendor';
          case 'couriers':
            return userType === 'courier';
          case 'customers':
            return userType === 'user';
          default:
            return false;
        }
      });
    });
  }
}

export const specialOffersApiNew = new SpecialOffersApi();
