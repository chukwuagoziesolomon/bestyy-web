import { toast, ToastOptions } from 'react-toastify';

// Simple, clean toast configuration
const defaultOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  closeButton: false,
  pauseOnFocusLoss: false,
};

export const showSuccess = (message: string) =>
  toast.success(message, defaultOptions);

export const showError = (message: string) =>
  toast.error(message, defaultOptions);

export const showInfo = (message: string) =>
  toast.info(message, defaultOptions);

export const showWarning = (message: string) =>
  toast.warn(message, defaultOptions);

// Alias for mobile - same as regular showError
export const showMobileError = showError;

// Enhanced API error handler
export const showApiError = (error: any, fallbackMessage?: string) => {
  let message = fallbackMessage || 'An error occurred. Please try again.';
  
  // Handle different error structures
  if (error?.response?.data) {
    const errorData = error.response.data;
    
    // Check for various error message fields
    if (errorData.message) {
      message = errorData.message;
    } else if (errorData.error) {
      message = errorData.error;
    } else if (errorData.detail) {
      message = errorData.detail;
    } else if (errorData.non_field_errors) {
      message = Array.isArray(errorData.non_field_errors) 
        ? errorData.non_field_errors.join(', ') 
        : errorData.non_field_errors;
    } else if (typeof errorData === 'object') {
      // Handle field-specific errors
      const fieldErrors = Object.entries(errorData)
        .filter(([key, value]) => Array.isArray(value) && value.length > 0)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
      
      if (fieldErrors) {
        message = fieldErrors;
      }
    }
  } else if (error?.message) {
    message = error.message;
  }
  
  // Log the error for debugging
  console.error('API Error:', error);
  console.error('Displayed message:', message);
  
  showError(message);
};

// Utility to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Debug function to test tokens - available in browser console
if (typeof window !== 'undefined') {
  (window as any).testTokens = async () => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    const token = localStorage.getItem('token');
    const vendorToken = localStorage.getItem('vendor_token');

    console.log('=== TOKEN TEST RESULTS ===');
    console.log('User token:', token ? 'Present' : 'Missing');
    console.log('Vendor token:', vendorToken ? 'Present' : 'Missing');

    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/user/orders/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('User token test - Status:', response.status);
        const data = await response.json();
        console.log('User token test - Response:', data);
      } catch (err) {
        console.error('User token test - Error:', err);
      }
    }

    if (vendorToken) {
      try {
        const response = await fetch(`${API_URL}/api/orders/vendor/tracking/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${vendorToken}`,
          },
        });
        console.log('Vendor token test - Status:', response.status);
        const data = await response.json();
        console.log('Vendor token test - Response:', data);
      } catch (err) {
        console.error('Vendor token test - Error:', err);
      }
    }
    console.log('========================');
  };
}
