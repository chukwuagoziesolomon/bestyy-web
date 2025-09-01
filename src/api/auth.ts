import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_complete: boolean;
    role: string;
    roles?: string[]; // For users with multiple roles
  };
}

export const authService = {
  // Google OAuth URLs
  getGoogleAuthUrl: (type: 'login' | 'signup' | 'connect' = 'login'): string => {
    const baseUrl = `${API_URL}/api/user/social/google/`;
    switch (type) {
      case 'signup':
        return `${baseUrl}signup/`;
      case 'connect':
        return `${baseUrl}connect/`;
      case 'login':
      default:
        return baseUrl;
    }
  },

  // Handle Google OAuth callback
  handleGoogleCallback: async (code: string): Promise<LoginResponse> => {
    const response = await axios.get(`${API_URL}/api/auth/google/callback/`, {
      params: { code },
      withCredentials: true
    });
    return response.data;
  },

  // Complete profile for social signup
  completeProfile: async (data: {
    phone: string;
    address: string;
  }, token: string) => {
    const response = await axios.post(
      `${API_URL}/api/user/social/complete-profile/`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/auth/me/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string) => {
    const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
      refresh: refreshToken
    });
    return response.data;
  },

  // Logout
  logout: async (token: string) => {
    await axios.post(
      `${API_URL}/api/auth/logout/`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  },

  // Regular email/password login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/api/user/login/`, { 
      email, 
      password 
    });
    
    // If the backend doesn't return roles, set it from the role
    if (!response.data.user.roles) {
      response.data.user.roles = [response.data.user.role || 'user'];
    }
    
    return response.data;
  }
};

export default authService;
