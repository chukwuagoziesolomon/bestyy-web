// Categories API Service
export interface Category {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  bgColor: string;
  borderColor: string;
  available: boolean;
  description?: string;
  itemCount?: number;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

class CategoriesApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL}/api/categories`;

  /**
   * Get all available categories
   */
  async getCategories(): Promise<CategoriesResponse> {
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
      console.error('Error fetching categories:', error);
      throw error; // Re-throw error instead of returning mock data
    }
  }

}

export const categoriesApi = new CategoriesApiService();
