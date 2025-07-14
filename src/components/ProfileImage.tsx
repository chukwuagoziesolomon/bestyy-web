import React from 'react';

interface ProfileImageProps {
  src: string;
  alt?: string;
  size?: number;
  style?: React.CSSProperties;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt = 'Profile', size = 40, style }) => (
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
);

export default ProfileImage; 