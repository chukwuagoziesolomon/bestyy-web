import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle, ChevronRight, HelpCircle, X, MessageCircle } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

// Status styles
const statusStyles = {
  color: '#10B981', 
  background: '#D1FAE5',
  dot: '#10B981'
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  date: string;
  items: OrderItem[];
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  restaurant: string;
  estimatedDelivery: string;
  orderNumber: string;
  paymentMethod: string;
  deliveryInstructions: string;
  customerName: string;
  phoneNumber: string;
  paymentDetails: string;
}

interface OrderDetailsPageProps {
  orderId?: string;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ orderId: propOrderId }) => {
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  // Use the orderId from props or from URL params
  const currentOrderId = propOrderId || paramOrderId;

  // Responsive styles
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      paddingBottom: '100px',
      maxWidth: isTablet ? '768px' : '414px', // Tablet: 768px, Mobile: 414px
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
    },
    menuButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
    },
    restaurantSection: {
      padding: '20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
    },
    restaurantInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    },
    restaurantLogo: {
      width: '60px',
      height: '60px',
      backgroundColor: '#DC2626',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
    },
    logoText: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    restaurantDetails: {
      flex: 1,
    },
    restaurantName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 8px 0',
    },
    statusText: {
      fontSize: '12px',
      fontWeight: '500',
    },
    totalAmount: {
      textAlign: 'right' as const,
    },
    totalText: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
    },
    orderDate: {
      color: '#6B7280',
      fontSize: '14px',
      margin: 0,
      fontWeight: 400,
    },
    content: {
      padding: '20px',
    },
    statusSection: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    statusHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    statusTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
    },
    statusBadge: {
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block',
    },
    statusTime: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '4px 0 0 0',
    },
    section: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    sectionCard: {
      backgroundColor: '#fff',
      margin: '16px 20px',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    deliveryInfo: {
      lineHeight: 1.5,
    },
    deliveryAddress: {
      fontSize: '14px',
      color: '#6B7280',
      margin: '0 0 4px 0',
      whiteSpace: 'pre-line' as const,
    },
    deliveryPhone: {
      fontSize: '14px',
      color: '#6B7280',
      margin: 0,
    },
    paymentInfo: {
      lineHeight: 1.5,
    },
    paymentRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentLabel: {
      fontSize: '14px',
      color: '#6B7280',
    },
    paymentStatus: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
    },
    reorderButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: 'calc(100% - 40px)',
      margin: '20px',
      padding: '16px',
      backgroundColor: '#10B981',
      border: 'none',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      position: 'fixed' as const,
      bottom: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '374px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 16px 0',
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      margin: '0 0 4px 0',
    },
    itemQuantity: {
      fontSize: '12px',
      color: '#6b7280',
      margin: 0,
    },
    itemPrice: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
    },
    summaryLabel: {
      fontSize: '14px',
      color: '#6b7280',
    },
    summaryValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderTop: '1px solid #f3f4f6',
      marginTop: '8px',
    },
    totalLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
    },
    totalValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '8px 0',
    },
    infoLabel: {
      fontSize: '14px',
      color: '#6b7280',
      minWidth: '120px',
    },
    infoValue: {
      fontSize: '14px',
      color: '#111827',
      textAlign: 'right' as const,
      flex: 1,
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
    },
    primaryButton: {
      flex: 1,
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: '#fff',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
  };
  
  // Sample orders data
  const sampleOrders = {
    '1': {
      id: '1',
      status: 'delivered',
      date: '15, Jun 2025, 12:00 PM',
      items: [
        { name: 'fried chicken and Turkey', quantity: 1, price: 4000 },
        { name: 'Sprite (50CL)', quantity: 1, price: 1000 },
      ],
      deliveryFee: 0,
      total: 5000,
      deliveryAddress: '12, Enugu ave,222\nSilver snow',
      restaurant: 'Mr Biggs',
      estimatedDelivery: '12:30 PM',
      orderNumber: '12345',
      paymentMethod: 'Opay',
      deliveryInstructions: 'Leave at the door',
      customerName: 'Mr Biggs',
      phoneNumber: '08090530061',
      paymentDetails: '**** 2206',
    },
    '2': {
      id: '2',
      status: 'processing',
      date: '14, Jun 2025, 19:30',
      items: [
        { name: 'Jollof Rice and Chicken', quantity: 1, price: 4500 },
      ],
      deliveryFee: 500,
      total: 5000,
      deliveryAddress: '456 Eatery Road, Victoria Island, Lagos',
      restaurant: 'Kilimanjaro Restaurant',
      estimatedDelivery: '20:00 PM',
      customerName: 'Customer',
      phoneNumber: '08012345678',
      paymentDetails: '**** 1234',
    },
    '3': {
      id: '3',
      status: 'cancelled',
      date: '13, Jun 2025, 13:15',
      items: [
        { name: 'Pounded Yam and Egusi', quantity: 1, price: 3500 },
      ],
      deliveryFee: 500,
      total: 4000,
      deliveryAddress: '789 Food Court, Lekki Phase 1, Lagos',
      restaurant: 'Buka Hut',
      estimatedDelivery: '14:00 PM',
      customerName: 'Customer',
      phoneNumber: '08012345678',
      paymentDetails: '**** 1234',
    },
    '4': {
      id: '4',
      status: 'delivered',
      date: '12, Jun 2025, 20:45',
      items: [
        { name: 'Amala and Ewedu', quantity: 2, price: 1500 },
        { name: 'Beef', quantity: 2, price: 2000 },
      ],
      deliveryFee: 500,
      total: 5500,
      deliveryAddress: '321 Kitchen Avenue, Ikeja, Lagos',
      restaurant: 'Mama Put',
      estimatedDelivery: '21:30 PM',
      customerName: 'Customer',
      phoneNumber: '08012345678',
      paymentDetails: '**** 1234',
    }
  };

  // Get order by ID or use the first one as fallback
  const getOrderById = (id?: string): Order => {
    if (!id) return sampleOrders['1'] as Order;
    return (sampleOrders[id as keyof typeof sampleOrders] || sampleOrders['1']) as Order;
  };

  // Get the order data based on the current orderId
  console.log('OrderDetailsPage - currentOrderId:', currentOrderId);
  const order = getOrderById(currentOrderId);
  console.log('OrderDetailsPage - order:', order);
  
  // Calculate subtotal
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Debug logging
  React.useEffect(() => {
    console.log('OrderDetailsPage - Device detection:', { isMobile, isTablet, isDesktop });
    console.log('OrderDetailsPage - Current orderId:', currentOrderId);
  }, [isMobile, isTablet, isDesktop, currentOrderId]);

  return (
    <div style={styles.container}>


      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </button>
        <h1 style={styles.title}>Order Details</h1>
        <button
          onClick={() => navigate(-1)}
          style={styles.closeButton}
        >
          <X size={24} color="#000" />
        </button>
      </div>

      {/* Restaurant Info and Status */}
      <div style={styles.restaurantSection}>
        <div style={styles.restaurantInfo}>
          <div style={styles.restaurantLogo}>
            <span style={styles.logoText}>B</span>
          </div>
          <div style={styles.restaurantDetails}>
            <h2 style={styles.restaurantName}>{order.restaurant},</h2>
            <div style={styles.statusBadge}>
              <span style={styles.statusText}>Delivered</span>
            </div>
          </div>
          <div style={styles.totalAmount}>
            <span style={styles.totalText}>₦{order.total.toLocaleString()}</span>
          </div>
        </div>
        <p style={styles.orderDate}>{order.date}</p>
      </div>

      {/* Delivery Info */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Delivery Info</h2>
        <div style={styles.deliveryInfo}>
          <p style={styles.deliveryAddress}>{order.deliveryAddress}</p>
          <p style={styles.deliveryPhone}>{order.phoneNumber}</p>
        </div>
      </div>

      {/* Items */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Items</h2>
        {order.items.map((item, index) => (
          <div key={index} style={styles.orderItem}>
            <span style={styles.itemQuantity}>{item.quantity}x {item.name}</span>
            <span style={styles.itemPrice}>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Payment</h2>
        <div style={styles.paymentInfo}>
          <div style={styles.paymentRow}>
            <span style={styles.paymentLabel}>{order.paymentMethod} {order.paymentDetails}</span>
            <span style={styles.paymentStatus}>Paid</span>
          </div>
        </div>
      </div>

      {/* Reorder Button */}
      <button style={styles.reorderButton}>
        <MessageCircle size={20} color="#fff" />
        <span>Reorder on WhatsApp</span>
      </button>
    </div>
  );
};

export default OrderDetailsPage;
