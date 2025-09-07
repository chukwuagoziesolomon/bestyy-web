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
        throw new Error('Please select a valid image file');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 10MB');
      }

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
      
      if (options?.onSuccess) {
        options.onSuccess(imageUrl, ...args);
      }

      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
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
