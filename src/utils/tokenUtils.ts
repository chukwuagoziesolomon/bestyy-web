// Token utility functions for debugging and validation
export function decodeJwtToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

export function isTokenExpired(token: string) {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

export function getTokenInfo(token: string) {
  const decoded = decodeJwtToken(token);
  if (!decoded) {
    return {
      isValid: false,
      isExpired: true,
      expiresAt: null,
      timeUntilExpiry: null,
      userId: null
    };
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = decoded.exp < currentTime;
  const timeUntilExpiry = decoded.exp - currentTime;

  return {
    isValid: true,
    isExpired,
    expiresAt: new Date(decoded.exp * 1000),
    timeUntilExpiry: isExpired ? 0 : timeUntilExpiry,
    userId: decoded.user_id || decoded.sub,
    payload: decoded
  };
}

export function logTokenStatus(context = 'Token Status') {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  console.log(`🔍 ${context}:`);
  console.log('Access Token exists:', !!accessToken);
  console.log('Refresh Token exists:', !!refreshToken);
  
  if (accessToken) {
    const tokenInfo = getTokenInfo(accessToken);
    console.log('Access Token Info:', {
      isValid: tokenInfo.isValid,
      isExpired: tokenInfo.isExpired,
      expiresAt: tokenInfo.expiresAt,
      timeUntilExpiry: tokenInfo.timeUntilExpiry ? `${tokenInfo.timeUntilExpiry} seconds` : null,
      userId: tokenInfo.userId
    });
  }
  
  if (refreshToken) {
    const refreshTokenInfo = getTokenInfo(refreshToken);
    console.log('Refresh Token Info:', {
      isValid: refreshTokenInfo.isValid,
      isExpired: refreshTokenInfo.isExpired,
      expiresAt: refreshTokenInfo.expiresAt,
      timeUntilExpiry: refreshTokenInfo.timeUntilExpiry ? `${refreshTokenInfo.timeUntilExpiry} seconds` : null
    });
  }
}