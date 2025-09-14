# 🔔 Unified Notification System

## 🚀 Overview

The Unified Notification System integrates with the Unified Webhook API to provide real-time notifications across the Bestyy platform. Users receive notifications via multiple channels including in-app notifications, WebSocket real-time updates, and browser notifications.

## 🎯 Features

### ✅ Real-time Notifications
- **WebSocket Integration**: Live updates without page refresh
- **Badge Count**: Shows unread notification count on bell icon
- **Browser Notifications**: Native browser notifications for new messages
- **Auto-reconnection**: Automatic WebSocket reconnection on connection loss

### ✅ Multi-channel Support
- **In-app Notifications**: Real-time popup notifications
- **WebSocket**: Live updates for all connected clients
- **WhatsApp**: Integration with WhatsApp Business API
- **Email**: Email notifications for important events

### ✅ User Experience
- **Bell Icon**: Prominent notification bell in navigation bars
- **Notification Page**: Dedicated page to view all notifications
- **Filtering**: Filter notifications by type (verification, order, payment, delivery)
- **Mark as Read**: Individual and bulk mark as read functionality
- **Delete Notifications**: Remove unwanted notifications

## 📁 File Structure

```
src/
├── services/
│   └── notificationService.ts          # Core notification service
├── components/
│   ├── NotificationBell.tsx            # Bell icon with badge
│   └── NotificationsWrapper.tsx        # Wrapper for user data
├── pages/
│   └── NotificationsPage.tsx           # Full notifications page
└── App.tsx                             # Routing configuration
```

## 🔧 Components

### 1. NotificationBell Component

**Location**: `src/components/NotificationBell.tsx`

**Features**:
- Displays unread notification count as a badge
- Animated pulse effect for new notifications
- Hover tooltip showing notification status
- Click handler to navigate to notifications page
- WebSocket integration for real-time updates
- Browser notification support

**Props**:
```typescript
interface NotificationBellProps {
  userId: number;        // User ID for notifications
  userType: string;      // User type (user, vendor, courier)
  className?: string;    // Optional CSS class
}
```

**Usage**:
```tsx
<NotificationBell 
  userId={123} 
  userType="vendor" 
  className="custom-bell" 
/>
```

### 2. NotificationsPage Component

**Location**: `src/pages/NotificationsPage.tsx`

**Features**:
- Full notification management interface
- Filter notifications by type and read status
- Bulk operations (mark all read, delete selected)
- Real-time updates via WebSocket
- Responsive design for mobile and desktop
- Detailed notification formatting

**Props**:
```typescript
interface NotificationsPageProps {
  userId: number;        // User ID for notifications
  userType: string;      // User type (user, vendor, courier)
}
```

### 3. NotificationService

**Location**: `src/services/notificationService.ts`

**Features**:
- API integration with Unified Webhook API
- WebSocket connection management
- Notification formatting and categorization
- Error handling and reconnection logic
- Browser notification support

**Key Methods**:
```typescript
// Fetch all notifications
getNotifications(userId: number, userType: string): Promise<NotificationData[]>

// Get unread count
getUnreadCount(userId: number, userType: string): Promise<number>

// Mark as read
markAsRead(notificationId: string): Promise<boolean>

// Mark all as read
markAllAsRead(userId: number, userType: string): Promise<boolean>

// Delete notification
deleteNotification(notificationId: string): Promise<boolean>

// WebSocket connection
connectWebSocket(userId: number, userType: string, onNotification: Function): void
```

## 🛣️ Routing

The notification system is integrated into the main routing structure:

### User Routes
- `/user/notifications` - User notifications page

### Vendor Routes  
- `/vendor/notifications` - Vendor notifications page

### Courier Routes
- `/courier/notifications` - Courier notifications page

### General Route
- `/notifications` - General notifications page (auto-detects user type)

## 🔌 Integration Points

### 1. Navigation Bars

**DashboardNavbar** (`src/components/DashboardNavbar.tsx`):
```tsx
{showNotification && (
  userId && userType ? (
    <NotificationBell 
      userId={userId} 
      userType={userType}
      className="dashboard-notification-bell"
    />
  ) : (
    <div>Static bell icon</div>
  )
)}
```

**Explore Page** (`src/explore.tsx`):
```tsx
{userProfile?.id && userProfile?.user_type ? (
  <NotificationBell 
    userId={userProfile.id} 
    userType={userProfile.user_type}
    className="explore-notification-bell"
  />
) : (
  <button>Static bell icon</button>
)}
```

### 2. WebSocket Integration

The system automatically connects to WebSocket when components mount:

```typescript
useEffect(() => {
  if (userId && userType) {
    const handleNewNotification = (notification: NotificationData) => {
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        const formatted = notificationService.formatNotification(notification);
        new Notification(formatted.title, {
          body: formatted.message,
          icon: '/favicon.ico',
          tag: notification.id,
        });
      }
    };

    notificationService.connectWebSocket(userId, userType, handleNewNotification);
    
    return () => {
      notificationService.disconnectWebSocket();
    };
  }
}, [userId, userType]);
```

## 📱 Notification Types

### Verification Notifications
- **verification.approved**: Account verification successful
- **verification.rejected**: Account verification rejected with reason

### Order Notifications  
- **order.updated**: Order status changes
- **order.assigned**: Order assigned to courier
- **order.cancelled**: Order cancelled
- **order.completed**: Order completed successfully

