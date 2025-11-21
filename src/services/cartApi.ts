// Cart API service
class CartApiService {
  private baseUrl = `${process.env.REACT_APP_API_URL}/api/user/cart`; // uses REACT_APP_API_URL [[memory:3559017]]

  async addItem(params: {
    menu_item_id: number;
    quantity?: number;
    special_instructions?: string;
    variants?: Record<string, any>;
  }): Promise<any> {
    const url = `${this.baseUrl}/add/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('access_token') && {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }),
      },
      body: JSON.stringify({
        menu_item_id: params.menu_item_id,
        quantity: params.quantity ?? 1,
        special_instructions: params.special_instructions ?? null,
        variants: params.variants ?? null,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Add to cart failed: ${response.status} ${text}`);
    }
    return response.json();
  }

  async getCart(): Promise<any> {
    const url = `${this.baseUrl}/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('access_token') && {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }),
      },
    });
    if (!response.ok) {
      throw new Error(`Get cart failed: ${response.status}`);
    }
    return response.json();
  }

  async removeItem(params: { cart_item_id: number; quantity?: number | null }): Promise<any> {
    const url = `${this.baseUrl}/remove/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('access_token') && {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }),
      },
      body: JSON.stringify({
        cart_item_id: params.cart_item_id,
        quantity: params.quantity ?? null,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Remove cart item failed: ${response.status} ${text}`);
    }
    return response.json();
  }
}

export const cartApi = new CartApiService();



