// Vendor Transactions API Functions

import { API_URL } from './api';

// Fetch vendor transactions with filtering
export async function fetchVendorTransactions(
  token: string, 
  params: {
    page?: number;
    page_size?: number;
    status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'completed' | 'cancelled';
    start_date?: string;
    end_date?: string;
    payment_status?: 'pending' | 'completed' | 'failed';
    search?: string;
  } = {}
) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  if (params.payment_status) queryParams.append('payment_status', params.payment_status);
  if (params.search) queryParams.append('search', params.search);

  const url = `${API_URL}/api/user/vendors/transactions/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch vendor transactions: ${response.statusText}`);
  }

  return response.json();
}

// Get transaction summary
export async function fetchTransactionSummary(token: string, days: number = 30) {
  const response = await fetch(`${API_URL}/api/user/vendors/transactions/summary/?days=${days}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch transaction summary: ${response.statusText}`);
  }

  return response.json();
}

// Get earnings breakdown
export async function fetchEarningsBreakdown(token: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
  const response = await fetch(`${API_URL}/api/user/vendors/transactions/earnings/?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch earnings breakdown: ${response.statusText}`);
  }

  return response.json();
}

// Get payment history
export async function fetchPaymentHistory(token: string) {
  const response = await fetch(`${API_URL}/api/user/vendors/transactions/payments/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch payment history: ${response.statusText}`);
  }

  return response.json();
}

// Get transaction analytics
export async function fetchTransactionAnalytics(token: string) {
  const response = await fetch(`${API_URL}/api/user/vendors/transactions/analytics/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch transaction analytics: ${response.statusText}`);
  }

  return response.json();
}
