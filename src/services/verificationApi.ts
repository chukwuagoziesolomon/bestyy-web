import { showError, showSuccess } from '../toast';

// Types for verification status
export interface VendorVerificationStatus {
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  message: string;
  notes?: string;
}

export interface CourierVerificationStatus {
  success: boolean;
  data: {
    courier_id: number;
    user_id: number;
    full_name: string;
    email: string;
    phone: string;
    verification_status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'incomplete';
    verified: boolean;
    verification_date: string | null;
    verification_notes: string | null;
    verification_preference: string;
    message: string;
    next_steps: string[];
    required_documents: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    support_contact: {
      email: string;
      phone: string;
      whatsapp: string;
    };
  };
}

export interface VerificationHistory {
  success: boolean;
  data: {
    courier_id: number;
    current_status: string;
    application_date: string;
    verification_date: string | null;
    timeline: {
      date: string | null;
      status: string;
      title: string;
      description: string;
      icon: string;
    }[];
    verification_notes: string | null;
    estimated_review_time: string;
  };
}

class VerificationApiService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get vendor verification status
  async getVendorVerificationStatus(): Promise<VendorVerificationStatus> {
    try {
      const response = await this.makeRequest<VendorVerificationStatus>(
        '/api/user/vendors/verification-status/'
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch vendor verification status:', error);
      showError('Failed to load verification status');
      throw error;
    }
  }

  // Get courier verification status
  async getCourierVerificationStatus(): Promise<CourierVerificationStatus> {
    try {
      const response = await this.makeRequest<CourierVerificationStatus>(
        '/api/user/couriers/verification-status/'
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch courier verification status:', error);
      showError('Failed to load verification status');
      throw error;
    }
  }

  // Get courier verification history
  async getCourierVerificationHistory(): Promise<VerificationHistory> {
    try {
      const response = await this.makeRequest<VerificationHistory>(
        '/api/user/couriers/verification-history/'
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch courier verification history:', error);
      showError('Failed to load verification history');
      throw error;
    }
  }

  // Check if user is vendor or courier
  getUserType(): 'vendor' | 'courier' | 'user' {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.role || 'user';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Check if vendor_profile exists (indicates vendor/courier)
    const vendorProfile = localStorage.getItem('vendor_profile');
    if (vendorProfile) {
      try {
        const vendorData = JSON.parse(vendorProfile);
        // Check if it's a courier profile
        if (vendorData.vehicle_type || vendorData.has_bike !== undefined) {
          return 'courier';
        }
        return 'vendor';
      } catch (e) {
        console.error('Error parsing vendor profile:', e);
      }
    }
    
    return 'user';
  }
}

export const verificationApi = new VerificationApiService();
