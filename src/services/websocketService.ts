class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // Start with 1 second
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

  connect(path, token) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

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

      // Implement reconnection logic
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
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

  attemptReconnect(path, token) {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

    setTimeout(() => {
      this.connect(path, token);
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
