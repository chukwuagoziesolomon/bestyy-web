import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}`,
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
            `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/auth/token/refresh/`,
            { refresh: refreshToken },
            {
              baseURL: `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}`
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
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        const { data } = await api.get('/api/user/me/');
        
        // Handle nested user structure if it exists
        const userData = data.user ? {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          role: data.user.role || 'user',
          ...data.user
        } : {
          id: data.id,
          email: data.email,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
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



  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/user/login/', { email, password });
      
      const { access, refresh, user } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Set the default authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Handle nested user structure if it exists
      const userData = user.user ? {
        id: user.user.id,
        email: user.user.email,
        first_name: user.user.first_name || '',
        last_name: user.user.last_name || '',
        role: user.user.role || 'user',
        ...user.user
      } : {
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'user',
        ...user
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
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
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      navigate('/login');
    }
  };



  const refreshUser = async () => {
    try {
      const { data } = await api.get('/api/user/me/');
      
      // Handle nested user structure if it exists
      const userData = data.user ? {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.first_name || '',
        last_name: data.user.last_name || '',
        role: data.user.role || 'user',
        ...data.user
      } : {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        role: data.role || 'user',
        ...data
      };
      
      setUser(userData);
      return userData;
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
