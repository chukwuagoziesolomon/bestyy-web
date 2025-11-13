// Google Maps Location Services for Checkout - Using Backend Proxy Endpoints
import { API_BASE } from '../config';

export interface AddressSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export interface DeliveryValidationResult {
  is_deliverable: boolean;
  distance_km: number;
  estimated_time_min: number;
  delivery_fee: number;
  reason?: string;
}

export interface DistanceResult {
  distance_km: number;
  duration_min: number;
  delivery_fee: number;
}

class LocationService {
  private baseUrl = `${API_BASE}`;

  /**
   * Get address autocomplete suggestions using backend proxy
   */
  async getAddressSuggestions(
    input: string,
    location?: { lat: number; lng: number }
  ): Promise<AddressSuggestion[]> {
    if (!input.trim()) return [];

    try {
      const params = new URLSearchParams({
        input: input.trim(),
      });

      if (location) {
        params.append('location', `${location.lat},${location.lng}`);
      }

      const response = await fetch(
        `${this.baseUrl}/user/google-places/autocomplete/?${params}`
      );

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        console.warn('Google Places autocomplete error:', data.status);
        return [];
      }

      return data.predictions || [];
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
  }

  /**
   * Get place details using backend proxy
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
      });

      const response = await fetch(
        `${this.baseUrl}/user/google-places/details/?${params}`
      );

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        console.warn('Google Places details error:', data.status);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  /**
   * Legacy methods for backward compatibility - now using backend proxy
   */
  async geocodeAddress(address: string): Promise<PlaceDetails | null> {
    // This would need a separate geocoding endpoint on backend
    console.warn('geocodeAddress is deprecated, use getPlaceDetails instead');
    return null;
  }

  async calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<DistanceResult | null> {
    // This would need a distance calculation endpoint on backend
    console.warn('calculateDistance requires backend implementation');
    return null;
  }

  async validateDeliveryAddress(
    customerAddress: string,
    vendorLocation: { lat: number; lng: number },
    maxDistanceKm = 25
  ): Promise<DeliveryValidationResult> {
    // This would need a delivery validation endpoint on backend
    console.warn('validateDeliveryAddress requires backend implementation');
    return {
      is_deliverable: true, // Default to deliverable for now
      distance_km: 5,
      estimated_time_min: 30,
      delivery_fee: 500,
    };
  }

  async checkServiceStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user/google-places/autocomplete/?input=test`);
      return response.ok;
    } catch (error) {
      console.error('Location service check failed:', error);
      return false;
    }
  }
}

export const locationService = new LocationService();