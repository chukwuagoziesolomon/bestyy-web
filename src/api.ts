export const API_URL = process.env.REACT_APP_API_URL || 'https://bestie-server.onrender.com';

// Courier dashboard endpoints
export async function fetchCourierDashboardMetrics(token: string) {
  const response = await fetch(`${API_URL}/api/user/courier/dashboard/metrics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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
      'Authorization': `Token ${token}`,
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
      'Authorization': `Token ${token}`,
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
  phone: string;
  password: string;
  confirm_password: string;
}) {
  const url = `${API_URL}/api/user/register/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    let errorMsg = 'User registration failed';
    try {
      const errorData = await response.json();
      errorMsg = extractErrorMessage(errorData) || errorMsg;
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

export async function loginUser(email: string, password: string) {
  const payload = { email, password };
  console.log('Login endpoint:', `${API_URL}/user/login/`);
  console.log('Login payload:', payload);
  const response = await fetch(`${API_URL}/user/login/`, {
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
      errorMsg = extractErrorMessage(errorData) || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function signupUser({
  user,
  phone
}: {
  user: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
  };
  phone: string;
}) {
  const payload = { user, phone };
  console.log('Signup endpoint:', `${API_URL}/user/signup/user/`);
  console.log('Signup payload:', payload);
  const response = await fetch(`${API_URL}/user/signup/user/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let errorMsg = 'Sign up failed';
    try {
      const errorData = await response.json();
      errorMsg = extractErrorMessage(errorData) || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function signupVendor(vendorData: {
  user: {
    username: string;
    email: string;
    password: string;
    confirm_password: string; // Re-adding this field
    first_name: string;
    last_name: string;
  };
  phone: string;
  business_name: string;
  business_category: string;
  cac_number?: string;
  logo?: string;
  business_address: string;
  delivery_radius: string;
  service_areas: string;
  opening_hours: string; // Expects HH:mm:ss
  closing_hours: string; // Expects HH:mm:ss
  offers_delivery: boolean;
}) {
  const payload = vendorData;
  console.log('Vendor signup endpoint:', `${API_URL}/user/signup/vendor/`);
  console.log('Vendor signup payload:', payload);
  const response = await fetch(`${API_URL}/user/signup/vendor/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let errorMsg = 'Vendor sign up failed';
    try {
      const errorData = await response.json();
      errorMsg = extractErrorMessage(errorData) || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUserOrders(token: string) {
  const url = `${API_URL}/user/orders/user/`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  console.log('=== USER ORDERS API DEBUG ===');
  console.log('URL:', url);
  console.log('Token (first 10 chars):', token.substring(0, 10) + '...');
  console.log('Headers:', headers);
  console.log('============================');

  const response = await fetch(url, {
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

export async function fetchUserAddresses(token: string) {
  const response = await fetch(`${API_URL}/user/addresses/user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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

export async function createUserAddress(token: string, address: any) {
  const response = await fetch(`${API_URL}/user/addresses/user/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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

export async function updateUserAddress(token: string, id: number, address: any) {
  const response = await fetch(`${API_URL}/user/addresses/user/${id}/update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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
  const response = await fetch(`${API_URL}/user/addresses/user/${id}/delete/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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

export async function fetchUserFavorites(token: string) {
  const response = await fetch(`${API_URL}/user/favorites/user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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

export async function fetchUserProfile(token: string) {
  const response = await fetch(`${API_URL}/user/profile/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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
  const response = await fetch(`${API_URL}/user/profile/update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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

export async function fetchDashboardAnalytics(token: string) {
  const response = await fetch(`${API_URL}/analytics/dashboard/analytics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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
  const response = await fetch(`${API_URL}/user/vendor/menu-items/`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch menu items');
  return response.json();
}

export async function createMenuItem(token: string, item: {
  dish_name: string;
  item_description: string;
  price: string;
  category: string;
  quantity: number;
  image?: File;
  available_now: boolean;
}) {
  const formData = new FormData();
  formData.append('dish_name', item.dish_name);
  formData.append('item_description', item.item_description);
  formData.append('price', item.price);
  formData.append('category', item.category);
  formData.append('quantity', item.quantity.toString());
  if (item.image) {
    formData.append('image', item.image);
  }
  formData.append('available_now', item.available_now ? 'true' : 'false');

  const response = await fetch(`${API_URL}/user/vendor/menu-items/create/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create menu item');
  return response.json();
}

export async function getMenuItem(token: string, id: string) {
  const response = await fetch(`${API_URL}/user/vendor/menu-items/${id}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch menu item');
  return response.json();
}

export async function updateMenuItem(token: string, id: string, item: Partial<{
  dish_name: string;
  price: number; // Changed to number for type safety
  category: string;
  image?: File | string; // Allow File for uploads
  available: boolean;
}>) {
  const formData = new FormData();
  
  if (item.dish_name) formData.append('dish_name', item.dish_name);
  if (item.price !== undefined) formData.append('price', item.price.toString());
  if (item.category) formData.append('category', item.category);
  if (item.image instanceof File) {
    formData.append('image', item.image);
  }
  if (typeof item.available === 'boolean') {
    formData.append('available', item.available ? 'true' : 'false');
  }

  const response = await fetch(`${API_URL}/user/vendor/menu-items/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = 'Failed to update menu item';
    try {
      const errorData = await response.json();
      errorMsg = extractErrorMessage(errorData) || errorMsg;
    } catch (e) {
      // Ignore if response is not JSON
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function deleteMenuItem(token: string, id: string) {
  const response = await fetch(`${API_URL}/user/vendor/menu-items/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to delete menu item');
  return true;
}

// Fetch vendor orders for tracking
export async function fetchVendorOrders(token: string) {
  const url = `${API_URL}/orders/vendor/tracking/`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
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



function extractErrorMessage(errorData: any): string | null {
  if (!errorData) return null;
  if (typeof errorData === 'string') return errorData;
  if (Array.isArray(errorData)) return errorData.join(' ');
  if (typeof errorData === 'object') {
    // Recursively extract messages from nested objects
    return Object.values(errorData)
      .map((v) => (typeof v === 'string' ? v : extractErrorMessage(v)))
      .join(' ');
  }
  return null;
}

// Add more API functions (order tracking, etc.) as needed 