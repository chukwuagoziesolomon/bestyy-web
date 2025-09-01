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

// Simple API error handler
export const showApiError = (error: any, fallbackMessage?: string) => {
  let message = fallbackMessage || 'An error occurred. Please try again.';
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }
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
        const response = await fetch(`${API_URL}/user/orders/user/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
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
        const response = await fetch(`${API_URL}/orders/vendor/tracking/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${vendorToken}`,
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
