import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';
import { fetchOrderConfirmation, fetchOrderTracking, API_URL } from './api';
import { useWebSocket } from './hooks/useWebSocket';
import { Check, CheckCircle, ShoppingCart, CreditCard as CreditCardIcon, ChefHat, Package, Truck, Utensils, Star, Phone, MapPin, User as UserIcon, Mail, AlertTriangle, Clipboard, Clock, MessageCircle, Landmark, Banknote } from 'lucide-react';
import { showSuccess } from './toast';

interface OrderItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image?: string;
  customizations?: any;
}

interface OrderDetails {
  success: boolean;
  order: {
    id: number;
    order_number: string;
    status: string;
    status_display: string;
    created_at: string;
    estimated_delivery: string;
    special_instructions?: string;
    payment_method: string;
    payment_confirmed: boolean;
    payment_confirmed_at?: string;
    delivery_otp?: string;
    pickup_code?: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    username?: string;
    password?: string;
  };
  login_credentials?: {
    username: string;
    password: string;
  };
  vendor: {
    id: number;
    name: string;
    logo?: string;
    phone: string;
    address: string;
    rating?: number;
  };
  courier?: {
    id: number;
    name: string;
    phone: string;
    vehicle_type?: string;
    rating?: number;
  };
  items: Array<OrderItem>;
  pricing: {
    subtotal: number;
    delivery_fee: number;
    service_fee: number;
    total: number;
    currency: string;
  };
  delivery: {
    address: string;
    otp_instructions?: string;
    estimated_time: string;
  };
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    icon: string;
  }>;
  payment: {
    status: string;
    message: string;
    method: string;
    reference?: string;
  };
  dva_details?: {
    account_number: string;
    account_name: string;
    bank_name: string;
    amount: number;
    reference: string;
    instructions: string[];
    expires_in: string;
    support_contact: string;
  };
  actions?: Array<{
    type: string;
    label: string;
    description: string;
    primary: boolean;
  }>;
  support: {
    phone: string;
    email: string;
    whatsapp?: string;
    chat_url?: string;
  };
  websocket: {
    url: string;
    enabled: boolean;
  };
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState<boolean>(false);
  const [showCancellationSuggestions, setShowCancellationSuggestions] = useState<boolean>(false);
  const [cancellationData, setCancellationData] = useState<any>(null);
  const [showTrackOrderModal, setShowTrackOrderModal] = useState<boolean>(false);
  const [trackOrderData, setTrackOrderData] = useState<any>(null);
  const [loadingTrackOrder, setLoadingTrackOrder] = useState<boolean>(false);
  const [liveTracking, setLiveTracking] = useState<any>(null);

  // WebSocket for real-time order tracking
  const token = localStorage.getItem('access_token');
  useWebSocket(token || '', orderId ? `/ws/orders/${orderId}/track/` : '', {
    onOpen: (event) => {
      console.log('Order tracking WebSocket connected');
    },
    onClose: (event) => {
      console.log('Order tracking WebSocket disconnected');
    },
    onError: (error) => {
      console.error('Order tracking WebSocket error:', error);
    },
    onMessage: (message) => {
      console.log('Received order update:', message);
      handleOrderUpdate(message);
    }
  });

  // Handle real-time order updates
  const handleOrderUpdate = (update: any) => {
    if (!orderDetails) return;

    try {
      if (update.type === 'order_status_update') {
        // Update order status and timeline
        setOrderDetails(prev => {
          if (!prev) return prev;

          const newStatus = update.status;
          const newStatusDisplay = update.status_display || newStatus.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

          // Add new timeline entry if status changed
          const newTimeline = [...prev.timeline];
          if (newStatus !== prev.order.status) {
            const statusEntry = {
              status: newStatus,
              title: newStatusDisplay,
              description: update.description || `Order status updated to ${newStatusDisplay}`,
              timestamp: update.timestamp || new Date().toISOString(),
              completed: true,
              icon: getStatusIcon(newStatus)
            };
            newTimeline.push(statusEntry);
          }

          return {
            ...prev,
            order: {
              ...prev.order,
              status: newStatus,
              status_display: newStatusDisplay
            },
            timeline: newTimeline
          };
        });

        // Show notification for status update
        showSuccess(`Order status updated: ${update.status_display || update.status}`);

      } else if (update.type === 'courier_assigned') {
        // Update courier information
        setOrderDetails(prev => {
          if (!prev) return prev;

          return {
            ...prev,
            courier: {
              id: update.courier.id,
              name: update.courier.name,
              phone: update.courier.phone,
              vehicle_type: update.courier.vehicle_type,
              rating: update.courier.rating
            }
          };
        });

        showSuccess('Courier assigned to your order!');

      } else if (update.type === 'payment_confirmed') {
        // Update payment status
        setOrderDetails(prev => {
          if (!prev) return prev;

          return {
            ...prev,
            order: {
              ...prev.order,
              payment_confirmed: true,
              payment_confirmed_at: update.timestamp
            },
            payment: {
              ...prev.payment,
              status: 'confirmed',
              message: 'Payment confirmed',
              confirmed_at: update.timestamp
            }
          };
        });

        showSuccess('Payment confirmed successfully!');

      } else if (update.type === 'delivery_otp') {
        // Update delivery OTP
        setOrderDetails(prev => {
          if (!prev) return prev;

          return {
            ...prev,
            order: {
              ...prev.order,
              delivery_otp: update.otp
            }
          };
        });

        showSuccess(`Delivery OTP: ${update.otp}`);

      } else if (update.type === 'order.cancelled_suggestions') {
        // Show cancellation suggestions modal
        setCancellationData(update);
        setShowCancellationSuggestions(true);
      }

    } catch (error) {
      console.error('Error handling order update:', error);
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'placed': return 'shopping-cart';
      case 'confirmed': return 'check';
      case 'preparing': return 'utensils';
      case 'ready': return 'package';
      case 'out_for_delivery': return 'truck';
      case 'delivered': return 'check-circle';
      default: return 'clock';
    }
  };

  // Handle quick actions from cancellation modal
  const handleQuickAction = (action: any) => {
    switch (action.type) {
      case 'reorder':
        // TODO: Implement reorder original item
        alert(`Reordering ${action.item}...`);
        break;
      case 'view_suggestions':
        // Already showing suggestions, maybe scroll to them
        break;
      case 'contact_support':
        window.location.href = action.url;
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Handle adding item to cart from suggestions
  const handleAddToCart = async (item: any) => {
    try {
      // TODO: Implement add to cart API call
      // For now, just show success message
      showSuccess(`${item.name} added to cart!`);

      // Close modal after short delay
      setTimeout(() => {
        setShowCancellationSuggestions(false);
        // Navigate to checkout or cart page
        navigate('/checkout');
      }, 1500);

    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Load track order data from API
  const loadTrackOrderData = async (showModal = true) => {
    if (!orderId) return;

    setLoadingTrackOrder(true);
    try {
      const token = localStorage.getItem('access_token');
      const data = await fetchOrderTracking(token || '', orderId);
      console.log('Tracking data received:', data);
      setTrackOrderData(data);
      setLiveTracking(data); // Update live tracking data
      if (showModal) {
        setShowTrackOrderModal(true);
      }
    } catch (error) {
      console.error('Failed to load track order data:', error);
      if (showModal) {
        alert('Failed to load tracking information. Please try again.');
      }
    } finally {
      setLoadingTrackOrder(false);
    }
  };
  const [webSocketConnected, setWebSocketConnected] = useState<boolean>(false);

  // WebSocket for real-time order tracking
  const webSocketService = useWebSocket('', orderDetails?.websocket.enabled ? orderDetails.websocket.url : '', {
    onMessage: (message: any) => {
      console.log('Received WebSocket message:', message);
      // Handle real-time order updates
      if (message.type === 'order_update') {
        // Refresh order data when status changes
        if (orderId) {
          fetchOrderData(orderId);
        }
      }
    },
    onOpen: () => {
      console.log('WebSocket connected for order tracking');
      setWebSocketConnected(true);
    },
    onClose: () => {
      console.log('WebSocket disconnected');
      setWebSocketConnected(false);
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
      setWebSocketConnected(false);
    }
  });

  const fetchOrderData = async (id: string) => {
    try {
      setLoading(true);
      console.log('Fetching order confirmation for order ID:', id);

      const data = await fetchOrderConfirmation('', id, true); // Public endpoint with session support
      console.log('Order confirmation data received:', data);
      console.log('DVA Details from API:', data.dva_details);

      if (data.success) {
        setOrderDetails(data);
      } else {
        throw new Error('Failed to load order details');
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      // Force fresh data by adding cache-busting parameter
      fetchOrderData(orderId);
      // Load tracking data immediately
      loadTrackOrderData(false);
      
      // Auto-refresh tracking every 30 seconds
      const trackingInterval = setInterval(() => {
        loadTrackOrderData(false);
      }, 30000);
      
      return () => clearInterval(trackingInterval);
    } else {
      setError('Order ID not found');
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="order-confirmation-page">
        <div className="error-state">
          <AlertTriangle size={40} className="error-icon" />
          <h2>Order Not Found</h2>
          <p>{error || "We couldn't find your order details."}</p>
          <Link to="/recommendations" className="home-button">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  // Real order data from API is now in orderDetails state

  const handleAction = async (actionType: string) => {
    if (!orderDetails) return;

    switch (actionType) {
      case 'payment_transferred':
        await handlePaymentVerification();
        break;
      case 'cancel':
        alert('Order cancellation feature coming soon! Please contact support.');
        break;
      case 'call_courier':
        if (orderDetails.courier?.phone) {
          window.location.href = `tel:${orderDetails.courier.phone}`;
        } else {
          alert('Courier contact information not available yet.');
        }
        break;
      case 'call_vendor':
        if (orderDetails.vendor.phone) {
          window.location.href = `tel:${orderDetails.vendor.phone}`;
        }
        break;
      case 'call_support':
        if (orderDetails.support.phone) {
          window.location.href = `tel:${orderDetails.support.phone}`;
        }
        break;
      case 'rate_order':
        alert('Rating feature coming soon!');
        break;
      case 'reorder':
        alert('Reorder feature coming soon!');
        break;
      default:
        alert(`Action "${actionType}" is not yet implemented.`);
    }
  };

  const handlePaymentVerification = async () => {
    setVerifyingPayment(true);
    try {
      const response = await fetch(`${API_URL}/api/user/orders/${orderDetails.order.id}/confirmation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include', // Include Django session cookies
        body: new URLSearchParams({ 'action': 'payment_transferred' })
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const result = await response.json();
      console.log('Payment verification result:', result);

      alert('Payment verification initiated! Your payment will be confirmed shortly.');
      // Refresh order data to show updated status
      if (orderId) {
        fetchOrderData(orderId);
      }
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      alert('Payment verification request noted. Our team will verify your payment shortly.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  // Instead of alert, use toast!
  const copyToClipboard = (text: string, label: string = 'Copied') => {
    navigator.clipboard.writeText(text);
    showSuccess(`${label} copied!`);
  };

  return (
    <div className="order-confirmation-page">
      {/* Success Header */}
      <div className="confirmation-header">
        <div className="success-animation">
          <div className="checkmark-circle">
            <Check size={36} color="white" />
          </div>
        </div>
        <h1>Order Confirmed!</h1>
        <p className="order-number">{orderDetails.order.order_number}</p>
        <p className="confirmation-message">
          Your delicious food is being prepared and will be delivered soon.
        </p>
      </div>

      {/* Order Status Card */}
      <div className="status-card">
        <div className="status-header">
          <div className="status-icon"><Truck size={32} /></div>
          <div className="status-info">
            <h3>Order Status: {liveTracking?.order?.status_display || orderDetails.order.status_display}</h3>
            <p className="delivery-time">Estimated Delivery: {orderDetails.delivery.estimated_time}</p>
            {orderDetails.websocket.enabled && (
              <div className="websocket-status">
                <span className={`status-dot ${webSocketConnected ? 'connected' : 'disconnected'}`}></span>
                <span className="status-text">
                  {webSocketConnected ? 'Live tracking active' : 'Connecting...'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        {liveTracking?.order?.progress_percentage !== undefined && (
          <div className="order-progress-bar">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${liveTracking.order.progress_percentage}%` }}
              >
                <span className="progress-text">{liveTracking.order.progress_percentage}%</span>
              </div>
            </div>
            <p className="progress-label">Order Progress</p>
          </div>
        )}
        <div className="order-timeline">
          {(liveTracking?.order?.timeline || orderDetails.timeline).map((step: any, index: number) => (
            <div key={index} className={`timeline-step ${step.completed ? 'completed' : 'pending'}`}>
              <div className="timeline-icon">
                {(step.icon === 'shopping-cart' || step.icon === '📝') && <ShoppingCart size={22} />}
                {(step.icon === 'credit-card' || step.icon === '💳') && <CreditCardIcon size={22} />}
                {(step.icon === 'check' || step.icon === '✅') && <Check size={22} />}
                {(step.icon === 'check-circle' || step.icon === '✓') && <CheckCircle size={22} />}
                {(step.icon === 'chef-hat' || step.icon === '👨‍🍳') && <ChefHat size={22} />}
                {(step.icon === 'package' || step.icon === '📦') && <Package size={22} />}
                {(step.icon === 'truck' || step.icon === '🚚') && <Truck size={22} />}
                {(step.icon === 'utensils' || step.icon === '🍴') && <Utensils size={22} />}
                {step.icon === '⏱️' && <Clock size={22} />}
              </div>
              <div className="timeline-content">
                <h4>{step.title || step.label}</h4>
                <p>{step.description || ''}</p>
                <span className="timeline-timestamp">
                  {step.timestamp && new Date(step.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="order-details-card">
        <h3>Order Details</h3>

        {/* Vendor Info */}
        <div className="vendor-info">
          <div className="vendor-name">
            <strong>{orderDetails.vendor.name}</strong>
          </div>
          <div className="vendor-contact">
            <Phone size={16} /> {orderDetails.vendor.phone}
          </div>
          {orderDetails.vendor.address && (
            <div className="vendor-address">
              <MapPin size={16} /> {orderDetails.vendor.address}
            </div>
          )}
          {orderDetails.vendor.rating && (
            <div className="vendor-rating">
              <Star size={16} /> {orderDetails.vendor.rating}
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="customer-info">
          <h4>Customer Details</h4>
          <div className="customer-name">
            <UserIcon size={16} /> {orderDetails.customer.name}
          </div>
          <div className="customer-contact">
            <Phone size={16} /> {orderDetails.customer.phone}
          </div>
          <div className="customer-email">
            <Mail size={16} /> {orderDetails.customer.email}
          </div>
        </div>

        {/* Courier Info */}
        {orderDetails.courier && (
          <div className="courier-info">
            <h4>Delivery Courier</h4>
            <div className="courier-name">
              <Truck size={16} /> {orderDetails.courier.name}
            </div>
            <div className="courier-contact">
              <Phone size={16} /> {orderDetails.courier.phone}
            </div>
            {orderDetails.courier.vehicle_type && (
              <div className="courier-vehicle">
                <Truck size={16} /> {orderDetails.courier.vehicle_type}
              </div>
            )}
            {orderDetails.courier.rating && (
              <div className="courier-rating">
                <Star size={16} /> {orderDetails.courier.rating}
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="order-items">
          {orderDetails.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">×{item.quantity}</span>
              </div>
              <span className="item-price">₦{item.total_price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal</span>
            <span>₦{orderDetails.pricing.subtotal.toLocaleString()}</span>
          </div>
          <div className="price-row">
            <span>Delivery Fee</span>
            <span>₦{orderDetails.pricing.delivery_fee.toLocaleString()}</span>
          </div>
          <div className="price-row">
            <span>Platform Fee</span>
            <span>₦{orderDetails.pricing.service_fee.toLocaleString()}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>₦{orderDetails.pricing.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery Address & OTP */}
        <div className="delivery-address">
          <h4>Delivery Address</h4>
          <p>{orderDetails.delivery.address}</p>
          {orderDetails.delivery.otp_instructions && orderDetails.order.delivery_otp && (
            <div className="otp-row" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span>
                <strong>OTP:</strong> {orderDetails.order.delivery_otp}
              </span>
              <button
                className="copy-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, marginLeft: 5 }}
                onClick={() => copyToClipboard(orderDetails.order.delivery_otp!, 'OTP')}
                title="Copy OTP"
              >
                <Clipboard size={18} />
              </button>
            </div>
          )}
          {orderDetails.delivery.otp_instructions && (
            <p className="otp-info">{orderDetails.delivery.otp_instructions}</p>
          )}
        </div>

        {/* User login credentials section - Placement after delivery address or before order items */}
        {orderDetails.customer && orderDetails.customer.username && orderDetails.customer.password && (
          <div className="login-details" style={{ margin: '24px 0', padding: '16px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <h4 style={{ marginBottom: 6 }}>Your Login Details</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span><strong>Username:</strong> {orderDetails.customer.username}</span>
              <button
                className="copy-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                onClick={() => copyToClipboard(orderDetails.customer.username!, 'Username')}
                title="Copy Username"
              ><Clipboard size={16} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <span><strong>Password:</strong> {orderDetails.customer.password}</span>
              <button
                className="copy-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                onClick={() => copyToClipboard(orderDetails.customer.password!, 'Password')}
                title="Copy Password"
              ><Clipboard size={16} /></button>
            </div>
            <span style={{ display: 'block', fontSize: 12, color: '#71717a', marginTop: 2 }}>
              You can use these details to log in and track your orders anytime.
            </span>
          </div>
        )}

        {/* Payment Method */}
        <div className="payment-method">
          <h4>Payment Method</h4>
          <p>{orderDetails.order.payment_method}</p>
        </div>

        {/* Payment Status */}
        <div className="payment-status">
          <h4>Payment Status</h4>
          <div className={`status-badge ${orderDetails.payment.status}`}>
            {orderDetails.payment.status === 'confirmed'
              ? <CheckCircle size={16} />
              : <Clock size={16} />}
            {' '}{orderDetails.payment.message}
          </div>
          {orderDetails.payment.reference && (
            <p className="payment-reference">
              Reference: {orderDetails.payment.reference}
            </p>
          )}
        </div>

        {/* Order Time */}
        <div className="order-time">
          <h4>Order Time</h4>
          <p>{new Date(orderDetails.order.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Bank Transfer Payment Section */}
      {orderDetails.dva_details && orderDetails.order.payment_method === 'bank_transfer' && (
        <div className="payment-section">
          <h3>Complete Your Payment</h3>
          <div className="bank-transfer-card">
            <div className="transfer-header">
              <div className="bank-icon"><Landmark size={22} /></div>
              <h4>Bank Transfer Details</h4>
            </div>

            <div className="account-details">
              <div className="detail-row">
                <span className="label">Account Number:</span>
                <div className="value-container">
                  <span className="value">{orderDetails.dva_details.account_number}</span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(orderDetails.dva_details!.account_number)}
                    title="Copy to clipboard"
                  >
                    <Clipboard size={16} />
                  </button>
                </div>
              </div>

              <div className="detail-row">
                <span className="label">Account Name:</span>
                <span className="value">{orderDetails.dva_details.account_name}</span>
              </div>

              <div className="detail-row">
                <span className="label">Bank:</span>
                <span className="value">{orderDetails.dva_details.bank_name}</span>
              </div>

              <div className="detail-row">
                <span className="label">Amount:</span>
                <span className="value amount">₦{orderDetails.dva_details.amount.toLocaleString()}</span>
              </div>

              <div className="detail-row">
                <span className="label">Reference:</span>
                <div className="value-container">
                  <span className="value">{orderDetails.dva_details.reference}</span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(orderDetails.dva_details!.reference)}
                    title="Copy to clipboard"
                  >
                    <Clipboard size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="instructions-section">
              <h5>Payment Instructions:</h5>
              <ol className="instructions-list">
                {orderDetails.dva_details.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="payment-actions">
              {orderDetails.actions?.map((action, index) => (
                <button
                  key={index}
                  className={`action-btn ${action.primary ? 'primary' : 'secondary'}`}
                  onClick={() => handleAction(action.type)}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="payment-footer">
              <div className="expiry-info">
                <Clock size={14} className="expiry-icon" />
                <span>Expires in {orderDetails.dva_details.expires_in}</span>
              </div>
              <div className="support-info">
                <Phone size={14} className="support-icon" />
                <span>Support: {orderDetails.dva_details.support_contact}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="track-order-btn"
          onClick={() => loadTrackOrderData(true)}
          disabled={loadingTrackOrder}
        >
          {loadingTrackOrder ? 'Loading...' : 'Track Order'}
        </button>
        <Link to="/recommendations" className="order-again-btn">
          Order Again
        </Link>
      </div>

      {/* Support Section */}
      <div className="support-section">
        <h3>Need Help?</h3>
        <div className="support-options">
          <a href={`tel:${orderDetails.support.phone}`} className="support-btn">
            <Phone size={16} /> Call Support ({orderDetails.support.phone})
          </a>
          <a href={`mailto:${orderDetails.support.email}`} className="support-btn">
            <Mail size={16} /> Email Support
          </a>
          {orderDetails.support.whatsapp && (
            <a href={orderDetails.support.whatsapp} target="_blank" rel="noopener noreferrer" className="support-btn">
              <MessageCircle size={16} /> WhatsApp Support
            </a>
          )}
        </div>
      </div>

      {/* Cancellation Suggestions Modal */}
      {showCancellationSuggestions && cancellationData && (
        <div className="modal-overlay" onClick={() => setShowCancellationSuggestions(false)}>
          <div className="cancellation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🍽️ Order Cancelled</h2>
              <button
                className="modal-close"
                onClick={() => setShowCancellationSuggestions(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="cancellation-message">
                <p>{cancellationData.message}</p>
                <p className="original-item">
                  <strong>Original Item:</strong> {cancellationData.original_item}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                {cancellationData.quick_actions?.map((action: any, index: number) => (
                  <button
                    key={index}
                    className={`quick-action-btn ${action.type}`}
                    onClick={() => handleQuickAction(action)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Suggestions Sections */}
              {cancellationData.suggestions && (
                <div className="suggestions-container">
                  {/* Substitutes */}
                  {cancellationData.suggestions.substitutes?.length > 0 && (
                    <div className="suggestions-section">
                      <h3>🔄 Exact Substitutes</h3>
                      <div className="suggestions-grid">
                        {cancellationData.suggestions.substitutes.map((item: any) => (
                          <SuggestionCard
                            key={item.id}
                            item={item}
                            onAddToCart={() => handleAddToCart(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Similar Category */}
                  {cancellationData.suggestions.similar_category?.length > 0 && (
                    <div className="suggestions-section">
                      <h3>📋 Similar Items</h3>
                      <div className="suggestions-grid">
                        {cancellationData.suggestions.similar_category.map((item: any) => (
                          <SuggestionCard
                            key={item.id}
                            item={item}
                            onAddToCart={() => handleAddToCart(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget Alternatives */}
                  {cancellationData.suggestions.budget_alternatives?.length > 0 && (
                    <div className="suggestions-section">
                      <h3>💰 Budget-Friendly Options</h3>
                      <div className="suggestions-grid">
                        {cancellationData.suggestions.budget_alternatives.map((item: any) => (
                          <SuggestionCard
                            key={item.id}
                            item={item}
                            onAddToCart={() => handleAddToCart(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Support Options */}
              {cancellationData.support_options && (
                <div className="support-options">
                  <h4>Need Help?</h4>
                  <div className="support-buttons">
                    {cancellationData.support_options.email && (
                      <a
                        href={`mailto:${cancellationData.support_options.email}`}
                        className="support-btn"
                      >
                        ✉️ Email Support
                      </a>
                    )}
                    {cancellationData.support_options.phone && (
                      <a
                        href={`tel:${cancellationData.support_options.phone}`}
                        className="support-btn"
                      >
                        📞 Call Support
                      </a>
                    )}
                    {cancellationData.support_options.chat && (
                      <a
                        href={cancellationData.support_options.chat}
                        className="support-btn"
                      >
                        💬 Live Chat
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Track Order Modal */}
      {showTrackOrderModal && orderDetails && (
        <div className="modal-overlay" onClick={() => setShowTrackOrderModal(false)}>
          <div className="track-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Track Your Order</h2>
              <button
                className="modal-close"
                onClick={() => setShowTrackOrderModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              {/* Order Info */}
              <div className="track-order-header">
                <div className="order-info">
                  <h3>Order #{trackOrderData?.order_number || orderDetails?.order.order_number}</h3>
                  <p className="order-status">
                    Status: <span className={`status-${trackOrderData?.status || orderDetails?.order.status}`}>
                      {trackOrderData?.status_display || orderDetails?.order.status_display}
                    </span>
                  </p>
                  <p className="estimated-delivery">
                    Estimated Delivery: {trackOrderData?.estimated_delivery_time || orderDetails?.delivery.estimated_time}
                  </p>
                </div>

                {/* Live Status Indicator */}
                <div className="live-status">
                  <div className={`status-indicator ${webSocketConnected ? 'connected' : 'disconnected'}`}>
                    <div className="pulse-dot"></div>
                    <span>{webSocketConnected ? 'Live Tracking' : 'Connecting...'}</span>
                  </div>
                </div>
              </div>

              {/* Real-time Timeline */}
              <div className="track-timeline">
                <h4>Order Progress</h4>
                <div className="timeline-container">
                  {(trackOrderData?.timeline || orderDetails?.timeline || []).map((step: any, index: number) => (
                    <div key={index} className={`timeline-item ${step.completed ? 'completed' : 'pending'}`}>
                      <div className="timeline-marker">
                        <div className="timeline-icon">
                          {step.icon === 'shopping-cart' && <ShoppingCart size={18} />}
                          {step.icon === 'credit-card' && <CreditCardIcon size={18} />}
                          {step.icon === 'check' && <Check size={18} />}
                          {step.icon === 'check-circle' && <CheckCircle size={18} />}
                          {step.icon === 'chef-hat' && <ChefHat size={18} />}
                          {step.icon === 'package' && <Package size={18} />}
                          {step.icon === 'truck' && <Truck size={18} />}
                          {step.icon === 'utensils' && <Utensils size={18} />}
                        </div>
                      </div>
                      <div className="timeline-content">
                        <h5>{step.title}</h5>
                        <p>{step.description}</p>
                        <span className="timeline-time">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              {(trackOrderData?.courier || orderDetails?.courier) && (
                <div className="delivery-info-section">
                  <h4>Delivery Information</h4>
                  <div className="courier-card">
                    <div className="courier-avatar">
                      <UserIcon size={40} />
                    </div>
                    <div className="courier-details">
                      <h5>{trackOrderData?.courier?.name || orderDetails?.courier?.name}</h5>
                      <p className="courier-rating">Rating: {trackOrderData?.courier?.rating || orderDetails?.courier?.rating}</p>
                      <p className="courier-vehicle">Vehicle: {trackOrderData?.courier?.vehicle_type || orderDetails?.courier?.vehicle_type}</p>
                    </div>
                    <button
                      className="call-courier-btn"
                      onClick={() => window.location.href = `tel:${trackOrderData?.courier?.phone || orderDetails?.courier?.phone}`}
                    >
                      Call Courier
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="delivery-address-section">
                <h4>Delivery Address</h4>
                <p>{trackOrderData?.delivery_address || orderDetails?.delivery.address}</p>
                {trackOrderData?.delivery_otp && (
                  <div className="otp-display">
                    <strong>Delivery OTP:</strong> {trackOrderData.delivery_otp}
                    <button
                      className="copy-otp-btn"
                      onClick={() => copyToClipboard(trackOrderData.delivery_otp, 'OTP')}
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="track-actions">
                <button
                  className="action-btn primary"
                  onClick={() => window.location.href = `tel:${trackOrderData?.support?.phone || orderDetails?.support.phone}`}
                >
                  Contact Support
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => window.location.href = `mailto:${trackOrderData?.support?.email || orderDetails?.support.email}`}
                >
                  Email Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Suggestion Card Component
const SuggestionCard: React.FC<{ item: any; onAddToCart: () => void }> = ({ item, onAddToCart }) => {
  return (
    <div className="suggestion-card">
      <div className="suggestion-image">
        <img src={item.image} alt={item.name} />
        {item.savings && (
          <div className="savings-badge">
            Save ₦{item.savings.toLocaleString()}
          </div>
        )}
      </div>

      <div className="suggestion-content">
        <div className="suggestion-header">
          <h4>{item.name}</h4>
          <div className="vendor-info">
            <img src={item.vendor_logo} alt={item.vendor_name} className="vendor-logo" />
            <span className="vendor-name">{item.vendor_name}</span>
            <div className="vendor-rating">
              ⭐ {item.vendor_rating}
            </div>
          </div>
        </div>

        <p className="suggestion-description">{item.description}</p>

        <div className="suggestion-meta">
          <span className="delivery-time">🕒 {item.delivery_time}</span>
          <span className="preparation-time">👨‍🍳 {item.preparation_time}min prep</span>
          {item.similarity_reason && (
            <span className="similarity-reason">{item.similarity_reason}</span>
          )}
        </div>

        <div className="suggestion-footer">
          <div className="price">₦{item.price.toLocaleString()}</div>
          <button
            className="add-to-cart-btn"
            onClick={onAddToCart}
            disabled={!item.is_available}
          >
            {item.is_available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrderConfirmation;