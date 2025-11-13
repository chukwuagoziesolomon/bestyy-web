/**
 * Utility functions for handling image URLs, especially Cloudinary URLs
 */

/**
 * Cleans and decodes malformed Cloudinary URLs from the backend
 * The backend sometimes returns URLs like "/media/https%3A/res.cloudinary.com/..."
 * which need to be decoded to proper Cloudinary URLs
 */
export const cleanImageUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string') return null;

  // If it's already a proper HTTP/HTTPS URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Handle the malformed backend URLs that start with "/media/"
  if (url.startsWith('/media/')) {
    // Remove the "/media/" prefix
    const withoutMedia = url.substring(7);

    // URL decode the rest
    try {
      const decoded = decodeURIComponent(withoutMedia);

      // If it starts with "http", it's a proper URL now
      if (decoded.startsWith('http')) {
        return decoded;
      }

      // If it still doesn't start with http, it might be a relative path
      // Prepend the API URL
      return `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}${url}`;
    } catch (error) {
      console.warn('Failed to decode URL:', url, error);
      return `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}${url}`;
    }
  }

  // For other relative paths, prepend API URL
  if (url.startsWith('/')) {
    return `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}${url}`;
  }

  // If it's just a filename or other string, try to construct a full URL
  return url;
};

/**
 * Debug function to log image URL processing
 */
export const debugImageUrl = (item: any, source: string) => {
  console.log(`=== ${source} Image Debug ===`);
  console.log('Item:', item);
  console.log('item.image:', item?.image);
  console.log('item.image_url:', item?.image_url);
  console.log('item.image_urls:', item?.image_urls);
  console.log('getMenuItemImageUrl result:', getMenuItemImageUrl(item));
  console.log('========================');
};

/**
 * Gets the best available image URL from menu item data
 * Priority: image_urls.medium > image_urls.thumbnail > image_urls.original > image_url > image
 */
export const getMenuItemImageUrl = (item: any): string | null => {
  if (!item || typeof item !== 'object') return null;

  // Priority: image_urls.medium > image_urls.thumbnail > image_urls.original > image_url > image
  if (item.image_urls?.medium) {
    return cleanImageUrl(item.image_urls.medium);
  }
  if (item.image_urls?.thumbnail) {
    return cleanImageUrl(item.image_urls.thumbnail);
  }
  if (item.image_urls?.original) {
    return cleanImageUrl(item.image_urls.original);
  }
  if (item.image_url) {
    return cleanImageUrl(item.image_url);
  }

  // Handle nested image object structure (from stock API)
  if (item.image && typeof item.image === 'object') {
    if (item.image.medium) {
      return cleanImageUrl(item.image.medium);
    }
    if (item.image.thumbnail) {
      return cleanImageUrl(item.image.thumbnail);
    }
    if (item.image.original) {
      return cleanImageUrl(item.image.original);
    }
    if (item.image.large) {
      return cleanImageUrl(item.image.large);
    }
  }

  // Handle direct image string
  if (item.image && typeof item.image === 'string') {
    return cleanImageUrl(item.image);
  }

  return null;
};

/**
 * Creates a thumbnail URL from a Cloudinary URL
 */
export const getThumbnailUrl = (url: string, size: number = 150): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Extract the base URL and public ID from Cloudinary URL
  const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/(?:[^\/]*\/)?(.+)/;
  const match = url.match(cloudinaryRegex);

  if (!match) {
    return url;
  }

  const cloudName = match[1];
  const publicId = match[2];

  // Create thumbnail URL with transformations
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},h_${size},c_fill,q_auto,f_auto/${publicId}`;
};

/**
 * Validates if a Cloudinary URL is properly formatted and accessible
 */
export const validateCloudinaryUrl = (url: string): boolean => {
  if (!url || !url.includes('cloudinary.com')) {
    return false;
  }

  // Check if URL has proper format
  const cloudinaryRegex = /^https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\//;
  return cloudinaryRegex.test(url);
};

/**
 * Gets a fallback URL if the primary URL fails
 */
export const getFallbackImageUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;

  // If it's a Cloudinary URL, try to get the original without transformations
  if (url.includes('cloudinary.com')) {
    // Remove any transformation parameters and return the base URL
    const baseUrlMatch = url.match(/(https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/)[^\/]*(\/.+)/);
    if (baseUrlMatch) {
      return baseUrlMatch[1] + baseUrlMatch[2];
    }
  }

  return url;
};