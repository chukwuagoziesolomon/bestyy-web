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
  signup: (email: string, password: string, role: string, additionalData?: any) => Promise<void>;
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
        
        // The user data structure from /api/user/me/ endpoint
        const userData = {
          id: data.id,
          email: data.email,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          role: data.role || 'user', // Backend now provides role
          phone: data.phone || '',
          ...data
        };
        
        console.log('CheckAuth - Processed user data:', userData);
        console.log('CheckAuth - User role:', userData.role);
        
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


      
  const signup = async (email: string, password: string, role: string, additionalData?: any) => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        // Call appropriate signup API based on role
        if (role.toLowerCase() === 'vendor') {
          // Import signupVendor function
          const { signupVendor } = await import('../api');
          response = await signupVendor({
            email,
            password,
            first_name: additionalData?.first_name || '',
            last_name: additionalData?.last_name || '',
            phone: additionalData?.phone || '',
            business_name: additionalData?.business_name || '',
            business_category: additionalData?.business_category || '',
            cac_number: additionalData?.cac_number || '',
            business_description: additionalData?.business_description || '',
            business_address: additionalData?.business_address || '',
            delivery_radius: additionalData?.delivery_radius || '',
            service_areas: additionalData?.service_areas || '',
            opening_hours: additionalData?.opening_hours || '',
            closing_hours: additionalData?.closing_hours || '',
            offers_delivery: additionalData?.offers_delivery || false,
          });
        } else {
          // Import signupUser function for regular users
          const { signupUser } = await import('../api');
          response = await signupUser({
            email,
            password,
            first_name: additionalData?.first_name || '',
            last_name: additionalData?.last_name || '',
            phone: additionalData?.phone || '',
          });
        }
        
        // Check if the response contains tokens (successful signup)
        if (response.access && response.refresh) {
          // Store tokens
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          // Set the default authorization header for subsequent requests
          api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
          
          // Process user data from response
          const userData = {
            id: response.user?.id || Date.now(),
            email: response.user?.email || email,
            first_name: response.user?.first_name || additionalData?.first_name || '',
            last_name: response.user?.last_name || additionalData?.last_name || '',
            role: response.user?.role || role.toLowerCase(),
            phone: response.user?.phone || additionalData?.phone || '',
            ...response.user,
            ...additionalData
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          
          // Redirect to success page
          navigate('/success', { state: { userType: role.toLowerCase() } });
        } else {
          // If no tokens returned, it might be a pending approval case
          // Store user data temporarily for pending approval
          const userData = {
            id: response.user?.id || Date.now(),
            email: response.user?.email || email,
            first_name: response.user?.first_name || additionalData?.first_name || '',
            last_name: response.user?.last_name || additionalData?.last_name || '',
            role: response.user?.role || role.toLowerCase(),
            phone: response.user?.phone || additionalData?.phone || '',
            ...response.user,
            ...additionalData
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          
          // Redirect to success page
          navigate('/success', { state: { userType: role.toLowerCase() } });
        }
      } catch (err) {
        console.error('Signup error:', err);
        setError(err instanceof Error ? err.message : 'Signup failed');
        throw err;
      } finally {
        setLoading(false);
      }
    };

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
      
            // Debug: Log the response to see what we're getting
      console.log('=== LOGIN DEBUG ===');
      console.log('Full response:', response.data);
      console.log('Access token:', access);
      console.log('Refresh token:', refresh);
      console.log('User object:', user);
      console.log('User role from response:', user.role);
      console.log('==================');
      
      // The user object from the response contains the user data directly
      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'user', // Backend now provides role
        phone: user.phone || '',
        ...user
      };
      
      // Debug: Log the processed user data
      console.log('=== PROCESSED USER DATA ===');
      console.log('Final user data:', userData);
      console.log('Final user role:', userData.role);
      console.log('Role type:', typeof userData.role);
      console.log('Role lowercase:', userData.role.toLowerCase());
      console.log('==========================');
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
        // Redirect based on user role
      console.log('=== ROLE-BASED REDIRECTION ===');
      console.log('User role for redirection:', userData.role);
      console.log('User role lowercase:', userData.role.toLowerCase());
      
        switch(userData.role.toLowerCase()) {
          case 'vendor':
          console.log('✅ Redirecting to vendor dashboard');
            navigate('/vendor/dashboard');
            break;
          case 'courier':
          console.log('✅ Redirecting to courier dashboard');
            navigate('/courier/dashboard');
            break;
          case 'admin':
          console.log('✅ Redirecting to admin dashboard');
            navigate('/admin/dashboard');
            break;
          default: // Regular user
          console.log('✅ Redirecting to user dashboard (default)');
            navigate('/user/dashboard');
      }
      console.log('==============================');
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
      
      // The user data structure from /api/user/me/ endpoint
      const userData = {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        role: data.role || 'user', // Backend now provides role
        phone: data.phone || '',
        ...data
      };
      
      console.log('RefreshUser - Processed user data:', userData);
      console.log('RefreshUser - User role:', userData.role);
      
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
      signup,
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
