import { useState, useCallback } from 'react';

export type ImageUploadType = 'vendor-logo' | 'menu-item' | 'profile-image' | 'cover-photo' | 'bank-statement';

interface UseImageUploadOptions {
  onSuccess?: (file: File | string, ...args: any[]) => void;
  onError?: (error: string) => void;
}

interface UseImageUploadReturn {
  uploadImage: (file: File, type: ImageUploadType, ...args: any[]) => Promise<File | null>;
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

  const uploadImage = useCallback(async (file: File, type: ImageUploadType, ...args: any[]): Promise<File | null> => {
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

      console.log('Image validation successful:', { fileName: file.name, fileSize: file.size, type });

      // Return the file directly for backend upload
      if (options?.onSuccess) {
        options.onSuccess(file, ...args);
      }

      return file;
    } catch (err) {
      console.error('Image validation error:', err);

      let errorMessage = 'Upload failed';
      if (err instanceof Error) {
        errorMessage = err.message;
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
