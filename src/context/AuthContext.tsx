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
    
    // Skip auto-refresh if this request has the skip flag
    if (originalRequest?.skipRefresh) {
      return Promise.reject(error);
    }
    
    // TODO: Implement token refresh once backend endpoint is ready
    // For now, skip auto-refresh to prevent logout on failed refresh attempts
    // If error is 401 and we haven't tried to refresh yet
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   ... token refresh logic would go here ...
    // }
    
    return Promise.reject(error);
  }
);

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  selectProfile: (email: string, password: string, profileId: number) => Promise<void>;
  signup: (email: string, password: string, role: string, additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserFromSignup: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to determine actual role by checking profiles
  const determineActualRole = async (backendRole: string, userId?: number) => {
    // If backend explicitly says the role is 'user', trust it and don't check for other profiles
    // This prevents users who signed up as 'user' from being redirected to vendor/courier dashboards
    if (backendRole === 'user') {
      console.log('Backend role is explicitly user, not checking for other profiles');
      return 'user';
    }

    // For non-user roles, we still check profiles to ensure they have the required profile
    let actualRole = backendRole;

    // Check for vendor profile if backend says vendor
    if (backendRole === 'vendor') {
      try {
        const vendorResponse = await api.get('/api/user/vendors/me/');
        if (vendorResponse.data && (vendorResponse.data.business_name || vendorResponse.data.id)) {
          actualRole = 'vendor';
          console.log('Confirmed vendor profile exists, setting role to vendor');
          // Store vendor profile in localStorage for easy access
          localStorage.setItem('vendor_profile', JSON.stringify(vendorResponse.data));
        } else {
          console.log('Vendor profile not found, keeping backend role');
        }
      } catch (vendorErr: any) {
        // If 404, user doesn't have vendor profile - keep backend role
        if (vendorErr.response?.status === 404) {
          console.log('No vendor profile found, keeping backend role');
        } else {
          console.error('Error checking vendor profile:', vendorErr.response.status);
        }
      }
    }

    // Check for courier profile if backend says courier
    if (backendRole === 'courier') {
      try {
        const courierResponse = await api.get('/api/user/couriers/me/');
        if (courierResponse.data && (courierResponse.data.vehicle_type || courierResponse.data.id)) {
          actualRole = 'courier';
          console.log('Confirmed courier profile exists, setting role to courier');
          // Store courier profile in localStorage for easy access
          localStorage.setItem('courier_profile', JSON.stringify(courierResponse.data));
        } else {
          console.log('Courier profile not found, keeping backend role');
        }
      } catch (courierErr: any) {
        // If 404, user doesn't have courier profile - keep backend role
        if (courierErr.response?.status === 404) {
          console.log('No courier profile found, keeping backend role');
        } else {
          console.error('Error checking courier profile:', courierErr.response.status);
        }
      }
    }

    console.log('Final role determined:', actualRole);
    return actualRole;
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext - Starting auth check...');
      const token = localStorage.getItem('access_token');
      console.log('AuthContext - Token found:', token ? 'Yes' : 'No');

      if (!token) {
        console.log('AuthContext - No token, setting loading to false');
        setLoading(false);
        return;
      }

      // First check if we already have user data in localStorage (from signup)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext - Found user in localStorage:', userData);
          setUser(userData);
          setLoading(false);
          return;
        } catch (parseErr) {
          console.warn('Failed to parse stored user:', parseErr);
        }
      }

      // Only make API call if we don't have user data in localStorage
      try {
        console.log('AuthContext - Making API call to /api/user/me/');
        // Get fresh user data from the backend using the configured axios instance
        const { data } = await api.get('/api/user/me/', { 
          // @ts-ignore - skipRefresh is a custom config flag
          skipRefresh: true 
        });
        console.log('AuthContext - API response:', data);

        // The user data structure from /api/user/me/ endpoint
        let userData = {
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

        // Only determine actual role for vendor/courier to avoid extra API calls
        if (userData.role !== 'user') {
          try {
            userData.role = await determineActualRole(userData.role, userData.id);
          } catch (roleErr) {
            console.warn('Failed to determine actual role, using backend role:', roleErr);
            // Keep the backend role if determination fails
          }
        }

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        console.log('AuthContext - User set successfully');
      } catch (err) {
        console.error('Auth check failed:', err);
        // Only clear tokens if it's a clear auth failure (401 specifically during GET /api/user/me/)
        // Don't rely on refresh interceptor - handle it here
        if (err.response?.status === 401) {
          console.warn('Auth check got 401, clearing tokens');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          // For other errors, keep user logged in but don't update data
          console.warn('Auth check got non-401 error, keeping user session:', err.message);
        }
      } finally {
        console.log('AuthContext - Setting loading to false');
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
      
      // Check if user has multiple profiles
      if (response.data.multiple_profiles) {
        // Store credentials temporarily for profile selection
        sessionStorage.setItem('temp_credentials', JSON.stringify({ email, password }));
        sessionStorage.setItem('temp_profiles', JSON.stringify(response.data.profiles));
        
        // Navigate to profile selection page
        navigate('/profile-selection', { 
          state: { 
            profiles: response.data.profiles,
            message: response.data.message
          } 
        });
        return;
      }
      
      // Single profile - proceed with normal login
      const { access, refresh, user } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Set the default authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
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

      // Determine actual role using helper function
      userData.role = await determineActualRole(userData.role, userData.id);

      // Debug: Log the processed user data
      console.log('=== PROCESSED USER DATA ===');
      console.log('Final user data:', userData);
      console.log('Final user role:', userData.role);
      console.log('Role type:', typeof userData.role);
      console.log('Role lowercase:', userData.role.toLowerCase());
      console.log('==========================');

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Merge anonymous cart with user cart after login
      try {
        const { cartService } = await import('../services/cartService');
        await cartService.mergeCart();
        console.log('Cart merge attempted after login');
      } catch (cartError) {
        console.error('Failed to merge cart after login:', cartError);
        // Don't block login if cart merge fails
      }
      
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

  const selectProfile = async (email: string, password: string, profileId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/user/login/select-profile/', { 
        email, 
        password, 
        profile_id: profileId 
      });
      
      const { access, refresh, user } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Clear temporary credentials
      sessionStorage.removeItem('temp_credentials');
      sessionStorage.removeItem('temp_profiles');
      
      // Set the default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Process user data
      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'user',
        phone: user.phone || '',
        ...user
      };

      // Determine actual role
      userData.role = await determineActualRole(userData.role, userData.id);
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('Profile selected:', userData);
      
      // Try to merge cart
      try {
        const { cartService } = await import('../services/cartService');
        await cartService.mergeCart();
        console.log('Cart merge attempted after profile selection');
      } catch (cartError) {
        console.error('Failed to merge cart after profile selection:', cartError);
      }
      
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
        default:
          navigate('/user/dashboard');
      }
    } catch (err) {
      setError('Failed to select profile');
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
      sessionStorage.removeItem('temp_credentials');
      sessionStorage.removeItem('temp_profiles');
      setUser(null);
      navigate('/login');
    }
  };



  const refreshUser = async () => {
    try {
      const { data } = await api.get('/api/user/me/');
      
      // The user data structure from /api/user/me/ endpoint
      let userData = {
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

      // Determine actual role using helper function
      userData.role = await determineActualRole(userData.role, userData.id);
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to refresh user data:', err);
      throw err;
    }
  };

  const setUserFromSignup = async (signupResponse: any) => {
    try {
      // Extract user data from signup response
      const { user: responseUser } = signupResponse;
      
      if (!responseUser) {
        console.error('No user data in signup response');
        throw new Error('No user data in signup response');
      }

      console.log('setUserFromSignup - Raw response user:', responseUser);

      // Build user object from signup response
      const userData: User = {
        id: responseUser.id,
        email: responseUser.email,
        first_name: responseUser.first_name || '',
        last_name: responseUser.last_name || '',
        role: responseUser.role || 'user',
        phone: responseUser.phone || '',
      };

      console.log('setUserFromSignup - Processed user data:', userData);
      console.log('setUserFromSignup - User role:', userData.role);

      // Don't call determineActualRole here - just use the role from signup response
      // The role will be verified when user navigates to protected routes
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      console.log('✅ User set from signup response');
    } catch (err) {
      console.error('Failed to set user from signup:', err);
      // Don't clear tokens - just stop loading
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      selectProfile,
      signup,
      logout,
      refreshUser,
      setUserFromSignup,
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
