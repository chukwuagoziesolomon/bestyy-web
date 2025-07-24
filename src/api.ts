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
export const API_URL = process.env.REACT_APP_API_URL || 'https://bestie-server.onrender.com';

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
  const API_URL = 'https://bestie-server.onrender.com';
  const url = `${API_URL}/user/orders/user/`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };
  console.log('Order tracking endpoint:', url);
  console.log('Order tracking headers:', headers);
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  console.log('Order tracking response status:', response.status);
  let responseBody;
  try {
    responseBody = await response.clone().json();
    console.log('Order tracking response body:', responseBody);
  } catch (e) {
    responseBody = null;
    console.log('Order tracking response not JSON:', e);
  }
  if (!response.ok) {
    let errorMsg = 'Failed to fetch orders';
    try {
      const errorData = responseBody || await response.json();
      errorMsg = errorData?.message || errorMsg;
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
  const response = await fetch(`${API_URL}/orders/vendor/tracking/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
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