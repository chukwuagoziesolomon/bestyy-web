// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  // Replace these with your actual Cloudinary credentials
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
  
  // Default transformations for different image types
  transformations: {
    vendorLogo: 'w_400,h_400,c_fill,q_auto,f_auto',
    menuItem: 'w_600,h_400,c_fill,q_auto,f_auto',
    profileImage: 'w_300,h_300,c_fill,q_auto,f_auto',
    thumbnail: 'w_150,h_150,c_fill,q_auto,f_auto'
  },
  
  // Default folders for organization
  folders: {
    vendorLogos: 'vendor-logos',
    menuItems: 'menu-items',
    profileImages: 'profile-images'
  }
};

// Instructions for setup:
// 1. Go to https://cloudinary.com and create an account
// 2. Get your Cloud Name from the dashboard
// 3. Create an Upload Preset:
//    - Go to Settings > Upload
//    - Create a new upload preset
//    - Set Signing Mode to "Unsigned" for client-side uploads
//    - Set the folder (optional)
// 4. Create a .env file in your project root with:
//    REACT_APP_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
//    REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-actual-upload-preset
