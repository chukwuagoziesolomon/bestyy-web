import { AxiosError } from 'axios';
import { AuthError } from '../types/auth';

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Handle Axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response;
      
      if (status === 401) {
        return 'Your session has expired. Please log in again.';
      }
      
      if (status === 403) {
        return 'You do not have permission to perform this action.';
      }
      
      if (status === 404) {
        return 'The requested resource was not found.';
      }
      
      if (status === 400 && data) {
        // Handle validation errors
        if (typeof data === 'object' && data !== null) {
          if ('detail' in data) {
            return data.detail as string;
          }
          
          // Handle field-specific errors
          const fieldErrors = Object.entries(data as Record<string, string[]>)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
            
          return fieldErrors || 'Invalid request. Please check your input.';
        }
        
        return data as string || 'Bad request. Please check your input.';
      }
      
      return data?.message || `Request failed with status ${status}`;
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response received from the server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      return error.message;
    }
  }
  
  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred. Please try again.';
};

export const isAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};

export const extractAuthError = (error: unknown): AuthError => {
  if (isAuthError(error)) {
    return error;
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: handleApiError(error)
  };
};
