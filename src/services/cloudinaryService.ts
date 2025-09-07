// Cloudinary service for image uploads
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryUploadError {
  error: {
    message: string;
  };
}

export class CloudinaryService {
  private static instance: CloudinaryService;
  private config: CloudinaryConfig;

  private constructor(config: CloudinaryConfig) {
    this.config = config;
  }

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService(CLOUDINARY_CONFIG);
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload image to Cloudinary
   */
  public async uploadImage(
    file: File,
    folder?: string,
    transformation?: string
  ): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.config.uploadPreset);
    
    if (folder) {
      formData.append('folder', folder);
    }
    
    if (transformation) {
      formData.append('transformation', transformation);
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData: CloudinaryUploadError = await response.json();
        throw new Error(errorData.error.message || 'Upload failed');
      }

      const result: CloudinaryUploadResult = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  /**
   * Generate optimized image URL with transformations
   */
  public getOptimizedImageUrl(
    publicId: string,
    transformations?: {
      width?: number;
      height?: number;
      quality?: string | number;
      format?: string;
      crop?: string;
    }
  ): string {
    const baseUrl = `https://res.cloudinary.com/${this.config.cloudName}/image/upload`;
    
    if (!transformations) {
      return `${baseUrl}/${publicId}`;
    }

    const transformParams: string[] = [];
    
    if (transformations.width) transformParams.push(`w_${transformations.width}`);
    if (transformations.height) transformParams.push(`h_${transformations.height}`);
    if (transformations.quality) transformParams.push(`q_${transformations.quality}`);
    if (transformations.format) transformParams.push(`f_${transformations.format}`);
    if (transformations.crop) transformParams.push(`c_${transformations.crop}`);

    const transformString = transformParams.join(',');
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  public extractPublicId(url: string): string | null {
    const regex = /\/v\d+\/(.+?)(?:\.[^.]+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Check if URL is a Cloudinary URL
   */
  public isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com');
  }
}

// Export singleton instance
export const cloudinaryService = CloudinaryService.getInstance();

// Helper functions for common use cases
export const uploadVendorLogo = async (file: File): Promise<string> => {
  const result = await cloudinaryService.uploadImage(
    file, 
    CLOUDINARY_CONFIG.folders.vendorLogos, 
    CLOUDINARY_CONFIG.transformations.vendorLogo
  );
  return result.secure_url;
};

export const uploadMenuItemImage = async (file: File): Promise<string> => {
  const result = await cloudinaryService.uploadImage(
    file, 
    CLOUDINARY_CONFIG.folders.menuItems, 
    CLOUDINARY_CONFIG.transformations.menuItem
  );
  return result.secure_url;
};

export const uploadProfileImage = async (file: File): Promise<string> => {
  const result = await cloudinaryService.uploadImage(
    file, 
    CLOUDINARY_CONFIG.folders.profileImages, 
    CLOUDINARY_CONFIG.transformations.profileImage
  );
  return result.secure_url;
};

// Utility function to get thumbnail URL from any Cloudinary URL
export const getThumbnailUrl = (url: string, size: number = 150): string => {
  if (!cloudinaryService.isCloudinaryUrl(url)) {
    return url; // Return original URL if not Cloudinary
  }
  
  const publicId = cloudinaryService.extractPublicId(url);
  if (!publicId) {
    return url; // Return original URL if can't extract public ID
  }
  
  return cloudinaryService.getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
};
