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



// Fetch courier deliveries
export async function fetchCourierDeliveries(token: string, params?: {
  status?: string;
  page?: number;
  page_size?: number;
}) {
  const url = new URL(`${API_URL}/api/user/couriers/deliveries/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.status) url.searchParams.append('status', params.status);
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString());
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch deliveries';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch courier payout history
export async function fetchCourierPayoutHistory(token: string, params?: {
  period?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) {
  const url = new URL(`${API_URL}/api/user/couriers/payouts/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.period) url.searchParams.append('period', params.period);
    if (params.start_date) url.searchParams.append('start_date', params.start_date);
    if (params.end_date) url.searchParams.append('end_date', params.end_date);
    if (params.status) url.searchParams.append('status', params.status);
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch payout history';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch courier earnings breakdown
export async function fetchCourierEarningsBreakdown(token: string, params?: {
  year?: number;
  month?: number;
}) {
  const url = new URL(`${API_URL}/api/user/couriers/earnings/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.year) url.searchParams.append('year', params.year.toString());
    if (params.month) url.searchParams.append('month', params.month.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch earnings breakdown';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch courier company analytics
export async function fetchCourierCompanyAnalytics(token: string, params?: {
  year?: number;
  month?: number;
}) {
  const url = new URL(`${API_URL}/api/user/couriers/companies/analytics/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.year) url.searchParams.append('year', params.year.toString());
    if (params.month) url.searchParams.append('month', params.month.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch company analytics';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
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
  
  const result = await response.json();
  console.log('Courier registration response:', result);
  return result;
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
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  phone: string;
  business_name: string;
  business_category: string;
  cac_number: string;
  business_description: string;
  business_address: string;
  delivery_radius: string;
  service_areas: string;
  opening_hours: string;
  closing_hours: string;
  offers_delivery: boolean;
}) {
  const payload = {
    email: vendorData.email,
    password: vendorData.password,
    first_name: vendorData.first_name,
    last_name: vendorData.last_name,
    phone: vendorData.phone,
    business_name: vendorData.business_name,
    business_category: vendorData.business_category,
    cac_number: vendorData.cac_number,
    business_description: vendorData.business_description,
    business_address: vendorData.business_address,
    delivery_radius: vendorData.delivery_radius,
    service_areas: vendorData.service_areas,
    opening_hours: vendorData.opening_hours,
    closing_hours: vendorData.closing_hours,
    offers_delivery: vendorData.offers_delivery
  };
  
  console.log('Vendor signup endpoint:', `${API_URL}/api/user/vendors/register/`);
  console.log('Vendor signup payload:', payload);
  
  const response = await fetch(`${API_URL}/api/user/vendors/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    let errorMsg = 'Vendor signup failed';
    let errorDetails = '';
    
    try {
      const errorData = await response.json();
      console.log('Vendor signup error response:', errorData);
      
      // Extract error message from various possible response structures
      if (errorData?.message) {
        errorMsg = errorData.message;
      } else if (errorData?.error) {
        errorMsg = errorData.error;
      } else if (errorData?.detail) {
        errorMsg = errorData.detail;
      } else if (errorData?.non_field_errors) {
        errorMsg = Array.isArray(errorData.non_field_errors) 
          ? errorData.non_field_errors.join(', ') 
          : errorData.non_field_errors;
      } else if (errorData?.email) {
        errorMsg = `Email: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`;
      } else if (errorData?.password) {
        errorMsg = `Password: ${Array.isArray(errorData.password) ? errorData.password.join(', ') : errorData.password}`;
      } else if (errorData?.business_name) {
        errorMsg = `Business Name: ${Array.isArray(errorData.business_name) ? errorData.business_name.join(', ') : errorData.business_name}`;
      } else if (errorData?.phone) {
        errorMsg = `Phone: ${Array.isArray(errorData.phone) ? errorData.phone.join(', ') : errorData.phone}`;
      } else if (typeof errorData === 'object') {
        // If it's an object with field-specific errors, collect them
        const fieldErrors = Object.entries(errorData)
          .filter(([key, value]) => Array.isArray(value) && value.length > 0)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        
        if (fieldErrors) {
          errorMsg = fieldErrors;
        }
      }
      
      // Add additional context if available
      if (errorData?.status_code) {
        errorDetails = ` (Status: ${errorData.status_code})`;
      }
      
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      errorMsg = `Vendor signup failed with status ${response.status}`;
    }
    
    const fullErrorMessage = errorMsg + errorDetails;
    console.error('Vendor signup error:', fullErrorMessage);
    throw new Error(fullErrorMessage);
  }
  
  const result = await response.json();
  console.log('Vendor registration response:', result);
  return result;
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
  const response = await fetch(`${API_URL}/api/user/vendors/menu/`, {
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


export async function getMenuItem(token: string, id: string) {
  const response = await fetch(`${API_URL}/api/user/vendors/menu/${id}/`, {
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
  formData.append('dish_name', item.dish_name);
  formData.append('item_description', item.item_description);
  formData.append('price', item.price);
  formData.append('category', item.category);
  formData.append('available_now', item.available_now ? 'true' : 'false');
  
  // Handle image upload - append the file if it's a new File upload
  if (item.image && item.image instanceof File) {
    formData.append('image', item.image);
  }

  const response = await fetch(`${API_URL}/api/user/vendors/menu/${id}/`, {
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
  const response = await fetch(`${API_URL}/api/user/vendors/menu/${id}/`, {
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
}// Fetch vendor payout history
export async function fetchVendorPayoutHistory(token: string, params?: {
  period?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) {
  const url = new URL(`${API_URL}/api/user/vendors/payouts/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.period) url.searchParams.append('period', params.period);
    if (params.start_date) url.searchParams.append('start_date', params.start_date);
    if (params.end_date) url.searchParams.append('end_date', params.end_date);
    if (params.status) url.searchParams.append('status', params.status);
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch vendor payout history';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch vendor earnings breakdown
export async function fetchVendorEarningsBreakdown(token: string, params?: {
  year?: number;
  month?: number;
}) {
  const url = new URL(`${API_URL}/api/user/vendors/earnings/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.year) url.searchParams.append('year', params.year.toString());
    if (params.month) url.searchParams.append('month', params.month.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch vendor earnings breakdown';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch vendor dashboard analytics
export async function fetchVendorAnalytics(token: string, params?: {
  month?: number;
  year?: number;
}) {
  const url = new URL(`${API_URL}/api/user/dashboard/analytics/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.month) url.searchParams.append('month', params.month.toString());
    if (params.year) url.searchParams.append('year', params.year.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch vendor analytics';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch vendor sales chart data
export async function fetchVendorSalesChart(token: string, params?: {
  month?: number;
  year?: number;
  period?: 'daily' | 'weekly' | 'monthly';
}) {
  const url = new URL(`${API_URL}/api/user/vendors/sales-chart/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.month) url.searchParams.append('month', params.month.toString());
    if (params.year) url.searchParams.append('year', params.year.toString());
    if (params.period) url.searchParams.append('period', params.period);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch vendor sales chart';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch vendor orders list
export async function fetchVendorOrdersList(token: string, params?: {
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
  sort_by?: 'created_at' | 'total_price' | 'status';
  sort_order?: 'asc' | 'desc';
}) {
  const url = new URL(`${API_URL}/api/user/vendors/orders/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.search) url.searchParams.append('search', params.search);
    if (params.status) url.searchParams.append('status', params.status);
    if (params.start_date) url.searchParams.append('start_date', params.start_date);
    if (params.end_date) url.searchParams.append('end_date', params.end_date);
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString());
    if (params.sort_by) url.searchParams.append('sort_by', params.sort_by);
    if (params.sort_order) url.searchParams.append('sort_order', params.sort_order);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch vendor orders';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Create menu item with variants support
export async function createMenuItem(token: string, menuData: {
  dish_name: string;
  item_description: string;
  price: string;
  category: string;
  image?: File;
  available_now?: boolean;
  quantity?: number;
  variants?: Array<{
    name: string;
    type: 'size' | 'extra' | 'addon' | 'substitute';
    price_modifier: number;
    is_required?: boolean;
    is_available?: boolean;
    sort_order?: number;
  }>;
}) {
  const formData = new FormData();
  
  // Add text fields
  formData.append('dish_name', menuData.dish_name);
  formData.append('item_description', menuData.item_description);
  formData.append('price', menuData.price);
  formData.append('category', menuData.category);
  
  // Add optional fields
  if (menuData.available_now !== undefined) {
    formData.append('available_now', menuData.available_now.toString());
  }
  if (menuData.quantity !== undefined) {
    formData.append('quantity', menuData.quantity.toString());
  }
  
  // Add variants if provided
  if (menuData.variants && menuData.variants.length > 0) {
    formData.append('variants', JSON.stringify(menuData.variants));
  }
  
  // Add image file if provided
  if (menuData.image) {
    formData.append('image', menuData.image);
  }

  const response = await fetch(`${API_URL}/api/user/vendors/menu/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to create menu item: ${response.statusText}`);
  }

  return response.json();
}

// Get menu item customization options
export async function getMenuItemCustomization(itemId: number) {
  const response = await fetch(`${API_URL}/api/user/menu-items/${itemId}/customize/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to get customization options: ${response.statusText}`);
  }

  return response.json();
}

// Fetch vendor menu items
export async function fetchVendorMenuItems(token: string, params?: {
  category?: string;
  available_only?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}) {
  const url = new URL(`${API_URL}/api/user/vendors/menu/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.category) url.searchParams.append('category', params.category);
    if (params.available_only !== undefined) url.searchParams.append('available_only', params.available_only.toString());
    if (params.search) url.searchParams.append('search', params.search);
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch menu items: ${response.statusText}`);
  }

  return response.json();
}

// Stock Management API Functions

// Fetch stock items with filtering
export async function fetchVendorStockItems(
  token: string, 
  params: {
    page?: number;
    page_size?: number;
    availability?: boolean;
    stock_status?: 'in_stock' | 'out_of_stock' | 'low_stock';
    category?: string;
    search?: string;
  } = {}
) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params.availability !== undefined) queryParams.append('availability', params.availability.toString());
  if (params.stock_status) queryParams.append('stock_status', params.stock_status);
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);

  const url = `${API_URL}/api/user/vendors/stock/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch stock items: ${response.statusText}`);
  }

  return response.json();
}

