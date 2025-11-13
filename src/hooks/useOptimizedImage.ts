import { useState, useEffect } from 'react';
import { cloudinaryService, getThumbnailUrl } from '../services/cloudinaryService';

interface UseOptimizedImageOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
  thumbnail?: boolean;
}

interface UseOptimizedImageReturn {
  optimizedUrl: string;
  thumbnailUrl: string;
  isLoading: boolean;
  error: string | null;
}

export const useOptimizedImage = (
  imageUrl: string | null | undefined,
  options: UseOptimizedImageOptions = {}
): UseOptimizedImageReturn => {
  const [optimizedUrl, setOptimizedUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setOptimizedUrl('');
      setThumbnailUrl('');
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate optimized URL with transformations
      let optimized = imageUrl;

      if (cloudinaryService.isCloudinaryUrl(imageUrl)) {
        const publicId = cloudinaryService.extractPublicId(imageUrl);
        if (publicId) {
          optimized = cloudinaryService.getOptimizedImageUrl(publicId, {
            width: options.width,
            height: options.height,
            quality: options.quality || 'auto',
            format: options.format || 'auto',
            crop: options.crop || 'fill'
          });
        }
      }

      // Generate thumbnail URL
      const thumb = options.thumbnail ? getThumbnailUrl(imageUrl, 150) : optimized;

      setOptimizedUrl(optimized);
      setThumbnailUrl(thumb);
      setIsLoading(false);
    } catch (err) {
      console.error('Error optimizing image:', err);
      setError('Failed to optimize image');
      setOptimizedUrl(imageUrl); // Fallback to original
      setThumbnailUrl(imageUrl); // Fallback to original
      setIsLoading(false);
    }
  }, [imageUrl, options.width, options.height, options.quality, options.format, options.crop, options.thumbnail]);

  return {
    optimizedUrl,
    thumbnailUrl,
    isLoading,
    error
  };
};