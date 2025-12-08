/**
 * Token Manager Utility
 * Handles JWT token validation, refresh, and expiration checking
 * Updated: December 7, 2025
 * 
 * Token Lifetimes:
 * - Access Token: 24 hours
 * - Refresh Token: 30 days (with auto-rotation)
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface TokenPayload {
  exp: number;
  token_type: string;
  user_id: number;
}

/**
 * Decode JWT token without verification (client-side only)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if token is expired (with 5-minute buffer)
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const currentTime = Date.now() / 1000;
  const bufferTime = 5 * 60; // 5 minutes buffer
  
  return decoded.exp < (currentTime + bufferTime);
}

/**
 * Get token expiration time remaining in seconds
 */
export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return 0;
  }
  
  const currentTime = Date.now() / 1000;
  const remaining = decoded.exp - currentTime;
  
  return remaining > 0 ? remaining : 0;
}

/**
 * Check if user is authenticated with valid token
 */
export function isAuthenticated(): boolean {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!accessToken || !refreshToken) {
    return false;
  }
  
  // Check if refresh token is expired
  if (isTokenExpired(refreshToken)) {
    console.log('❌ Refresh token expired');
    return false;
  }
  
  return true;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    console.error('❌ No refresh token available');
    return null;
  }
  
  try {
    console.log('🔄 Refreshing access token...');
    
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store new tokens
    localStorage.setItem('access_token', data.access);
    if (data.refresh) {
      // Update refresh token if server sent a new one (token rotation)
      localStorage.setItem('refresh_token', data.refresh);
    }
    
    console.log('✅ Access token refreshed successfully');
    return data.access;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    return null;
  }
}

/**
 * Verify token with backend
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/token/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

/**
 * Clear all authentication data and redirect to login
 */
export function clearAuthAndRedirect(message?: string): void {
  console.log('🚪 Clearing authentication and redirecting to login');
  
  if (message) {
    // Store message in sessionStorage to show on login page
    sessionStorage.setItem('auth_redirect_message', message);
  }
  
  // Clear all storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('vendor_profile');
  localStorage.removeItem('courier_profile');
  localStorage.removeItem('cart');
  sessionStorage.removeItem('temp_credentials');
  sessionStorage.removeItem('temp_profiles');
  
  // Redirect to login
  window.location.href = '/login';
}

/**
 * Validate and refresh token if needed
 * Returns true if user has valid authentication
 */
export async function validateAndRefreshToken(): Promise<boolean> {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  // No tokens at all
  if (!accessToken || !refreshToken) {
    return false;
  }
  
  // Check if refresh token is expired
  if (isTokenExpired(refreshToken)) {
    console.log('❌ Refresh token expired, user needs to login again');
    clearAuthAndRedirect('Your session has expired. Please log in again.');
    return false;
  }
  
  // If access token is expired or about to expire, refresh it
  if (isTokenExpired(accessToken)) {
    console.log('⏰ Access token expired, attempting refresh...');
    const newToken = await refreshAccessToken();
    
    if (!newToken) {
      console.log('❌ Failed to refresh token, redirecting to login');
      clearAuthAndRedirect('Your session has expired. Please log in again.');
      return false;
    }
    
    return true;
  }
  
  // Token is valid
  return true;
}

/**
 * Setup automatic token refresh
 * Refreshes token 1 hour before expiration
 */
export function setupAutoRefresh(): () => void {
  let intervalId: NodeJS.Timeout | null = null;
  
  const checkAndRefresh = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      return;
    }
    
    const timeRemaining = getTokenTimeRemaining(accessToken);
    const oneHour = 60 * 60; // 1 hour in seconds
    
    // If less than 1 hour remaining, refresh
    if (timeRemaining < oneHour && timeRemaining > 0) {
      console.log(`⏰ Token expires in ${Math.floor(timeRemaining / 60)} minutes, refreshing...`);
      await refreshAccessToken();
    }
  };
  
  // Check every 30 minutes
  intervalId = setInterval(checkAndRefresh, 30 * 60 * 1000);
  
  // Also check immediately
  checkAndRefresh();
  
  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

/**
 * Get authentication headers for API requests
 */
export function getAuthHeaders(): { Authorization: string } | {} {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get token info for debugging
 */
export function getTokenInfo(): {
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  accessTokenExpiry: string | null;
  refreshTokenExpiry: string | null;
  accessTokenValid: boolean;
  refreshTokenValid: boolean;
} {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  const getExpiryTime = (token: string | null): string | null => {
    if (!token) return null;
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000).toLocaleString();
  };
  
  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessTokenExpiry: getExpiryTime(accessToken),
    refreshTokenExpiry: getExpiryTime(refreshToken),
    accessTokenValid: accessToken ? !isTokenExpired(accessToken) : false,
    refreshTokenValid: refreshToken ? !isTokenExpired(refreshToken) : false,
  };
}