// Quick toggle availability
export async function toggleStockItemAvailability(token: string, itemId: number) {
  const response = await fetch(`${API_URL}/api/user/vendors/stock/${itemId}/toggle/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to toggle item availability: ${response.statusText}`);
  }

  return response.json();
}

// Get stock summary
export async function fetchStockSummary(token: string) {
  const response = await fetch(`${API_URL}/api/user/vendors/stock/summary/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch stock summary: ${response.statusText}`);
  }

  return response.json();
}

// Fetch vendor top dishes
export async function fetchVendorTopDishes(token: string, params?: {
  period?: 'week' | 'month' | 'year';
  limit?: number;
}) {
  const url = new URL(`${API_URL}/api/user/vendors/dashboard/top-dishes/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.period) url.searchParams.append('period', params.period);
    if (params.limit) url.searchParams.append('limit', params.limit.toString());
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch top dishes';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Fetch vendor order activity
export async function fetchVendorOrderActivity(token: string, params?: {
  period?: 'week' | 'month' | 'year';
}) {
  const url = new URL(`${API_URL}/api/user/vendors/dashboard/order-activity/`);
  
  // Add query parameters if provided
  if (params) {
    if (params.period) url.searchParams.append('period', params.period);
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
  let errorMsg = 'Failed to fetch order activity';
  try {
    const errorData = await response.json();
    errorMsg = errorData?.message || errorMsg;
  } catch {}
  throw new Error(errorMsg);
}

return response.json();
}

// Guest Order API Functions
export async function createGuestOrder(orderData: {
  guestInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    city: string;
    deliveryInstructions?: string;
  };
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    customizations?: any;
    totalPrice: number;
  }>;
  vendor: {
    id?: number;
    business_name?: string;
    business_address?: string;
  };
  total: number;
  deliveryFee: number;
  paymentMethod: string;
  paymentReference?: string;
}) {
  const response = await fetch(`${API_URL}/api/guest/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_info: {
        first_name: orderData.guestInfo.firstName,
        last_name: orderData.guestInfo.lastName,
        phone: orderData.guestInfo.phone,
        email: orderData.guestInfo.email,
        delivery_address: orderData.guestInfo.deliveryAddress,
        city: orderData.guestInfo.city,
        delivery_instructions: orderData.guestInfo.deliveryInstructions || '',
      },
      vendor_id: orderData.vendor.id,
      items: orderData.cartItems.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations || {},
        total_price: item.totalPrice,
      })),
      total_amount: orderData.total,
      delivery_fee: orderData.deliveryFee,
      payment_method: orderData.paymentMethod,
      payment_reference: orderData.paymentReference,
      order_status: 'pending',
    }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to create guest order';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function getGuestOrderStatus(orderId: string, phone: string) {
  const response = await fetch(`${API_URL}/api/guest/orders/${orderId}/status/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch order status';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}