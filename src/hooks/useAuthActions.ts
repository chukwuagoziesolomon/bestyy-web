import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';
import { handleApiError } from '../utils/errorHandling';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      if (data.user.profile_complete) {
        navigate('/dashboard');
      } else {
        navigate('/complete-profile');
      }
      
      return data.user;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call your signup API endpoint
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      // Auto-login after successful registration
      return await login(userData.email, userData.password);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const completeProfile = useCallback(async (profileData: { phone: string; address: string }) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await authService.completeProfile(profileData, token);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    loading,
    error,
    login,
    signup,
    logout,
    completeProfile,
  };
};
