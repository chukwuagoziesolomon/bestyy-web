# Authentication System

This document outlines the authentication flow and setup instructions for the Bestie application.

## Features

- Email/Password authentication
- Google OAuth 2.0 sign-in/sign-up
- JWT token-based authentication
- Protected routes with role-based access control
- Automatic token refresh
- Profile completion flow for social sign-ups

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FRONTEND_URL=http://localhost:3000

# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Configure the consent screen if prompted
6. For "Authorized JavaScript origins", add:
   - `http://localhost:3000`
   - Your production domain
7. For "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://your-production-domain.com/api/auth/google/callback`
8. Copy the Client ID and Client Secret to your `.env` file

## Authentication Flow

### 1. User Login

1. User enters email/password or clicks "Sign in with Google"
2. For Google sign-in, they are redirected to Google's OAuth consent screen
3. After successful authentication, the backend returns JWT tokens
4. Tokens are stored in `localStorage`
5. User is redirected to the dashboard or profile completion page

### 2. Token Refresh

1. The `axios` interceptor checks for 401 responses
2. If a refresh token exists, it attempts to get a new access token
3. On success, the original request is retried with the new token
4. On failure, the user is logged out

### 3. Protected Routes

Protected routes check for:
1. Valid authentication
2. User role permissions (if specified)
3. Profile completion status (if required)

## Components

### AuthContext

Manages authentication state and provides methods for:
- User login/logout
- Token refresh
- Profile management
- Authentication status checks

### ProtectedRoute

A wrapper component that:
- Redirects unauthenticated users to login
- Enforces role-based access control
- Handles profile completion flow

### GoogleAuthButton

A reusable button component that handles Google OAuth flow.

## API Integration

### Endpoints

- `POST /api/auth/login/` - Email/password login
- `POST /api/auth/register/` - Email/password registration
- `GET /api/auth/google/` - Initiate Google OAuth
- `GET /api/auth/google/callback/` - Google OAuth callback
- `POST /api/auth/refresh/` - Refresh access token
- `POST /api/auth/logout/` - Invalidate tokens
- `GET /api/auth/me/` - Get current user data
- `POST /api/auth/complete-profile/` - Complete user profile

## Error Handling

The `errorHandling.ts` utility provides consistent error handling for API responses.

## Testing

1. Test login with email/password
2. Test Google OAuth flow
3. Test token refresh
4. Test protected routes
5. Test role-based access control
6. Test profile completion flow

## Security Considerations

- Always use HTTPS in production
- Store tokens securely (httpOnly cookies recommended for production)
- Implement CSRF protection
- Set appropriate CORS headers
- Rate limiting on authentication endpoints
- Input validation on all forms
