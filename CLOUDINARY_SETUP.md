# Cloudinary Setup Guide

## Overview
This application uses Cloudinary for image uploads (vendor logos and menu item images). You need to set up Cloudinary credentials to enable image upload functionality.

## Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Credentials
1. Log into your Cloudinary dashboard
2. Note down your **Cloud Name** from the dashboard
3. Go to **Settings** → **Upload**
4. Create a new upload preset:
   - Name: `bestie-upload-preset` (or any name you prefer)
   - Signing Mode: **Unsigned** (for client-side uploads)
   - Folder: `bestie-app` (optional, for organization)
   - Click **Save**

## Step 3: Configure Environment Variables
Create a `.env` file in your project root with the following content:

```env
# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-actual-upload-preset

# API Configuration
REACT_APP_API_URL=http://localhost:8000
```

Replace:
- `your-actual-cloud-name` with your Cloudinary cloud name
- `your-actual-upload-preset` with your upload preset name

## Step 4: Restart Development Server
After creating the `.env` file, restart your development server:

```bash
npm start
```

## Step 5: Test Image Upload
1. Go to the vendor signup page
2. Try uploading a logo in the "Business Info" step
3. Try uploading a menu item image in the "Menu Items" step

## Troubleshooting

### Error: "Cloudinary is not properly configured"
- Check that your `.env` file exists in the project root
- Verify the environment variable names are correct
- Make sure you've restarted the development server
- Check that your Cloudinary credentials are valid

### Error: "Upload failed with status 400"
- Verify your upload preset is set to "Unsigned"
- Check that your cloud name is correct
- Ensure the upload preset exists in your Cloudinary account

### Error: "Network error"
- Check your internet connection
- Verify Cloudinary is accessible from your network
- Check browser console for detailed error messages

## Security Notes
- The upload preset is set to "Unsigned" for client-side uploads
- This is suitable for development and small applications
- For production, consider implementing server-side uploads for better security

## Support
If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify your Cloudinary account is active
3. Contact support with the specific error messages you're seeing

