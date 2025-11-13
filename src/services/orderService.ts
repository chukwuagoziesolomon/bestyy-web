// Order Summary Service for Checkout
import { API_BASE } from '../config';

export interface OrderItem {
  menu_item_id: number;
  quantity: number;
}

export interface OrderSummaryRequest {
  cart_items: OrderItem[];
  delivery_address: string;
  vendor_id: number;
}

export interface OrderSummaryItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderSummaryResponse {
  success: boolean;
  summary: {
    subtotal: number;
    delivery_fee: number;
    platform_fee: number;
    grand_total: number;
    currency: string;
  };
  delivery_info: {
    distance_km: number;
    distance_text: string;
    estimated_time: string;
    vendor_address: string;
    delivery_address: string;
  };
  items: OrderSummaryItem[];
  item_count: number;
  vendor: {
    id: number;
    name: string;
    address: string;
  };
  error?: string;
}

class OrderService {
  private baseUrl = `${API_BASE}/user/order-summary`;

  /**
   * Calculate complete order summary with dynamic pricing
   */
  async calculateOrderSummary(request: OrderSummaryRequest): Promise<OrderSummaryResponse> {
    try {
      const response = await fetch(this.baseUrl + '/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if available
          ...(localStorage.getItem('access_token') && {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          })
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Order summary API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calculating order summary:', error);
      throw error;
    }
  }

  /**
   * Validate order data before submission
   */
  validateOrderData(request: OrderSummaryRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.cart_items || request.cart_items.length === 0) {
      errors.push('Cart cannot be empty');
    }

    if (!request.delivery_address || request.delivery_address.trim().length === 0) {
      errors.push('Delivery address is required');
    }

    if (!request.vendor_id || request.vendor_id <= 0) {
      errors.push('Valid vendor ID is required');
    }

    // Validate cart items
    request.cart_items.forEach((item, index) => {
      if (!item.menu_item_id || item.menu_item_id <= 0) {
        errors.push(`Item ${index + 1}: Invalid menu item ID`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const orderService = new OrderService();