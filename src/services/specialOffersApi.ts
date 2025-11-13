// Special Offers API Service
export interface SpecialOffer {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  bgGradient: string;
  borderColor: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  discount?: number;
  category?: string;
}

export interface SpecialOffersResponse {
  success: boolean;
  offers: SpecialOffer[];
}

class SpecialOffersApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL}/api/special-offers`;

  /**
   * Get all active special offers
   */
  async getSpecialOffers(): Promise<SpecialOffersResponse> {
    try {
      const response = await fetch(this.baseUrl, {
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
      console.error('Error fetching special offers:', error);
      throw error; // Re-throw error instead of returning mock data
    }
  }

}

export const specialOffersApi = new SpecialOffersApiService();
