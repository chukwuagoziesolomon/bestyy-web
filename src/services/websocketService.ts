class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // Start with 1 second
  private currentPath: string = '';
  private isRefreshingToken: boolean = false;
  private callbacks: {
    onOpen: ((event: Event) => void)[];
    onClose: ((event: CloseEvent) => void)[];
    onError: ((event: Event) => void)[];
    onMessage: ((message: any) => void)[];
  } = {
    onOpen: [],
    onClose: [],
    onError: [],
    onMessage: []
  };

  constructor() {
    // Properties are initialized above
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshingToken) {
      console.log('Token refresh already in progress');
      return null;
    }

    this.isRefreshingToken = true;
    
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.error('No refresh token available');
        return null;
      }

      console.log('Refreshing access token for WebSocket...');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/auth/token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newAccessToken = data.access;
      
      // Update the access token in localStorage
      localStorage.setItem('access_token', newAccessToken);
      console.log('Access token refreshed successfully');
      
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      return null;
    } finally {
      this.isRefreshingToken = false;
    }
  }

  async connect(path, token) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Store current path for reconnection
    this.currentPath = path;

    // Build WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WS_HOST || process.env.REACT_APP_API_URL?.replace(/^https?:\/\//, '') || window.location.host;
    const url = `${protocol}//${host}${path}?token=${token}`;

    console.log('Connecting to WebSocket:', url);
    this.socket = new WebSocket(url);

    this.socket.onopen = (event) => {
      console.log('WebSocket connected successfully');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;

      this.callbacks.onOpen.forEach(callback => callback(event));
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);

      this.callbacks.onClose.forEach(callback => callback(event));

      // Check if it's an authentication error (code 4001 or similar)
      // Or if connection was rejected (code 1006)
      if (event.code === 4001 || event.code === 1006) {
        console.log('WebSocket closed due to authentication error, attempting token refresh...');
        this.handleAuthError(path);
      } else if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        // Normal reconnection logic for other errors
        this.attemptReconnect(path, token);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.callbacks.onError.forEach(callback => callback(error));
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket message received:', message);

        this.callbacks.onMessage.forEach(callback => callback(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  private async handleAuthError(path: string) {
    console.log('Handling authentication error...');
    
    // Try to refresh the token
    const newToken = await this.refreshAccessToken();
    
    if (newToken) {
      // Reconnect with the new token
      console.log('Reconnecting with refreshed token...');
      this.reconnectAttempts = 0; // Reset reconnect attempts
      setTimeout(() => {
        this.connect(path, newToken);
      }, 1000);
    } else {
      console.error('Failed to refresh token, cannot reconnect WebSocket');
      // Don't attempt further reconnections
      this.reconnectAttempts = this.maxReconnectAttempts;
    }
  }

  attemptReconnect(path, token) {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

    setTimeout(() => {
      // Get the latest token from localStorage in case it was refreshed
      const currentToken = localStorage.getItem('access_token') || token;
      this.connect(path, currentToken);
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
    }
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }
}

export const webSocketService = new WebSocketService();
