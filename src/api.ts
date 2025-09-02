export const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Courier dashboard endpoints
export async function fetchCourierDashboardMetrics(token: string) {
  const response = await fetch(`${API_URL}/api/user/courier/dashboard/metrics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch courier metrics');
  return await response.json();
}

export async function fetchCourierDeliveries(token: string, status?: string) {
  const url = new URL(`${API_URL}/api/user/courier/deliveries/`);
  if (status) url.searchParams.append('status', status);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch deliveries');
  return await response.json();
}

// Fetch vendor transactions and total amount for payouts
export async function fetchVendorTransactions(token: string) {
  const response = await fetch(`${API_URL}/analytics/vendor/transactions/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch transactions';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// JWT Login via dj-rest-auth
// Endpoint: POST /api/auth/login/ returns {access, refresh}
export async function loginJwt(email: string, password: string) {
  const url = `${API_URL}/api/auth/login/`;
  const payload = { email, password };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let errorMsg = 'Login failed';
    try {
      const errorData = await response.json();
      errorMsg = extractErrorMessage(errorData) || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json() as Promise<{ access: string; refresh: string }>;
}

// Current user (requires Authorization: Bearer <access>)
export async function getCurrentUser(accessToken: string) {
  const url = `${API_URL}/api/auth/user/`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch current user';
    try {
      const errorData = await response.json();
      errorMsg = extractErrorMessage(errorData) || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// Simple User Registration (public)
// Endpoint: POST /api/user/register/
export async function registerUser(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  confirm_password: string;
}) {
  const response = await fetch(`${API_URL}/api/user/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorMsg = 'Registration failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// Courier Registration API
// Endpoint: POST /api/user/couriers/register/
// Supports JSON or multipart/form-data when files are provided
export async function registerCourier(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  service_areas: string;
  delivery_radius: string;
  opening_hours: string; // HH:MM or HH:MM:SS
  closing_hours: string; // HH:MM or HH:MM:SS
  verification_preference: 'NIN' | 'DL' | 'VC';
  agreed_to_terms: boolean;
  has_bike?: boolean;
  nin_number?: string;
  vehicle_type?: 'bike' | 'car' | 'van' | 'other';
  id_upload?: File | null;
  profile_photo?: File | null;
}) {
  const hasFiles = !!(data.id_upload || data.profile_photo);

  const url = `${API_URL}/api/user/couriers/register/`;
  console.log('Courier register endpoint:', url);

  let response: Response;
  if (hasFiles) {
    const form = new FormData();
    form.append('email', data.email);
    form.append('password', data.password);
    form.append('first_name', data.first_name);
    form.append('last_name', data.last_name);
    form.append('phone', data.phone);
    form.append('service_areas', data.service_areas);
    form.append('delivery_radius', data.delivery_radius);
    form.append('opening_hours', data.opening_hours);
    form.append('closing_hours', data.closing_hours);
    form.append('verification_preference', data.verification_preference);
    form.append('agreed_to_terms', data.agreed_to_terms ? 'true' : 'false');
    if (typeof data.has_bike === 'boolean') form.append('has_bike', data.has_bike ? 'true' : 'false');
    if (data.nin_number) form.append('nin_number', data.nin_number);
    if (data.vehicle_type) form.append('vehicle_type', data.vehicle_type);
    if (data.id_upload instanceof File) form.append('id_upload', data.id_upload);
    if (data.profile_photo instanceof File) form.append('profile_photo', data.profile_photo);

    response = await fetch(url, {
      method: 'POST',
      body: form,
    });
  } else {
    // JSON path
    const { id_upload, profile_photo, ...jsonData } = data as any;
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData),
    });
  }

  if (!response.ok) {
    let errorMsg = 'Courier registration failed';
    try {
      const errorData = await response.json();
      errorMsg = extractErrorMessage(errorData) || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// Helper function to extract error messages
function extractErrorMessage(errorData: any): string | null {
  if (typeof errorData === 'string') return errorData;
  if (errorData?.message) return errorData.message;
  if (errorData?.detail) return errorData.detail;
  if (errorData?.error) return errorData.error;
  if (typeof errorData === 'object') {
    const firstKey = Object.keys(errorData)[0];
    if (firstKey && Array.isArray(errorData[firstKey])) {
      return errorData[firstKey][0];
    }
  }
  return null;
}

export async function loginUser(email: string, password: string) {
  const payload = { email, password };
  console.log('Login endpoint:', `${API_URL}/api/user/login/`);
  console.log('Login payload:', payload);
  const response = await fetch(`${API_URL}/api/user/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let errorMsg = 'Login failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function signupUser(user: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}) {
  const payload = { user, phone: user.phone };
  console.log('Signup endpoint:', `${API_URL}/api/user/signup/user/`);
  console.log('Signup payload:', payload);
  const response = await fetch(`${API_URL}/api/user/signup/user/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let errorMsg = 'Signup failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function signupVendor(vendorData: {
  user: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_description: string;
  business_category: string;
  business_hours: string;
  business_days: string;
  business_logo?: File;
  business_banner?: File;
  business_license?: File;
  business_permit?: File;
  business_insurance?: File;
  business_tax_id?: File;
  business_bank_account?: File;
  business_bank_statement?: File;
  business_utility_bill?: File;
  business_lease_agreement?: File;
  business_other_documents?: File[];
}) {
  const payload = vendorData;
  console.log('Vendor signup endpoint:', `${API_URL}/api/user/signup/vendor/`);
  console.log('Vendor signup payload:', payload);
  const response = await fetch(`${API_URL}/api/user/signup/vendor/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let errorMsg = 'Vendor signup failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUserOrders(token: string, params?: {
  status?: string;
  start_date?: string;
  end_date?: string;
  vendor_id?: number;
  page?: number;
  page_size?: number;
}) {
  const url = new URL(`${API_URL}/api/user/orders/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.status) url.searchParams.append('status', params.status);
    if (params.start_date) url.searchParams.append('start_date', params.start_date);
    if (params.end_date) url.searchParams.append('end_date', params.end_date);
    if (params.vendor_id) url.searchParams.append('vendor_id', params.vendor_id.toString());
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString());
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  console.log('=== USER ORDERS API DEBUG ===');
  console.log('URL:', url.toString());
  console.log('Token (first 10 chars):', token.substring(0, 10) + '...');
  console.log('Headers:', headers);
  console.log('============================');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  console.log('=== USER ORDERS RESPONSE DEBUG ===');
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  console.log('=================================');

  let responseBody;
  try {
    responseBody = await response.clone().json();
    console.log('Response body:', responseBody);
  } catch (e) {
    responseBody = null;
    console.log('Response not JSON:', e);
  }

  if (!response.ok) {
    let errorMsg = 'Failed to fetch orders';
    try {
      const errorData = responseBody || await response.json();
      console.error('Error response data:', errorData);
      errorMsg = errorData?.message || errorData?.detail || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return responseBody || response.json();
}

// Fetch order details for a specific order
export async function fetchOrderDetails(token: string, orderId: string) {
  const response = await fetch(`${API_URL}/api/user/orders/${orderId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    let errorMsg = 'Failed to fetch order details';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// Fetch order tracking information
export async function fetchOrderTracking(token: string, orderId: string) {
  const response = await fetch(`${API_URL}/api/user/orders/${orderId}/tracking/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    let errorMsg = 'Failed to fetch order tracking';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUserAddresses(token: string) {
  const response = await fetch(`${API_URL}/api/user/addresses/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch addresses';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function createUserAddress(token: string, address: {
  address_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default?: boolean;
}) {
  const response = await fetch(`${API_URL}/api/user/addresses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create address';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function updateUserAddress(token: string, id: number, address: {
  address_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default?: boolean;
}) {
  const response = await fetch(`${API_URL}/api/user/addresses/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update address';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function deleteUserAddress(token: string, id: number) {
  const response = await fetch(`${API_URL}/api/user/addresses/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to delete address';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function setDefaultAddress(token: string, id: number) {
  const response = await fetch(`${API_URL}/api/user/addresses/${id}/set-default/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to set default address';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUserFavorites(token: string) {
  const response = await fetch(`${API_URL}/api/user/favorites/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch favorites';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUserFoodFavorites(token: string) {
  const response = await fetch(`${API_URL}/api/user/favorites/food/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch food favorites';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUserVenueFavorites(token: string) {
  const response = await fetch(`${API_URL}/api/user/favorites/venues/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch venue favorites';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function addFoodFavorite(token: string, foodItemId: number) {
  const response = await fetch(`${API_URL}/api/user/favorites/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      favorite_type: 'food',
      food_item: foodItemId
    }),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to add food favorite';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function addVenueFavorite(token: string, vendorId: number) {
  const response = await fetch(`${API_URL}/api/user/favorites/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      favorite_type: 'venue',
      vendor: vendorId
    }),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to add venue favorite';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function removeFavorite(token: string, favoriteId: number) {
  const response = await fetch(`${API_URL}/api/user/favorites/${favoriteId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to remove favorite';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUserProfile(token: string) {
  const response = await fetch(`${API_URL}/api/user/profile/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch profile';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function updateUserProfile(token: string, profileData: any) {
  const response = await fetch(`${API_URL}/api/user/profile/update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update profile';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// Dashboard Analytics API
export async function fetchDashboardAnalytics(token: string) {
  const response = await fetch(`${API_URL}/api/analytics/dashboard/analytics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch analytics';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// Menu Item API for Vendor
export async function listMenuItems(token: string) {
  const response = await fetch(`${API_URL}/api/user/vendor/menu-items/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch menu items';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function createMenuItem(token: string, item: any) {
  const formData = new FormData();
  formData.append('name', item.name);
  formData.append('description', item.description);
  formData.append('price', item.price);
  formData.append('category', item.category);
  formData.append('available_now', item.available_now ? 'true' : 'false');

  const response = await fetch(`${API_URL}/api/user/vendor/menu-items/create/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create menu item';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function getMenuItem(token: string, id: string) {
  const response = await fetch(`${API_URL}/api/user/vendor/menu-items/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch menu item';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function updateMenuItem(token: string, id: string, item: any) {
  const formData = new FormData();
  formData.append('name', item.name);
  formData.append('description', item.description);
  formData.append('price', item.price);
  formData.append('category', item.category);
  formData.append('available_now', item.available_now ? 'true' : 'false');

  const response = await fetch(`${API_URL}/api/user/vendor/menu-items/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update menu item';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function deleteMenuItem(token: string, id: string) {
  const response = await fetch(`${API_URL}/api/user/vendor/menu-items/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to delete menu item';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

// Fetch vendor orders for tracking
export async function fetchVendorOrders(token: string) {
  const url = `${API_URL}/api/orders/vendor/tracking/`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  console.log('=== VENDOR ORDERS API DEBUG ===');
  console.log('URL:', url);
  console.log('Token (first 10 chars):', token.substring(0, 10) + '...');
  console.log('Headers:', headers);
  console.log('==============================');

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  console.log('=== VENDOR ORDERS RESPONSE DEBUG ===');
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  console.log('===================================');

  let responseBody;
  try {
    responseBody = await response.clone().json();
    console.log('Response body:', responseBody);
  } catch (e) {
    responseBody = null;
    console.log('Response not JSON:', e);
  }

  if (!response.ok) {
    let errorMsg = 'Failed to fetch vendor orders';
    try {
      const errorData = responseBody || await response.json();
      console.error('Error response data:', errorData);
      errorMsg = errorData?.message || errorData?.detail || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return responseBody || response.json();
} 