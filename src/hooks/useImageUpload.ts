import { useState, useCallback } from 'react';
import { uploadVendorLogo, uploadMenuItemImage, uploadProfileImage } from '../services/cloudinaryService';

export type ImageUploadType = 'vendor-logo' | 'menu-item' | 'profile-image';

interface UseImageUploadOptions {
  onSuccess?: (url: string, ...args: any[]) => void;
  onError?: (error: string) => void;
}

interface UseImageUploadReturn {
  uploadImage: (file: File, type: ImageUploadType, ...args: any[]) => Promise<string | null>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useImageUpload = (options?: UseImageUploadOptions): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (file: File, type: ImageUploadType, ...args: any[]): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file (JPG, PNG, GIF, etc.)');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 10MB');
      }

      console.log('Starting image upload:', { fileName: file.name, fileSize: file.size, type });

      let uploadFunction;
      switch (type) {
        case 'vendor-logo':
          uploadFunction = uploadVendorLogo;
          break;
        case 'menu-item':
          uploadFunction = uploadMenuItemImage;
          break;
        case 'profile-image':
          uploadFunction = uploadProfileImage;
          break;
        default:
          throw new Error('Invalid upload type');
      }

      const imageUrl = await uploadFunction(file);
      
      console.log('Image upload successful:', imageUrl);
      
      if (options?.onSuccess) {
        options.onSuccess(imageUrl, ...args);
      }

      return imageUrl;
    } catch (err) {
      console.error('Image upload error:', err);
      
      let errorMessage = 'Upload failed';
      if (err instanceof Error) {
        if (err.message.includes('not properly configured')) {
          errorMessage = 'Image upload is not configured. Please contact support.';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  return {
    uploadImage,
    isUploading,
    error,
    clearError
  };
};
