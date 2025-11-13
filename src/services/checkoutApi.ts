// Checkout API service
export interface CheckoutPayload {
  cart_items: { menu_item_id: number; quantity: number }[];
  user: {
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    password?: string;
  };
  address: {
    address_type: 'home' | 'office' | 'other';
    label: string;
    street_address: string;
    city: string;
    state: string;
    postal_code?: string;
    landmark?: string;
    phone: string;
    is_default?: boolean;
  };
  payment_method: 'bank_transfer' | 'debit_card' | 'crypto';
  crypto_currency?: string;
}

class CheckoutApiService {
  // Use /api/user/orders/ for order placement (use absolute if API URL provided, else relative)
  private baseUrl =
    (process.env.REACT_APP_API_URL
      ? `${String(process.env.REACT_APP_API_URL).replace(/\/+$/, '')}/api/user/orders/`
      : '/api/user/orders/'); // uses REACT_APP_API_URL

  async createCheckout(payload: CheckoutPayload): Promise<any> {
    // Debug log to verify endpoint
    console.log('Creating order via:', this.baseUrl);
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('access_token') && {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }),
      },
      credentials: 'include', // Include Django session cookies for guest orders
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Checkout failed: ${response.status} ${text}`);
    }
    return response.json();
  }
}

export const checkoutApi = new CheckoutApiService();


