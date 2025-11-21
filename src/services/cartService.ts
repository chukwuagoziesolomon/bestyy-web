import { API_URL } from '../api';

export interface CartProduct {
  id: number;
  name: string;
  vendor: {
    id: number;
    name: string;
  };
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  description?: string;
  category?: string;
}

export interface CartResponse {
  success: boolean;
  cart_token?: string;
  message?: string;
  total_items: number;
  total_amount: number;
  products?: CartProduct[];
  product?: CartProduct;
  currency?: string;
}

class CartService {
  private readonly CART_TOKEN_KEY = 'cart_token';
  private readonly BASE_URL = `${API_URL}/api/user/website-cart`;

  /**
   * Get cart token from localStorage
   */
  getCartToken(): string | null {
    return localStorage.getItem(this.CART_TOKEN_KEY);
  }

  /**
   * Save cart token to localStorage
   */
  saveCartToken(token: string): void {
    localStorage.setItem(this.CART_TOKEN_KEY, token);
  }

  /**
   * Clear cart token from localStorage
   */
  clearCartToken(): void {
    localStorage.removeItem(this.CART_TOKEN_KEY);
  }

  /**
   * Get request headers with cart token or auth token
   */
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add cart token for anonymous users
    const cartToken = this.getCartToken();
    if (cartToken) {
      headers['X-Cart-Token'] = cartToken;
    }

    // Add auth token if user is logged in
    if (includeAuth) {
      const authToken = localStorage.getItem('access_token');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
    }

    return headers;
  }

  /**
   * Add product to cart
   */
  async addToCart(productId: number, quantity: number = 1): Promise<CartResponse> {
    const cartToken = this.getCartToken();
    const authToken = localStorage.getItem('access_token');

    const response = await fetch(`${this.BASE_URL}/add/`, {
      method: 'POST',
      headers: this.getHeaders(!!authToken),
      body: JSON.stringify({
        product_id: productId,
        quantity,
        cart_token: cartToken || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add item to cart');
    }

    const data: CartResponse = await response.json();

    // Save cart token on first add (for anonymous users)
    if (data.cart_token && !authToken) {
      this.saveCartToken(data.cart_token);
    }

    return data;
  }

  /**
   * Get all cart items
   */
  async getCart(): Promise<CartResponse> {
    const authToken = localStorage.getItem('access_token');
    const cartToken = this.getCartToken();

    // If no token and no auth, return empty cart
    if (!cartToken && !authToken) {
      return {
        success: true,
        total_items: 0,
        total_amount: 0,
        products: [],
        currency: 'NGN',
      };
    }

    const response = await fetch(`${this.BASE_URL}/`, {
      method: 'GET',
      headers: this.getHeaders(!!authToken),
    });

    if (!response.ok) {
      // If cart token expired, clear it and return empty cart
      if (response.status === 404) {
        this.clearCartToken();
        return {
          success: true,
          total_items: 0,
          total_amount: 0,
          products: [],
          currency: 'NGN',
        };
      }
      throw new Error('Failed to fetch cart');
    }

    const data: CartResponse = await response.json();
    return data;
  }

  /**
   * Update item quantity
   */
  async updateQuantity(productId: number, quantity: number): Promise<CartResponse> {
    const cartToken = this.getCartToken();
    const authToken = localStorage.getItem('access_token');

    const response = await fetch(`${this.BASE_URL}/update/`, {
      method: 'POST',
      headers: this.getHeaders(!!authToken),
      body: JSON.stringify({
        product_id: productId,
        quantity,
        cart_token: cartToken || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update cart');
    }

    return response.json();
  }

  /**
   * Remove item from cart
   */
  async removeItem(productId: number): Promise<CartResponse> {
    const cartToken = this.getCartToken();
    const authToken = localStorage.getItem('access_token');

    const response = await fetch(`${this.BASE_URL}/remove/`, {
      method: 'POST',
      headers: this.getHeaders(!!authToken),
      body: JSON.stringify({
        product_id: productId,
        cart_token: cartToken || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to remove item');
    }

    return response.json();
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<CartResponse> {
    const cartToken = this.getCartToken();
    const authToken = localStorage.getItem('access_token');

    const response = await fetch(`${this.BASE_URL}/clear/`, {
      method: 'POST',
      headers: this.getHeaders(!!authToken),
      body: JSON.stringify({
        cart_token: cartToken || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return response.json();
  }

  /**
   * Get cart summary (count & total only)
   */
  async getCartSummary(): Promise<CartResponse> {
    const authToken = localStorage.getItem('access_token');
    const cartToken = this.getCartToken();

    if (!cartToken && !authToken) {
      return {
        success: true,
        total_items: 0,
        total_amount: 0,
      };
    }

    const response = await fetch(`${this.BASE_URL}/summary/`, {
      method: 'GET',
      headers: this.getHeaders(!!authToken),
    });

    if (!response.ok) {
      if (response.status === 404) {
        this.clearCartToken();
        return {
          success: true,
          total_items: 0,
          total_amount: 0,
        };
      }
      throw new Error('Failed to fetch cart summary');
    }

    return response.json();
  }

  /**
   * Merge anonymous cart after login
   */
  async mergeCart(): Promise<void> {
    const cartToken = this.getCartToken();
    const authToken = localStorage.getItem('access_token');

    // Only merge if we have both tokens
    if (!cartToken || !authToken) {
      return;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/merge/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          cart_token: cartToken,
        }),
      });

      if (response.ok) {
        // Clear cart token after successful merge
        this.clearCartToken();
        console.log('Cart merged successfully');
      } else {
        console.error('Failed to merge cart');
      }
    } catch (error) {
      console.error('Error merging cart:', error);
    }
  }
}

export const cartService = new CartService();
