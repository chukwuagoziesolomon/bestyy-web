import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { uploadUserProfileImage, uploadVendorImages, uploadCourierImages } from '../api';
import { showError, showSuccess } from '../toast';

export interface ImageUploadProps {
  currentImage?: string | null;
  userType: 'user' | 'vendor' | 'courier';
  imageType: 'profile' | 'cover' | 'logo' | 'id_document';
  onImageUpdate: (imageUrl: string) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  userType,
  imageType,
  onImageUpdate,
  disabled = false,
  className = '',
  style = {},
  size = 'medium'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const sizeStyles = {
    small: { width: 60, height: 60 },
    medium: { width: 100, height: 100 },
    large: { width: 150, height: 150 }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      const token = localStorage.getItem('access_token');
      if (!token) {
        showError('Authentication required. Please log in again.');
        return;
      }

      let response;

      // Upload based on user type and image type
      switch (userType) {
        case 'user':
          if (imageType !== 'profile') {
            showError('Users can only upload profile images');
            return;
          }
          response = await uploadUserProfileImage(token, file);
          const imageUrl = response.images?.profile_image || response.profile_image;
          onImageUpdate(imageUrl);
          break;

        case 'vendor':
          if (imageType === 'logo' || imageType === 'profile') {
            response = await uploadVendorImages(token, { logo: file });
            const logoUrl = response.images?.logo || response.logo;
            onImageUpdate(logoUrl);
          } else if (imageType === 'cover') {
            response = await uploadVendorImages(token, { cover_image: file });
            const coverUrl = response.images?.cover_image || response.cover_image;
            onImageUpdate(coverUrl);
          } else {
            showError('Invalid image type for vendor');
            return;
          }
          break;

        case 'courier':
          if (imageType === 'profile') {
            response = await uploadCourierImages(token, { profile_image: file });
            const imageUrl = response.images?.profile_image || response.profile_image;
            onImageUpdate(imageUrl);
          } else if (imageType === 'id_document') {
            response = await uploadCourierImages(token, { id_document: file });
            const docUrl = response.images?.id_document || response.id_document;
            onImageUpdate(docUrl);
          } else {
            showError('Invalid image type for courier');
            return;
          }
          break;

        default:
          showError('Invalid user type');
          return;
      }

      showSuccess(`${imageType === 'cover' ? 'Cover photo' : imageType === 'logo' ? 'Logo' : 'Profile picture'} updated successfully!`);
      setPreview(null);

    } catch (error) {
      console.error('Error uploading image:', error);
      showError(error instanceof Error ? error.message : 'Failed to upload image');
      setPreview(null);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  const containerStyle = {
    position: 'relative' as const,
    borderRadius: imageType === 'cover' ? '12px' : '50%',
    overflow: 'hidden' as const,
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled || isUploading ? 'default' : 'pointer',
    border: '2px dashed #d1d5db',
    transition: 'all 0.2s ease',
    ...sizeStyles[size],
    ...style
  };

  const imageToShow = preview || currentImage;

  return (
    <div className={className}>
      <div
        style={containerStyle}
        onMouseEnter={(e) => {
          if (!disabled && !isUploading) {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.background = '#f0fdf4';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isUploading) {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.background = '#f3f4f6';
          }
        }}
      >
        {imageToShow ? (
          <img
            src={imageToShow}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            {isUploading ? (
              <Upload size={24} className="animate-bounce" />
            ) : (
              <Camera size={24} />
            )}
            {size !== 'small' && (
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </div>
            )}
          </div>
        )}

        {/* Upload button overlay */}
        {!disabled && (
          <label
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isUploading ? 'default' : 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              opacity: isUploading ? 0.5 : 1
            }}
          >
            <Camera size={16} color="white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || isUploading}
              style={{ display: 'none' }}
            />
          </label>
        )}

        {/* Preview clear button */}
        {preview && (
          <button
            onClick={clearPreview}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;