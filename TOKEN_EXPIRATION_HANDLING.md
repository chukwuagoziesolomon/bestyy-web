# Token Expiration Handling Implementation

## Overview
Comprehensive JWT token expiration handling system that automatically redirects users to the login page when their tokens expire, while allowing access to public endpoints without authentication.

## Implementation Date
December 7, 2025

## Token Configuration
- **Access Token Lifetime**: 24 hours (1 day)
- **Refresh Token Lifetime**: 30 days
- **Auto-rotation**: Enabled for refresh tokens
- **Auto-refresh**: Enabled (checks every 30 minutes, refreshes when < 1 hour remaining)

## Components Updated

### 1. Token Manager Utility (`src/utils/tokenManager.ts`)
**New file** - Handles all token-related operations:
- `decodeToken()` - Decodes JWT token to read expiration
- `isTokenExpired()` - Checks if token is expired (with 5-min buffer)
- `isAuthenticated()` - Validates user has valid tokens
- `refreshAccessToken()` - Refreshes access token using refresh token
- `validateAndRefreshToken()` - Validates and auto-refreshes if needed
- `clearAuthAndRedirect()` - Clears all auth data and redirects to login
- `setupAutoRefresh()` - Sets up automatic token refresh (every 30 minutes)
- `getTokenInfo()` - Debug utility to check token status

### 2. Axios Config (`src/utils/axiosConfig.ts`)
**Enhanced** - Added comprehensive token refresh interceptor:
- Intercepts all 401 errors
- Automatically attempts token refresh
- Retries original request with new token
- Redirects to login if refresh fails
- Skips refresh for public endpoints
- Clears all storage on authentication failure

### 3. API Service (`src/api.ts`)
**Enhanced** - Updated `makeAuthenticatedRequest`:
- Added more public endpoints (menu, public APIs)
- Enhanced 401 error handling
- Clears sessionStorage on auth failure
- Better logging for debugging
- Handles FormData properly

### 4. Auth Context (`src/context/AuthContext.tsx`)
**Enhanced** - Improved interceptor and login flow:
- Better error handling in interceptor
- Clears sessionStorage on auth failure
- Enhanced logout to clear cart and all data
- Redirects to original page after login
- Shows success message on logout

### 5. Protected Route Component (`src/components/auth/ProtectedRoute.tsx`)
**Enhanced** - Added token validation:
- Validates token before rendering protected content
- Calls `validateAndRefreshToken()` on each route
- Shows loading state during validation
- Stores attempted path for redirect after login
- Better error messages

### 6. App Component (`src/App.tsx`)
**Enhanced** - Added auto-refresh setup:
- Sets up automatic token refresh on app mount
- Cleans up on unmount
- Logs refresh status

### 7. User Login (`src/UserLogin.tsx`)
**Enhanced** - Added session expiry handling:
- Shows message when redirected from expired session
- Displays custom auth messages from token manager
- Clears messages after display

## Public Endpoints (No Authentication Required)
The following endpoints are accessible without authentication:
- `/api/user/login/`
- `/api/auth/login/`
- `/api/user/signup/`
- `/api/user/register/`
- `/api/user/vendors/register/`
- `/api/user/couriers/register/`
- `/api/token/refresh/`
- `/api/token/verify/`
- `/api/user/recommendations/`
- `/api/user/banners/`
- `/api/user/vendors/` (public vendor list and menu)
- `/api/user/search/`
- `/api/user/menu/` (public menu items)
- `/api/public/` (any public API endpoints)

## Flow Diagrams

### Token Expiration Flow
```
User makes API request
    ↓
Is token expired?
    ↓ Yes
Attempt token refresh with refresh token
    ↓
Refresh successful?
    ↓ No
Clear all storage → Redirect to login → Show "Session expired" message
    ↓ Yes
Store new tokens → Retry original request → Continue
```

### Protected Route Flow
```
User navigates to protected route
    ↓
Check if user has tokens
    ↓ No → Redirect to login
    ↓ Yes
Validate token with backend
    ↓
Token valid?
    ↓ No → Attempt refresh → Success? → Continue | Fail → Redirect to login
    ↓ Yes
Check user role matches required role
    ↓ No → Redirect to appropriate dashboard
    ↓ Yes
Render protected content
```

### Auto-Refresh Flow
```
App starts
    ↓
Setup auto-refresh (runs every 30 minutes)
    ↓
Check access token expiration time
    ↓
< 1 hour remaining?
    ↓ Yes
Refresh access token automatically
    ↓
Store new tokens → Continue monitoring
```

## User Experience

### When Token Expires
1. User makes a request with expired token
2. System automatically attempts refresh
3. If refresh succeeds:
   - User continues seamlessly (no interruption)
   - New tokens stored
