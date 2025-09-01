import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/google-button.css';

// Ensure API_URL doesn't end with a slash
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

// Function to get CSRF token from cookies
const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || '';
};

interface GoogleAuthButtonProps {
  variant?: 'login' | 'signup' | 'connect';
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  variant = 'login',
  onSuccess,
  onError,
  disabled = false,
  className = ''
}) => {
  // Handle OAuth callback when component mounts
  useEffect(() => {
    const handleGoogleCallback = async (code: string) => {
      try {
        // Get the redirect URI that was used for the initial OAuth request
        const redirectUri = `${window.location.origin}${variant === 'signup' ? '/signup' : '/login'}`;
        
        // Exchange the authorization code for tokens using the correct callback endpoint
        const response = await fetch(`${API_BASE}/api/auth/social/google/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code,
            redirect_uri: redirectUri 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || errorData.error || 'Authentication failed');
        }

        const data = await response.json();
        
        // Store the tokens (adjust according to your auth flow)
        if (data.access) {
          localStorage.setItem('access_token', data.access);
        }
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        
        // Store user data if available
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Call the success callback with the response data
        onSuccess?.(data);
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate with Google';
        onError?.(errorMessage);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code) {
      handleGoogleCallback(code);
    } else if (error) {
      onError?.(error);
    }
  }, [onSuccess, onError, variant]);

  const handleGoogleAuth = async () => {
    try {
      // Ensure the redirect_uri matches exactly what's configured in your backend
      const redirectUri = `${window.location.origin}${variant === 'signup' ? '/signup' : '/login'}`;
      
      // Updated to use the correct endpoint format
      const authUrl = `${API_BASE}/api/auth/social/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      console.log('Initiating Google OAuth with URL:', authUrl);
      
      const response = await fetch(authUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to initiate Google login';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      if (!data || !data.authorization_url) {
        throw new Error('Invalid response from server');
      }
      
      console.log('Redirecting to:', data.authorization_url);
      window.location.href = data.authorization_url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate Google authentication';
      onError?.(errorMessage);
    }
  };

  const buttonText = {
    login: 'Sign in with Google',
    signup: 'Sign up with Google',
    connect: 'Connect Google Account',
  }[variant];

  return (
    <button
      type="button"
      className={`google-auth-button ${className}`}
      onClick={handleGoogleAuth}
      disabled={disabled}
      aria-label={buttonText}
    >
      <span className="google-icon">G</span>
      {buttonText}
    </button>
  );
};

export default GoogleAuthButton;
