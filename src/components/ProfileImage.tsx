import React from 'react';

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
  return hasImage ? (
    <img
      src={src}
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