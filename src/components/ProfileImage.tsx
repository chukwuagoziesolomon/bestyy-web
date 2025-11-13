import React from 'react';
import { getThumbnailUrl } from '../services/cloudinaryService';
import { getFallbackImageUrl } from '../utils/imageUtils';

interface ProfileImageProps {
  src: string;
  alt?: string;
  size?: number;
  style?: React.CSSProperties;
  initials?: string; // Add initials prop
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt = 'Profile', size = 40, style, initials }) => {
  // Helper to check if src is a non-empty string
  const hasImage = src && typeof src === 'string' && src.trim() !== '';
  
  // Get optimized image URL for Cloudinary images
  const imageUrl = hasImage ? getThumbnailUrl(src, size) : '';
  
  return hasImage ? (
    <img
      src={imageUrl}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        background: '#e5e7eb',
        border: '2px solid #fff',
        boxShadow: '0 1px 4px rgba(16,24,40,0.04)',
        ...style,
      }}
      onError={(e) => {
        // Fallback to original URL if optimized URL fails
        const fallbackUrl = getFallbackImageUrl(src);
        if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
          e.currentTarget.src = fallbackUrl;
        } else if (e.currentTarget.src !== src) {
          e.currentTarget.src = src;
        }
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#e5e7eb',
        border: '2px solid #fff',
        boxShadow: '0 1px 4px rgba(16,24,40,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size ? size * 0.5 : 20,
        color: '#10b981',
        ...style,
      }}
    >
      {initials ? initials[0].toUpperCase() : '?'}
    </div>
  );
};

export default ProfileImage; 