4. If refresh fails:
   - User redirected to login page
   - Message shown: "Your session has expired. Please log in again."
   - After login, user redirected back to original page

### Protected Routes
- Users without valid tokens cannot access protected routes
- Automatic redirect to login
- Original path stored for redirect after login
- Role-based access control enforced

### Auto-Refresh
- Tokens automatically refresh before expiration
- Checks every 30 minutes
- Refreshes when < 1 hour remaining
- Prevents unexpected session expiration
- User stays logged in for up to 30 days

## Security Features

1. **Token Rotation**: Refresh tokens are rotated on each use (backend feature)
2. **Automatic Cleanup**: All storage cleared on logout/expiration
3. **Role-based Access**: Routes protected by user role
4. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
5. **Session Tracking**: Original path stored for seamless redirect
6. **Token Validation**: Tokens validated before accessing protected resources

## Testing Token Expiration

### Manual Test
1. Login to the application
2. Open browser DevTools → Application → Local Storage
3. Delete `access_token` or set it to an invalid value
4. Try to navigate to a protected route
5. Should be redirected to login with message

### Test Auto-Refresh
1. Login to the application
2. Open browser console
3. Wait 30 minutes (or modify code to check every 1 minute for testing)
4. Should see log: "⏰ Token expires in X minutes, refreshing..."
5. Token should be refreshed automatically

### Check Token Status
```javascript
// In browser console
const { getTokenInfo } = require('./utils/tokenManager');
console.log(getTokenInfo());
```

## Error Handling

All authentication errors are handled gracefully:
- 401 errors trigger automatic refresh
- Failed refresh triggers redirect to login
- User-friendly error messages
- Console logging for debugging
- No exposed sensitive data in errors

## Storage Management

### localStorage
- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `user` - User profile data
- `vendor_profile` - Vendor profile (if applicable)
- `courier_profile` - Courier profile (if applicable)
- `cart` - Shopping cart data

### sessionStorage
- `auth_redirect_message` - Message to show on login page
- `redirect_after_login` - Path to redirect after successful login
- `temp_credentials` - Temporary storage for multi-profile selection
- `temp_profiles` - Available profiles for selection

### All Cleared On
- Logout
- Token refresh failure
- Token expiration
- Manual navigation to login

## Console Logs

The system uses emoji-prefixed console logs for easy debugging:
- ✅ Success operations
- ❌ Error/failure operations
- 🔄 Refresh/retry operations
- ⏰ Time-based operations
- 🚪 Redirect operations
- 🔐 Authentication checks
- 📤 Request operations
- 📥 Response operations

## Backend Requirements

The backend must support:
1. `POST /api/token/refresh/` - Refresh access token
   - Request: `{ "refresh": "refresh_token_here" }`
   - Response: `{ "access": "new_access_token", "refresh": "new_refresh_token" }`

2. Token rotation (auto-blacklist old refresh tokens)

3. Proper JWT expiration times:
   - Access token: 24 hours
   - Refresh token: 30 days

4. 401 responses with clear error messages

## Future Improvements

1. **httpOnly Cookies**: Store tokens in httpOnly cookies for better security
2. **Token Blacklisting UI**: Admin interface to view/manage blacklisted tokens
3. **Session Management**: View active sessions, logout from all devices
4. **Token Analytics**: Track token refresh patterns, failed attempts
5. **Biometric Auth**: Add fingerprint/face ID support
6. **Remember Me**: Extended refresh token lifetime option
7. **Multi-factor Auth**: Add 2FA support

## Troubleshooting

### Issue: User keeps getting logged out
- Check if refresh token is expired (30-day limit)
- Verify backend token refresh endpoint is working
- Check browser console for error messages
- Verify auto-refresh is running (should see logs every 30 min)

### Issue: Infinite redirect loop
- Clear browser storage completely
- Check if public endpoints are configured correctly
- Verify ProtectedRoute is not wrapping public routes

### Issue: Token not refreshing automatically
- Check browser console for auto-refresh setup log
- Verify setupAutoRefresh() is called in App.tsx
- Check if access token is actually expired (<1 hour remaining)

## Migration Notes

For existing users:
1. Old tokens remain valid until original expiry
2. New logins get 24-hour access tokens
3. No data migration required
4. Users should logout and login to get new tokens

## Summary

This implementation provides:
- ✅ Automatic token refresh
- ✅ Seamless user experience
- ✅ Secure token handling
- ✅ Public endpoint support
- ✅ Role-based access control
- ✅ Clear error messages
- ✅ Comprehensive logging
- ✅ Easy debugging
- ✅ Production-ready

Users will now be automatically redirected to login when their tokens expire, with proper handling of refresh attempts and clear communication about session status.
