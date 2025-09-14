# Environment Configuration

This project uses the `REACT_APP_API_URL` environment variable to manage API endpoints for different environments.

## Environment Variables

### Development
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

### Production
```env
REACT_APP_API_URL=https://bestie-server.onrender.com
```

## How to Switch Environments

### Option 1: Create a .env file
Create a `.env` file in the root directory with:
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

### Option 2: Use environment variables
Set the environment variable before running the app:
```bash
# Windows (PowerShell)
$env:REACT_APP_API_URL="http://127.0.0.1:8000"
npm start

# Windows (Command Prompt)
set REACT_APP_API_URL=http://127.0.0.1:8000
npm start

# Linux/Mac
export REACT_APP_API_URL=http://127.0.0.1:8000
npm start
```

## Files Using REACT_APP_API_URL

The following files automatically use the `REACT_APP_API_URL` environment variable:

- `src/api.ts` - Main API configuration
- `src/config.ts` - General configuration
- `src/context/AuthContext.tsx` - Authentication context
- `src/utils/axiosConfig.ts` - Axios configuration
- `src/api/auth.ts` - Authentication API
- `src/toast.ts` - Toast notifications

All dashboard components import `API_URL` from `src/api.ts`, so they automatically use the environment variable.

## Default Fallback

If no environment variable is set, the project defaults to development mode:
- Default URL: `http://127.0.0.1:8000`

## Verification

To verify which URL is being used, check the browser's Network tab or console logs. All API calls should point to your configured URL.
