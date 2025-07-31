import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 6000, // 6 seconds - perfect timing for reading
  hideProgressBar: true, // Remove the progress bar
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false, // Disable dragging for cleaner look
  closeButton: false, // Remove default close button
  className: 'custom-toast',
};

export const showSuccess = (message: string, options?: ToastOptions) =>
  toast.success(message, {
    ...defaultOptions,
    ...options,
    className: 'custom-toast custom-toast-success',
    icon: () => '✨'
  });

export const showError = (message: string, options?: ToastOptions) =>
  toast.error(message, {
    ...defaultOptions,
    ...options,
    className: 'custom-toast custom-toast-error',
    icon: () => '⚠️'
  });

export const showInfo = (message: string, options?: ToastOptions) =>
  toast.info(message, {
    ...defaultOptions,
    ...options,
    className: 'custom-toast custom-toast-info',
    icon: () => '💡'
  });

export const showWarning = (message: string, options?: ToastOptions) =>
  toast.warn(message, {
    ...defaultOptions,
    ...options,
    className: 'custom-toast custom-toast-warning',
    icon: () => '🔔'
  });

// Network error handler
export const showNetworkError = (customMessage?: string) => {
  const defaultMessage = "Network connection error. Please check your internet connection and try again.";
  toast.error(customMessage || defaultMessage, {
    ...defaultOptions,
    className: 'custom-toast custom-toast-error custom-toast-network',
    icon: () => '📡',
    autoClose: 8000, // Longer duration for network errors (8 seconds)
  });
};

// Helper function to detect and show appropriate error messages
export const showApiError = (error: any, fallbackMessage?: string) => {
  // Check if it's a network error
  if (!navigator.onLine) {
    showNetworkError("You're offline. Please check your internet connection.");
    return;
  }

  // Check for common network error patterns
  if (error?.code === 'NETWORK_ERROR' ||
      error?.message?.toLowerCase().includes('network') ||
      error?.message?.toLowerCase().includes('fetch') ||
      error?.name === 'NetworkError' ||
      !error?.response) {
    showNetworkError();
    return;
  }

  // Check for timeout errors
  if (error?.code === 'ECONNABORTED' ||
      error?.message?.toLowerCase().includes('timeout')) {
    showNetworkError("Request timed out. Please check your connection and try again.");
    return;
  }

  // Show regular error message
  let message = fallbackMessage || 'An error occurred. Please try again.';
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  showError(message);
};