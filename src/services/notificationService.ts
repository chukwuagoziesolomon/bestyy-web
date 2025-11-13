// Notification Service for Unified Webhook API Integration
// Handles fetching, managing, and processing notifications

export interface NotificationData {
  id: string;
  event_type: string;
  user_type: string;
  user_id: number;
  data: any;
  timestamp: string;
  read: boolean;
  title: string;
  message: string;
  type: 'verification' | 'order' | 'payment' | 'delivery';
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  data?: NotificationData[];
  error?: string;
  timestamp: string;
}

class NotificationService {
  private baseUrl: string;
  private wsConnection: WebSocket | null = null;
  private wsReconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL;
  }

  // Fetch all notifications for the current user
  async getNotifications(userId: number, userType: string): Promise<NotificationData[]> {
    try {
      const token = localStorage.getItem('token');
      const url = new URL(`${this.baseUrl}/api/user/notifications/`);
      url.searchParams.append('user_id', userId.toString());
      url.searchParams.append('user_type', userType);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: NotificationResponse = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Get unread notification count
  async getUnreadCount(userId: number, userType: string): Promise<number> {
    try {
      const notifications = await this.getNotifications(userId, userType);
      return notifications.filter(notification => !notification.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/api/user/notifications/${notificationId}/read/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: number, userType: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/api/user/notifications/mark-all-read/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_type: userType,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/api/user/notifications/${notificationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Connect to WebSocket for real-time notifications
  connectWebSocket(userId: number, userType: string, onNotification: (notification: NotificationData) => void): void {
    try {
      const wsUrl = `${this.baseUrl.replace('http', 'ws')}/ws/notifications/${userType}/${userId}/`;
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log('WebSocket connected for notifications');
        this.reconnectAttempts = 0;
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            onNotification(data.notification);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.wsConnection.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect(userId, userType, onNotification);
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  // Attempt to reconnect WebSocket
  private attemptReconnect(userId: number, userType: string, onNotification: (notification: NotificationData) => void): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(userId, userType, onNotification);
      }, this.wsReconnectInterval);
    } else {
      console.error('Max WebSocket reconnection attempts reached');
    }
  }

  // Disconnect WebSocket
  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  // Format notification for display
  formatNotification(notification: NotificationData): { title: string; message: string; icon: string; color: string } {
    const { event_type, data } = notification;

    switch (event_type) {
      case 'verification.approved':
        return {
          title: 'Verification Approved',
          message: 'Your account has been successfully verified!',
          icon: '✅',
          color: '#10B981'
        };

      case 'verification.rejected':
        return {
          title: 'Verification Rejected',
          message: data.reason || 'Your verification request was rejected. Please check your documents.',
          icon: '❌',
          color: '#EF4444'
        };

      case 'order.updated':
        return {
          title: 'Order Update',
          message: data.message || `Order #${data.order_id} status updated to ${data.status}`,
          icon: '📦',
          color: '#3B82F6'
        };

      case 'order.assigned':
        return {
          title: 'New Order Assignment',
          message: `You have been assigned to deliver order #${data.order_id}`,
          icon: '🚚',
          color: '#8B5CF6'
        };

      case 'order.cancelled':
        return {
          title: 'Order Cancelled',
          message: `Order #${data.order_id} has been cancelled. ${data.reason || ''}`,
          icon: '❌',
          color: '#EF4444'
        };

      case 'order.completed':
        return {
          title: 'Order Completed',
          message: `Order #${data.order_id} has been completed successfully`,
          icon: '✅',
          color: '#10B981'
        };

      case 'payment.completed':
        return {
          title: 'Payment Received',
          message: `Payment of $${data.amount} received for order #${data.order_id}`,
          icon: '💰',
          color: '#10B981'
        };

      case 'payment.failed':
        return {
          title: 'Payment Failed',
          message: `Payment failed for order #${data.order_id}. ${data.error || ''}`,
          icon: '❌',
          color: '#EF4444'
        };

      case 'payment.refunded':
        return {
          title: 'Payment Refunded',
          message: `Refund of $${data.amount} processed for order #${data.order_id}`,
          icon: '💸',
          color: '#F59E0B'
        };

      case 'delivery.assigned':
        return {
          title: 'Delivery Assigned',
          message: `You have been assigned to deliver order #${data.order_id}`,
          icon: '🚚',
          color: '#8B5CF6'
        };

      case 'delivery.started':
        return {
          title: 'Delivery Started',
          message: `Delivery for order #${data.order_id} has started`,
          icon: '🚀',
          color: '#3B82F6'
        };

      case 'delivery.completed':
        return {
          title: 'Delivery Completed',
          message: `Order #${data.order_id} has been delivered successfully`,
          icon: '✅',
          color: '#10B981'
        };

      case 'delivery.failed':
        return {
          title: 'Delivery Failed',
          message: `Delivery failed for order #${data.order_id}. ${data.failure_reason || ''}`,
          icon: '❌',
          color: '#EF4444'
        };

      default:
        return {
          title: 'New Notification',
          message: 'You have received a new notification',
          icon: '🔔',
          color: '#6B7280'
        };
    }
  }

  // Get notification type from event type
  getNotificationType(eventType: string): 'verification' | 'order' | 'payment' | 'delivery' {
    if (eventType.startsWith('verification.')) return 'verification';
    if (eventType.startsWith('order.')) return 'order';
    if (eventType.startsWith('payment.')) return 'payment';
    if (eventType.startsWith('delivery.')) return 'delivery';
    return 'order'; // default
  }

  // Get priority based on event type
  getPriority(eventType: string): 'low' | 'medium' | 'high' {
    const highPriorityEvents = [
      'verification.rejected',
      'payment.failed',
      'delivery.failed',
      'order.cancelled'
    ];

    const mediumPriorityEvents = [
      'verification.approved',
      'order.assigned',
      'delivery.assigned',
      'payment.completed'
    ];

    if (highPriorityEvents.includes(eventType)) return 'high';
    if (mediumPriorityEvents.includes(eventType)) return 'medium';
    return 'low';
  }
}

export const notificationService = new NotificationService();
