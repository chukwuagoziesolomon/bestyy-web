const API_URL = process.env.REACT_APP_API_URL || 'https://051ed38dde90.ngrok-free.app';

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

export async function fetchUserOrders(token: string) {
  const API_URL = process.env.REACT_APP_API_URL || 'https://051ed38dde90.ngrok-free.app';
  const response = await fetch(`${API_URL}/user/orders/user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch orders';
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