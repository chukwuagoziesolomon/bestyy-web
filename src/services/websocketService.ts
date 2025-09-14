import { showSuccess, showError } from '../toast';

// Types for WebSocket messages
export interface VerificationNotificationData {
  type: 'verification.status_changed';
  user_type: 'vendor' | 'courier';
  status: 'approved' | 'rejected' | 'pending';
  business_name?: string;
  admin_notes?: string;
  timestamp: string;
}

export interface WebSocketMessage {
  type: 'verification_notification';
  data: VerificationNotificationData;
}

export interface WebSocketResponse {
  success: boolean;
  message: string;
}

class WebSocketService {
  private vendorSocket: WebSocket | null = null;
  private courierSocket: WebSocket | null = null;
  private baseUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  // Callbacks for handling notifications
  private onVerificationNotification?: (data: VerificationNotificationData) => void;
  private onConnectionStatusChange?: (connected: boolean) => void;

  // Set callback for verification notifications
  setVerificationNotificationCallback(callback: (data: VerificationNotificationData) => void) {
    this.onVerificationNotification = callback;
  }

  // Set callback for connection status changes
  setConnectionStatusCallback(callback: (connected: boolean) => void) {
    this.onConnectionStatusChange = callback;
  }

  // Connect to vendor WebSocket
  connectVendorWebSocket(): void {
    if (this.vendorSocket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.vendorSocket = new WebSocket(`${this.baseUrl}/ws/vendor/`);

      this.vendorSocket.onopen = () => {
        console.log('Vendor WebSocket connected');
        this.reconnectAttempts = 0;
        this.onConnectionStatusChange?.(true);
      };

      this.vendorSocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'verification_notification') {
            console.log('Received verification notification:', message.data);
            this.handleVerificationNotification(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.vendorSocket.onclose = () => {
        console.log('Vendor WebSocket disconnected');
        this.onConnectionStatusChange?.(false);
        this.attemptReconnect('vendor');
      };

      this.vendorSocket.onerror = (error) => {
        console.error('Vendor WebSocket error:', error);
        this.onConnectionStatusChange?.(false);
      };
    } catch (error) {
      console.error('Failed to connect to vendor WebSocket:', error);
      this.onConnectionStatusChange?.(false);
    }
  }

  // Connect to courier WebSocket
  connectCourierWebSocket(): void {
    if (this.courierSocket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.courierSocket = new WebSocket(`${this.baseUrl}/ws/courier/`);

      this.courierSocket.onopen = () => {
        console.log('Courier WebSocket connected');
        this.reconnectAttempts = 0;
        this.onConnectionStatusChange?.(true);
      };

      this.courierSocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'verification_notification') {
            console.log('Received verification notification:', message.data);
            this.handleVerificationNotification(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.courierSocket.onclose = () => {
        console.log('Courier WebSocket disconnected');
        this.onConnectionStatusChange?.(false);
        this.attemptReconnect('courier');
      };

      this.courierSocket.onerror = (error) => {
        console.error('Courier WebSocket error:', error);
        this.onConnectionStatusChange?.(false);
      };
    } catch (error) {
      console.error('Failed to connect to courier WebSocket:', error);
      this.onConnectionStatusChange?.(false);
    }
  }

  // Handle verification notification
  private handleVerificationNotification(data: VerificationNotificationData): void {
    if (this.onVerificationNotification) {
      this.onVerificationNotification(data);
    }

    // Show toast notification
    if (data.status === 'approved') {
      showSuccess(`🎉 Congratulations! Your ${data.user_type} account has been approved!`);
    } else if (data.status === 'rejected') {
      showError(`❌ Your ${data.user_type} application was not approved. Please check the details.`);
    } else {
      showSuccess(`📋 Your ${data.user_type} account status has been updated.`);
    }
  }

  // Attempt to reconnect WebSocket
  private attemptReconnect(userType: 'vendor' | 'courier'): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(`Max reconnection attempts reached for ${userType} WebSocket`);
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect ${userType} WebSocket (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (userType === 'vendor') {
        this.connectVendorWebSocket();
      } else {
        this.connectCourierWebSocket();
      }
    }, this.reconnectInterval);
  }

  // Disconnect WebSocket
  disconnectWebSocket(userType: 'vendor' | 'courier'): void {
    if (userType === 'vendor' && this.vendorSocket) {
      this.vendorSocket.close();
      this.vendorSocket = null;
    } else if (userType === 'courier' && this.courierSocket) {
      this.courierSocket.close();
      this.courierSocket = null;
    }
  }

  // Disconnect all WebSockets
  disconnectAll(): void {
    this.disconnectWebSocket('vendor');
    this.disconnectWebSocket('courier');
  }

  // Check if WebSocket is connected
  isConnected(userType: 'vendor' | 'courier'): boolean {
    if (userType === 'vendor') {
      return this.vendorSocket?.readyState === WebSocket.OPEN;
    } else {
      return this.courierSocket?.readyState === WebSocket.OPEN;
    }
  }

  // Get connection status
  getConnectionStatus(userType: 'vendor' | 'courier'): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (userType === 'vendor') {
      if (!this.vendorSocket) return 'disconnected';
      switch (this.vendorSocket.readyState) {
        case WebSocket.CONNECTING:
          return 'connecting';
        case WebSocket.OPEN:
          return 'connected';
        case WebSocket.CLOSING:
        case WebSocket.CLOSED:
          return 'disconnected';
        default:
          return 'error';
      }
    } else {
      if (!this.courierSocket) return 'disconnected';
      switch (this.courierSocket.readyState) {
        case WebSocket.CONNECTING:
          return 'connecting';
        case WebSocket.OPEN:
          return 'connected';
        case WebSocket.CLOSING:
        case WebSocket.CLOSED:
          return 'disconnected';
        default:
          return 'error';
      }
    }
  }
}

export const websocketService = new WebSocketService();