### Payment Notifications
- **payment.completed**: Payment received
- **payment.failed**: Payment failed with error
- **payment.refunded**: Payment refunded

### Delivery Notifications
- **delivery.assigned**: Delivery assigned to courier
- **delivery.started**: Delivery started
- **delivery.completed**: Delivery completed
- **delivery.failed**: Delivery failed with reason

## 🎨 Styling

### Notification Bell Styling
- **Badge**: Red gradient background with white text
- **Animation**: Pulse effect for new notifications
- **Hover**: Blue background highlight
- **Tooltip**: Dark background with white text

### Notifications Page Styling
- **Layout**: Clean, card-based design
- **Filters**: Pill-shaped filter buttons
- **Notifications**: Card layout with icons and timestamps
- **Responsive**: Mobile-first responsive design

## 🔒 Security

### WebSocket Security
- **Authentication**: Uses JWT tokens for WebSocket connections
- **User Isolation**: Each user connects to their own WebSocket channel
- **Error Handling**: Graceful handling of connection failures

### API Security
- **Token-based**: Uses Bearer tokens for API authentication
- **CORS**: Proper CORS configuration for cross-origin requests
- **Validation**: Input validation for all API calls

## 🚀 Performance

### Optimization Features
- **Lazy Loading**: Notifications loaded on demand
- **Pagination**: Large notification lists are paginated
- **Caching**: Notification data cached in component state
- **Debouncing**: WebSocket reconnection is debounced

### Memory Management
- **Cleanup**: WebSocket connections properly cleaned up
- **State Management**: Efficient state updates to prevent re-renders
- **Event Listeners**: Proper cleanup of event listeners

## 🧪 Testing

### Manual Testing
1. **Bell Icon**: Click bell icon to navigate to notifications page
2. **Badge Count**: Verify unread count updates in real-time
3. **WebSocket**: Test real-time updates by sending webhook events
4. **Browser Notifications**: Test browser notification permissions
5. **Filtering**: Test notification filtering by type and status
6. **Bulk Operations**: Test mark all read and delete selected

### Test Scenarios
- **New Notification**: Send webhook event and verify bell badge updates
- **Connection Loss**: Disconnect network and verify reconnection
- **Multiple Users**: Test with multiple users to verify isolation
- **Mobile Responsive**: Test on mobile devices
- **Browser Compatibility**: Test across different browsers

## 🔧 Configuration

### Environment Variables
```bash
# API Base URL
REACT_APP_API_URL=http://localhost:8000

# WebSocket URL (auto-configured from API URL)
# WebSocket will use ws:// or wss:// based on API URL protocol
```

### WebSocket Configuration
```typescript
// WebSocket URL format
const wsUrl = `${baseUrl.replace('http', 'ws')}/ws/notifications/${userType}/${userId}/`;

// Reconnection settings
private wsReconnectInterval: number = 5000;  // 5 seconds
private maxReconnectAttempts: number = 5;     // Max 5 attempts
```

## 📊 Monitoring

### Logging
The system logs important events:
- WebSocket connection status
- Notification processing
- Error conditions
- User interactions

### Metrics to Track
- **Notification Delivery**: Success rate of notifications
- **WebSocket Connections**: Active connection count
- **User Engagement**: Click-through rates on notifications
- **Error Rates**: Failed API calls and WebSocket errors

## 🚀 Deployment

### Prerequisites
1. **Backend API**: Unified Webhook API must be deployed
2. **WebSocket Server**: WebSocket server for real-time updates
3. **Environment Variables**: Proper API URL configuration

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# The notification system will be included in the build
```

### Post-Deployment
1. **Test WebSocket**: Verify WebSocket connections work
2. **Test API**: Verify notification API endpoints respond
3. **Test Permissions**: Verify browser notification permissions
4. **Monitor Logs**: Check for any connection or API errors

## 🔄 Future Enhancements

### Planned Features
- **Push Notifications**: Mobile push notification support
- **Notification Preferences**: User-configurable notification settings
- **Rich Notifications**: Support for images and actions in notifications
- **Notification History**: Extended notification history and search
- **Analytics Dashboard**: Notification analytics and insights

### Integration Opportunities
- **Mobile Apps**: React Native integration
- **Desktop Apps**: Electron integration
- **Third-party Services**: Slack, Discord, Telegram integrations
- **CRM Systems**: Integration with customer relationship management

## 🆘 Troubleshooting

### Common Issues

**Bell Icon Not Showing Badge**:
- Check if user is logged in
- Verify WebSocket connection
- Check browser console for errors

**Notifications Not Loading**:
- Verify API endpoint is accessible
- Check authentication token
- Verify user permissions

**WebSocket Connection Issues**:
- Check network connectivity
- Verify WebSocket server is running
- Check browser WebSocket support

**Browser Notifications Not Working**:
- Check notification permissions
- Verify HTTPS for production
- Check browser notification support

### Debug Mode
Enable debug logging by setting:
```typescript
// In notificationService.ts
const DEBUG = process.env.NODE_ENV === 'development';
```

## 📞 Support

For issues or questions about the notification system:
1. Check the browser console for errors
2. Verify API endpoints are accessible
3. Test WebSocket connections
4. Check user authentication status

The notification system is designed to be robust and user-friendly, providing seamless real-time communication across the Bestyy platform! 🎉
