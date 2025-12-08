import axios from 'axios';
import { authService } from '../api/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/user/login/',
  '/api/auth/login/',
  '/api/user/signup/',
  '/api/user/register/',
  '/api/user/vendors/register/',
  '/api/user/couriers/register/',
  '/api/token/refresh/',
  '/api/token/verify/',
];

// Helper to check if endpoint is public
function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip refresh for public endpoints
    if (isPublicEndpoint(originalRequest?.url || '')) {
      return Promise.reject(error);
    }
    
    // If the error status is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        // No refresh token available, clear storage and redirect to login
        console.log('❌ No refresh token available, redirecting to login');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('vendor_profile');
        localStorage.removeItem('courier_profile');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        console.log('🔄 Token expired, attempting refresh...');
        // Attempt to refresh the token
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/token/refresh/`,
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        const { access, refresh: newRefreshToken } = response.data;
        
        // Store the new tokens
        localStorage.setItem('access_token', access);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        
        console.log('✅ Token refreshed successfully');
        
        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        console.error('❌ Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('vendor_profile');
        localStorage.removeItem('courier_profile');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
