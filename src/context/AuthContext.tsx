import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
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

// Add a response interceptor to handle token refresh and 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/token/refresh/`,
            { refresh: refreshToken },
            {
              baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api`
            }
          );
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Retry the original request with new token
          return api(originalRequest);
        }
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_complete: boolean;
  role: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeProfile: (data: { phone: string; address: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Get fresh user data from the backend using the configured axios instance
        const { data } = await api.get('/user/me/');
        
        // Update user data in state and localStorage
        const userData = {
          id: data.id,
          email: data.email,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          profile_complete: data.profile_complete || false,
          role: data.role || 'user',
          ...data
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid token on error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth().catch(err => {
      console.error('Error in checkAuth:', err);
      setLoading(false);
    });
  }, []);

  // Handle Google OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const handleGoogleCallback = async () => {
      if (!code) return;
      
      try {
        setLoading(true);
        const { data } = await api.get(`/auth/google/callback?code=${code}`);
        
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        setUser(data.user);
        
        if (data.user.profile_complete) {
          navigate('/dashboard');
        } else {
          navigate('/complete-profile');
        }
      } catch (err) {
        console.error('Google auth failed:', err);
        setError('Failed to authenticate with Google');
        navigate('/login', { state: { error: 'google_auth_failed' } });
      } finally {
        setLoading(false);
      }
    };

    if (error) {
      setError('Google authentication was cancelled');
      navigate('/login', { state: { error: 'auth_cancelled' } });
    } else if (code) {
      handleGoogleCallback();
    }
  }, [searchParams, navigate]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/user/login/', { email, password });
      
      const { access, refresh, user } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Set the default authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Ensure user object has required fields
      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        profile_complete: user.profile_complete || false,
        role: user.role || 'user',
        ...user // Spread any additional user properties
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Redirect based on role and profile completion
      if (userData.profile_complete) {
        // Redirect based on user role
        switch(userData.role.toLowerCase()) {
          case 'vendor':
            navigate('/vendor/dashboard');
            break;
          case 'courier':
            navigate('/courier/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default: // Regular user
            navigate('/user/dashboard');
        }
      } else {
        navigate('/complete-profile');
      }
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      navigate('/login');
    }
  };

  const completeProfile = async (profileData: { phone: string; address: string }) => {
    try {
      setLoading(true);
      const { data } = await api.post('/user/social/complete-profile/', profileData);
      
      setUser(prev => prev ? { ...prev, ...data, profile_complete: true } : null);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to complete profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/user/me/');
      setUser(data);
      return data;
    } catch (err) {
      console.error('Failed to refresh user data:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      completeProfile,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
