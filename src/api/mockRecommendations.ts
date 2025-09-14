// Mock API endpoint for development
// This simulates the backend API response

export const mockRecommendationsApi = {
  async getRecommendations(filters: any = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockVendors = [
      {
        id: 1,
        business_name: "Galaxy Pizza Lagos",
        business_category: "Food",
        business_address: "123 Victoria Island, Lagos",
        logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop",
        logo_thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop",
        delivery_time: "30-40 min",
        rating: 4.5,
        total_reviews: 127,
        is_featured: true,
        featured_priority: 5,
        recommendation_score: 85.2,
        offers_delivery: true,
        service_areas: ["Victoria Island", "Ikoyi", "Lekki"],
        opening_hours: "08:00",
        closing_hours: "22:00",
        is_open: true
      },
      {
        id: 2,
        business_name: "Spice Garden Restaurant",
        business_category: "Food",
        business_address: "456 Surulere, Lagos",
        logo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop",
        logo_thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&h=150&fit=crop",
        delivery_time: "25-35 min",
        rating: 4.2,
        total_reviews: 89,
        is_featured: false,
        featured_priority: 0,
        recommendation_score: 72.8,
        offers_delivery: true,
        service_areas: ["Surulere", "Yaba"],
        opening_hours: "09:00",
        closing_hours: "21:00",
        is_open: false
      },
      {
        id: 3,
        business_name: "Nigerian Delights",
        business_category: "Food",
        business_address: "789 Ikeja, Lagos",
        logo: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=300&h=300&fit=crop",
        logo_thumbnail: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=150&h=150&fit=crop",
        delivery_time: "20-30 min",
        rating: 4.7,
        total_reviews: 156,
        is_featured: true,
        featured_priority: 3,
        recommendation_score: 88.1,
        offers_delivery: true,
        service_areas: ["Ikeja", "Ojodu"],
        opening_hours: "07:00",
        closing_hours: "23:00",
        is_open: true
      },
      {
        id: 4,
        business_name: "Pasta Corner",
        business_category: "Food",
        business_address: "321 Lekki Phase 1, Lagos",
        logo: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=300&fit=crop",
        logo_thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=150&h=150&fit=crop",
        delivery_time: "25-35 min",
        rating: 4.3,
        total_reviews: 67,
        is_featured: false,
        featured_priority: 0,
        recommendation_score: 75.4,
        offers_delivery: true,
        service_areas: ["Lekki Phase 1", "Lekki Phase 2"],
        opening_hours: "10:00",
        closing_hours: "22:00",
        is_open: true
      },
      {
        id: 5,
        business_name: "Curry House",
        business_category: "Food",
        business_address: "654 Yaba, Lagos",
        logo: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop",
        logo_thumbnail: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=150&h=150&fit=crop",
        delivery_time: "20-30 min",
        rating: 4.1,
        total_reviews: 43,
        is_featured: false,
        featured_priority: 0,
        recommendation_score: 68.9,
        offers_delivery: true,
        service_areas: ["Yaba", "Surulere"],
        opening_hours: "11:00",
        closing_hours: "21:00",
        is_open: true
      },
      {
        id: 6,
        business_name: "BBQ Master",
        business_category: "Food",
        business_address: "987 Ikoyi, Lagos",
        logo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop",
        logo_thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?w=150&h=150&fit=crop",
        delivery_time: "35-45 min",
        rating: 4.6,
        total_reviews: 98,
        is_featured: true,
        featured_priority: 2,
        recommendation_score: 82.3,
        offers_delivery: true,
        service_areas: ["Ikoyi", "Victoria Island"],
        opening_hours: "12:00",
        closing_hours: "24:00",
        is_open: true
      }
    ];

    // Sort: Featured vendors first (by priority), then non-featured vendors (by recommendation score)
    const sortedVendors = mockVendors.sort((a, b) => {
      // First, separate featured from non-featured
      if (a.is_featured && !b.is_featured) return -1; // Featured comes first
      if (!a.is_featured && b.is_featured) return 1;  // Non-featured comes after
      
      // If both are featured, sort by featured priority (higher priority first)
      if (a.is_featured && b.is_featured) {
        return b.featured_priority - a.featured_priority;
      }
      
      // If both are non-featured, sort by recommendation score (higher score first)
      if (!a.is_featured && !b.is_featured) {
        return b.recommendation_score - a.recommendation_score;
      }
      
      return 0;
    });

    const page = filters.page || 1;
    const pageSize = filters.page_size || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedVendors = sortedVendors.slice(startIndex, endIndex);

    return {
      success: true,
      count: paginatedVendors.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(sortedVendors.length / pageSize),
      has_next: endIndex < sortedVendors.length,
      has_previous: page > 1,
      next_page: endIndex < sortedVendors.length ? page + 1 : undefined,
      previous_page: page > 1 ? page - 1 : undefined,
      filters_applied: {
        category: filters.category,
        user_location: {
          city: filters.city
        },
        user_authenticated: !!localStorage.getItem('access_token')
      },
      recommendations: paginatedVendors
    };
  }
};
