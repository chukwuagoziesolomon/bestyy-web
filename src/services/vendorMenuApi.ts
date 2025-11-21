// Vendor Menu API Service
// Handles fetching vendor details, menu items, and profile updates

export interface MenuItem {
  id: number;
  dish_name: string;
  item_description: string;
  price: number;
  category: string;
  image: string | null;
  video: string | null;
  available_now: boolean;
  quantity: number;
  created_at: string;
}

export interface VendorDetails {
  id: number;
  business_name: string;
  business_category: string;
  business_description: string;
  logo: string;
  cover_image: string | null;
  cover_photo?: string | null; // Alternative field name
  is_featured: boolean;
  offers_delivery: boolean;
  opening_hours: string;
  closing_hours: string;
  is_open: boolean;
  phone: string;
  business_address: string;
  service_areas: string[];
  delivery_radius: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
  bio?: string;
}

export interface VendorMenuResponse {
  success: boolean;
  vendor: VendorDetails;
  menu_items: MenuItem[];
  categories: {
    [category: string]: MenuItem[];
  };
  total_items: number;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  vendor: {
    id: number;
    business_name: string;
    logo: string;
    cover_image: string;
    cover_photo: string;
    bio?: string;
  };
}

class VendorMenuApiService {
  private baseUrl = process.env.REACT_APP_API_URL;

  /**
   * Get vendor menu and details
   */
  async getVendorMenu(vendorId: number | string): Promise<VendorMenuResponse> {
    const url = `${this.baseUrl}/api/user/vendors/${vendorId}/menu/`;
    
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
      console.error('Error fetching vendor menu:', error);
      throw error;
    }
  }

  /**
   * Update vendor profile images (logo and/or cover photo)
   * Supports both file uploads and Cloudinary URLs
   */
  async updateVendorProfileImages(
    formDataOrJson: FormData | {
      logo?: string;
      cover_image?: string;
      cover_photo?: string;
      bio?: string;
    },
    token: string
  ): Promise<ProfileUpdateResponse> {
    const url = `${this.baseUrl}/api/user/vendors/profile/images/`;
    
    const isFormData = formDataOrJson instanceof FormData;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(!isFormData && { 'Content-Type': 'application/json' }),
        },
        body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      throw error;
    }
  }

  /**
   * Update vendor profile with file uploads
   */
  async updateVendorProfileWithFiles(
    logoFile?: File,
    coverFile?: File,
    token?: string
  ): Promise<ProfileUpdateResponse> {
    const authToken = token || localStorage.getItem('access_token');
    
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    if (coverFile) {
      formData.append('cover_image', coverFile);
      // Also add as cover_photo for backend compatibility
      formData.append('cover_photo', coverFile);
    }

    return this.updateVendorProfileImages(formData, authToken);
  }

  /**
   * Update vendor profile with Cloudinary URLs
   */
  async updateVendorProfileWithUrls(
    logoUrl?: string,
    coverImageUrl?: string,
    bio?: string,
    token?: string
  ): Promise<ProfileUpdateResponse> {
    const authToken = token || localStorage.getItem('access_token');
    
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const payload: any = {};
    
    if (logoUrl) {
      payload.logo = logoUrl;
    }
    
    if (coverImageUrl) {
      payload.cover_image = coverImageUrl;
      payload.cover_photo = coverImageUrl; // Add both field names
    }
    
    if (bio) {
      payload.bio = bio;
    }

    return this.updateVendorProfileImages(payload, authToken);
  }
}

export const vendorMenuApi = new VendorMenuApiService();
